
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWallet } from '@/contexts/WalletContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { StoreService } from '@/services/StoreService';

const Index = () => {
  const navigate = useNavigate();
  const { connectWallet, isConnected } = useWallet();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [featuredStores, setFeaturedStores] = useState([]);
  
  useEffect(() => {
    const loadFeaturedStores = async () => {
      const stores = await StoreService.getFeaturedStores();
      setFeaturedStores(stores);
    };
    
    loadFeaturedStores();
  }, []);
  
  const handleGetStarted = () => {
    if (isConnected) {
      navigate('/stores');
    } else {
      connectWallet();
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">

        <section className="py-12 md:py-24 bg-gradient-to-b from-white to-gray-100">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="/2b120122-5e59-4305-9648-4d8fc0f93026.png" 
                alt="Back2Fan Logo" 
                className="h-24 md:h-32 w-auto"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('heroTitle')} <span className="text-red-600">{t('heroTitleHighlight')}</span> {t('heroTitleEnd')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t('heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={handleGetStarted} 
                size="lg" 
                className="chiliz-gradient text-white text-lg px-8"
              >
                {isConnected ? t('viewStores') : t('connectWallet')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg"
                onClick={() => navigate('/dashboard')}
              >
                {t('viewDashboard')}
              </Button>
              {isAdmin && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg text-red-900 border-red-900 hover:bg-red-50"
                  onClick={() => navigate('/admin')}
                >
                  Painel de Admin
                </Button>
              )}
            </div>
          </div>
        </section>
        
 
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t('howItWorks')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full chiliz-gradient flex items-center justify-center text-white text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('step1Title')}</h3>
                <p className="text-gray-600">
                  {t('step1Description')}
                </p>
              </div>
              

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full chiliz-gradient flex items-center justify-center text-white text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('step2Title')}</h3>
                <p className="text-gray-600">
                  {t('step2Description')}
                </p>
              </div>
 
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full chiliz-gradient flex items-center justify-center text-white text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">{t('step3Title')}</h3>
                <p className="text-gray-600">
                  {t('step3Description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">{t('featuredStores')}</h2>
            <p className="text-center text-gray-600 mb-12">
              {t('featuredStoresDescription')}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredStores && featuredStores.length > 0 ? (
                featuredStores.map((store: any, index: number) => (
                  <div key={store.id || index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-xl font-bold mb-4">
                      {store.logo || store.name[0]}
                    </div>
                    <h3 className="font-semibold">{store.name}</h3>
                    <p className="text-chiliz font-medium">{store.cashback}% {t('cashback')}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-xl font-bold mb-4">
                      A
                    </div>
                    <h3 className="font-semibold">Americanas</h3>
                    <p className="text-chiliz font-medium">3.5% {t('cashback')}</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-xl font-bold mb-4">
                      P
                    </div>
                    <h3 className="font-semibold">Palmeiras Store</h3>
                    <p className="text-chiliz font-medium">7% {t('cashback')}</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-xl font-bold mb-4">
                      A
                    </div>
                    <h3 className="font-semibold">Amazon</h3>
                    <p className="text-chiliz font-medium">3% {t('cashback')}</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-xl font-bold mb-4">
                      N
                    </div>
                    <h3 className="font-semibold">Netshoes</h3>
                    <p className="text-chiliz font-medium">6% {t('cashback')}</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="text-center mt-10">
              <Button 
                onClick={() => navigate('/stores')} 
                className="chiliz-gradient text-white"
              >
                {t('viewAllStores')}
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 chiliz-gradient">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('ctaTitle')}
            </h2>
            <p className="text-white text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              {t('ctaDescription')}
            </p>
            <Button 
              onClick={handleGetStarted} 
              variant="secondary" 
              size="lg" 
              className="font-semibold"
            >
              {isConnected ? t('viewStores') : t('connectWallet')}
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
