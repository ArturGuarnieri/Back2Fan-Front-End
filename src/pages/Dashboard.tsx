
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNFT } from '@/contexts/NFTContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import NFTCard, { NFTCardSkeleton } from '@/components/NFTCard';
import DashboardSummary from '@/components/DashboardSummary';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import TokenHoldingsList from '@/components/TokenHoldingsList';
import TokenBonusInfo from '@/components/TokenBonusInfo';
import WalletLinking from '@/components/WalletLinking';
import BlockchainNFTsList from '@/components/BlockchainNFTsList';
import { toast } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { BlockchainNFT } from '@/services/AuthService';

const Dashboard = () => {

  const { profile, loading } = useAuth();
  const { isConnected, address } = useWallet();
  const { nfts, totalCashback, fanTokenHoldings, refreshWalletData, blockchainNFTs } = useNFT();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [authChecked, setAuthChecked] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading && !profile) {
        console.log("No profile found in Dashboard, redirecting to auth");
        navigate('/auth');
      }
      setAuthChecked(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [profile, navigate, loading]);


  const handleRefreshData = async () => {
    setIsRefreshing(true);
    await refreshWalletData();
    setIsRefreshing(false);
    
    toast(t('dataRefreshed'));
  };


  const displayNFTs = blockchainNFTs.length > 0 ? blockchainNFTs : nfts;

  if (loading || !authChecked) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center w-full">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-48 mx-auto mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-40 w-full" />
              </div>
              <div>
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{t('loginRequired')}</h1>
            <p className="text-gray-600 mb-6">
              {t('pleaseLoginToAccessDashboard')}
            </p>
            <Button 
              onClick={() => navigate('/auth')} 
              className="chiliz-gradient text-white"
            >
              {t('goToLogin')}
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('userDashboard')}</h1>
          {profile && (
            <p className="text-gray-600">
              {profile.full_name ? `${t('welcome')}, ${profile.full_name}` : t('welcome')}
            </p>
          )}
          <Button 
            onClick={handleRefreshData} 
            variant="outline" 
            size="sm"
            className="mt-2"
            disabled={isRefreshing}
          >
            {isRefreshing ? 
              <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> {t('refreshingData')}</> : 
              <><RefreshCw className="h-4 w-4 mr-2" /> {t('refreshWalletData')}</>
            }
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <DashboardSummary nfts={displayNFTs} totalCashback={totalCashback} />
          </div>
          <div>
            <WalletLinking />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('yourFanTokens')}</h2>
                <TokenHoldingsList fanTokenHoldings={fanTokenHoldings} />
              </CardContent>
            </Card>
          </div>
          <div>
            <TokenBonusInfo />
          </div>
        </div>
        
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-2xl font-semibold">{t('yourPurchaseNFTs')}</h2>
          
          <Button 
            onClick={() => navigate('/stores')} 
            className="mt-2 sm:mt-0 chiliz-gradient text-white"
          >
            {t('viewPartnerStores')}
          </Button>
        </div>
        
        {isRefreshing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <NFTCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        ) : displayNFTs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayNFTs.map((nft, index) => (
              <NFTCard key={('id' in nft ? nft.id : `blockchain-${nft.tokenId}-${index}`)} nft={nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{t('noTransactionsFound')}</h3>
            <p className="text-gray-600 mb-6">
              {t('noStoresPurchases')}
            </p>
            <Button 
              onClick={() => navigate('/stores')} 
              className="chiliz-gradient text-white"
            >
              {t('exploreStores')}
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
