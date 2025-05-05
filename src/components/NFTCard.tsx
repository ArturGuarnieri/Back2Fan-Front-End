
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NFT } from '@/contexts/NFTContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlockchainNFT } from '@/services/AuthService';
import { ExternalLink, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NFTCardProps {
  nft: NFT | BlockchainNFT;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const { t } = useLanguage();
  
  const isBlockchainNFT = 'metadata' in nft && !!nft.metadata;
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  if (isBlockchainNFT) {
    const blockchainNFT = nft as BlockchainNFT;
    const metadata = blockchainNFT.metadata;
    
    if (!metadata) return null;
    
    const storeAttr = metadata.attributes?.find(attr => attr.trait_type === 'Loja');
    const valueAttr = metadata.attributes?.find(attr => attr.trait_type === 'Valor da Compra');
    const cashbackPercentAttr = metadata.attributes?.find(attr => attr.trait_type === 'Cashback');
    const statusAttr = metadata.attributes?.find(attr => attr.trait_type === 'Status');
    const buyerAttr = metadata.attributes?.find(attr => attr.trait_type === 'Comprador');
    
    const store = storeAttr?.value || 'Unknown Store';
    const value = valueAttr ? parseFloat(valueAttr.value) : 0;
    const cashbackPercent = cashbackPercentAttr ? cashbackPercentAttr.value : '0%';
    const status = statusAttr?.value || 'Pending';
    const destination = buyerAttr?.value || '0x0000000000000000000000000000000000000000';
    
    const cashbackValue = value * (parseFloat(cashbackPercent.replace('%', '')) / 100);
    
    return (
      <Card className={`flex flex-col h-full ${status === "Confirmed" ? "border-green-500" : "border-yellow-500"}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">{store}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              status === "Confirmed" 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {t(status) || status}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 space-y-2">
            {metadata.image && (
              <div className="relative aspect-square mb-2">
                <img 
                  src={metadata.image} 
                  alt={metadata.name || `NFT #${blockchainNFT.tokenId}`}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Image+Not+Available';
                  }}
                  loading="lazy"
                />
              </div>
            )}
            
            <div className="flex justify-between">
              <span>{t('amount') || 'Amount'}:</span>
              <span className="font-medium">R$ {value.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>{t('cashback') || 'Cashback'}:</span>
              <span className="font-medium text-chiliz">{cashbackValue.toFixed(2)} CHZ ({cashbackPercent})</span>
            </div>
            
            <div className="flex justify-between">
              <span>{t('wallet') || 'Wallet'}:</span>
              <span className="font-medium">{formatAddress(destination)}</span>
            </div>

            <div className="flex justify-end space-x-2 mt-3">
              <NFTDetailsDialog nft={blockchainNFT} />
              
              <Button 
                size="sm" 
                variant="outline" 
                className="px-2"
                asChild
              >
                <a 
                  href={`https://spicy-explorer.chiliz.com/tx/${blockchainNFT.txHash}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const standardNFT = nft as NFT;
  
  return (
    <Card className={`flex flex-col h-full transition-all duration-300 ${standardNFT.status === "Confirmado" ? "border-green-500" : "border-yellow-500 animate-pulse-scale"}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{standardNFT.store}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            standardNFT.status === "Confirmado" 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {t(standardNFT.status) || standardNFT.status}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex justify-between">
            <span>{t('date') || 'Date'}:</span>
            <span>{standardNFT.date}</span>
          </div>
          
          <div className="flex justify-between">
            <span>{t('amount') || 'Amount'}:</span>
            <span className="font-medium">R$ {standardNFT.amount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>{t('cashback') || 'Cashback'}:</span>
            <span className="font-medium text-chiliz">{standardNFT.cashback} {standardNFT.tokenType}</span>
          </div>
          
          <div className="flex justify-between">
            <span>{t('wallet') || 'Wallet'}:</span>
            <span className="font-medium">{formatAddress(standardNFT.destination)}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
          ID: {standardNFT.id}
        </div>
      </CardContent>
    </Card>
  );
};

interface NFTDetailsDialogProps {
  nft: BlockchainNFT;
}

const NFTDetailsDialog: React.FC<NFTDetailsDialogProps> = ({ nft }) => {
  const { t } = useLanguage();
  
  if (!nft.metadata) return null;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="px-2">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{nft.metadata.name || `NFT #${nft.tokenId}`}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {nft.metadata.image && (
            <div className="flex justify-center">
              <img 
                src={nft.metadata.image} 
                alt={nft.metadata.name || `NFT #${nft.tokenId}`}
                className="max-h-64 rounded-lg shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Image+Not+Available';
                }}
              />
            </div>
          )}
          
          <div>
            {nft.metadata.description && (
              <div className="mb-4">
                <h3 className="text-md font-medium mb-1">{t('description') || "Description"}</h3>
                <p className="text-sm text-gray-600">{nft.metadata.description}</p>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-md font-medium mb-1">{t('details') || "Details"}</h3>
              <div className="text-sm">
                <p><span className="font-medium">{t('collection') || "Collection"}:</span> {nft.name}</p>
                <p><span className="font-medium">{t('symbol') || "Symbol"}:</span> {nft.symbol}</p>
                <p><span className="font-medium">{t('tokenId') || "Token ID"}:</span> {nft.tokenId}</p>
                <p className="truncate">
                  <span className="font-medium">{t('contract') || "Contract"}:</span> {nft.contract}
                </p>
              </div>
            </div>
            
            {nft.metadata.attributes && nft.metadata.attributes.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2">{t('attributes') || "Attributes"}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {nft.metadata.attributes.map((attr, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded-md">
                      <div className="text-xs text-gray-500">{attr.trait_type}</div>
                      <div className="font-medium text-sm">{attr.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                asChild
              >
                <a 
                  href={`https://scan-dev.chiliz.com/tx/${nft.txHash}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('viewOnExplorer') || "View on Blockchain Explorer"}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const NFTCardSkeleton = () => (
  <Card className="flex flex-col h-full">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      
      <Skeleton className="h-40 w-full mb-3" />
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200">
        <Skeleton className="h-3 w-32" />
      </div>
    </CardContent>
  </Card>
);

export default NFTCard;
