
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store } from '@/services/StoreService';
import { FanToken, FanTokenService } from '@/services/FanTokenService';
import { useNFT } from '@/contexts/NFTContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { Badge } from "@/components/ui/badge";
import { Coins, BadgePercent, Info, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StoreCardProps {
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [fanTokens, setFanTokens] = useState<FanToken[]>([]);
  const [loading, setLoading] = useState(false);
  const { simulatePurchase, fanTokenHoldings } = useNFT();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (showTokenDialog) {
      const fetchFanTokens = async () => {
        setLoading(true);
        try {
          const tokens = await FanTokenService.getFanTokens();
          console.log("Fetched fan tokens:", tokens);
          setFanTokens(tokens);
          
          if (tokens.length > 0 && !selectedToken) {
            setSelectedToken(tokens[0].slug);
          }
        } catch (error) {
          console.error("Error fetching fan tokens:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchFanTokens();
    }
  }, [showTokenDialog]);

  const getTokenBonus = (tokenSlug: string): number => {
    const token = fanTokens.find(t => t.slug === tokenSlug);
    if (!token) return 0;
    
    if (store.club && token.slug === store.club.toLowerCase()) {
      return 2; 
    }
    
    return 0;
  };
  
  const getHoldingBonus = (tokenSlug: string): number => {
    const token = fanTokens.find(t => t.slug === tokenSlug);
    if (!token || !store.club || token.slug !== store.club.toLowerCase()) {
      return 0;
    }
    
    const tokenAmount = fanTokenHoldings[tokenSlug] || 0;
    
    if (tokenAmount >= 50) return 2;
    if (tokenAmount >= 30) return 1;
    if (tokenAmount >= 10) return 0.5;
    
    return 0;
  };

  const handleProceed = () => {
    if (!selectedToken) return;
    
    simulatePurchase(store.name, 100, selectedToken);
    setShowTokenDialog(false);
    
    navigate(`/redirect/${store.id}`);
  };

  const selectedTokenData = fanTokens.find(t => t.slug === selectedToken);
  
  const tokenBonus = selectedToken ? getTokenBonus(selectedToken) : 0;
  const holdingBonus = selectedToken ? getHoldingBonus(selectedToken) : 0;
  const totalBonus = tokenBonus + holdingBonus;
  
  const displayCashback = store.cashback_min === store.cashback_max 
    ? `${store.cashback_min}%` 
    : `${store.cashback_min}% - ${store.cashback_max}%`;

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-md transition-shadow border-red-900/20">
        <CardContent className="p-4 flex-grow">
          <div className="mb-4 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-900/20 flex items-center justify-center text-2xl font-bold text-red-700">
              {store.logo || store.name[0]}
            </div>
          </div>
          
          <h3 className="font-semibold text-center mb-2">{store.name}</h3>
          
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>{t('category')}:</span>
              <span className="font-medium">{store.category}</span>
            </div>
            
            <div className="flex justify-between">
              <span>{t('country')}:</span>
              <span className="font-medium">{store.country}</span>
            </div>
            
            {store.club && (
              <div className="flex justify-between">
                <span>{t('club')}:</span>
                <span className="font-medium">{store.club}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>{t('cashback')}:</span>
              <span className="font-medium text-red-700">{store.max_cashback}%</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 pb-4 pt-0">
          <Button 
            className="bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 w-full text-white" 
            onClick={() => setShowTokenDialog(true)}
          >
            {t('buyNow')}
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('selectToken')} - {store.name}</DialogTitle>
            <DialogDescription>
              {t('selectTokenDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">{t('selectToken')}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center cursor-help">
                          <BadgePercent className="h-4 w-4 mr-1 text-red-600" />
                          <span className="text-xs text-red-600">{t('bonusInfo')}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-sm">{t('bonusExplanation')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                  </div>
                ) : fanTokens.length > 0 ? (
                  <RadioGroup 
                    value={selectedToken}
                    onValueChange={(value) => setSelectedToken(value)}
                    className="grid grid-cols-3 gap-2"
                  >
                    {fanTokens.map(token => {
                      const isClubToken = store.club && token.slug === store.club.toLowerCase();
                      const tokenBonus = getTokenBonus(token.slug);
                      const holdingBonus = getHoldingBonus(token.slug);
                      const totalTokenBonus = tokenBonus + holdingBonus;
                      
                      return (
                        <div 
                          key={token.id} 
                          className={`relative rounded-lg border p-3 flex flex-col items-center cursor-pointer
                            ${selectedToken === token.slug ? 'border-red-700 bg-red-50' : 'border-gray-200'} 
                            ${isClubToken ? 'ring-2 ring-red-500' : ''}
                            hover:bg-gray-50 transition-colors
                          `}
                          onClick={() => setSelectedToken(token.slug)}
                        >
                          <RadioGroupItem 
                            value={token.slug} 
                            id={token.slug} 
                            className="sr-only"
                          />
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1 overflow-hidden">
                            {token.image ? (
                              <img 
                                src={token.image} 
                                alt={token.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-bold">{token.slug.toUpperCase().substring(0, 3)}</span>
                            )}
                          </div>
                          <Label 
                            htmlFor={token.slug} 
                            className="text-sm text-center cursor-pointer font-medium"
                          >
                            {token.slug.toUpperCase()}
                          </Label>
                          <span className="text-xs text-gray-500 line-clamp-1">{token.name}</span>
                          {totalTokenBonus > 0 && (
                            <Badge className="mt-1 bg-red-600 hover:bg-red-700">+{totalTokenBonus}% {t('bonus')}</Badge>
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    {t('noTokensAvailable')}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md border">
                <div className="text-sm mb-2">
                  {selectedTokenData && (
                    <>
                      <div className="font-semibold mb-1">{t('selectedToken')}: {selectedTokenData.slug.toUpperCase()} ({selectedTokenData.name})</div>
                      
                      {(tokenBonus > 0 || holdingBonus > 0) && (
                        <div className="space-y-2 mt-2 text-sm">
                          <div className="font-medium text-red-800">{t('bonusDetails')}:</div>
                          
                          {tokenBonus > 0 && (
                            <div className="flex items-center text-green-600">
                              <BadgePercent className="h-4 w-4 mr-1" />
                              <span>{t('storeBonus')}: +{tokenBonus}%</span>
                            </div>
                          )}
                          
                          {holdingBonus > 0 && (
                            <div className="flex items-center text-blue-600">
                              <BadgePercent className="h-4 w-4 mr-1" />
                              <span>{t('holdingBonus')}: +{holdingBonus}%</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 ml-1 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs text-xs">
                                      {fanTokenHoldings[selectedToken]} {selectedToken.toUpperCase()} tokens = +{holdingBonus}% bonus
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="text-xs text-gray-600 flex items-start mt-2">
                  <Coins className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                  <span>{t('conversionNotice')}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                {t('redirectNotice')}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTokenDialog(false)}>
              {t('cancel')}
            </Button>
            <Button 
              onClick={handleProceed}
              disabled={!selectedToken} 
              className="bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white"
            >
              {t('proceed')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoreCard;
