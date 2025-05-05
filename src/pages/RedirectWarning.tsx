
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { storeData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const RedirectWarning = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState(10);
  
  const store = storeData.find(s => s.id.toString() === storeId);
  

  useEffect(() => {
    if (!store) {
      navigate('/stores');
    }
  }, [store, navigate]);
  

  useEffect(() => {
    if (countdown <= 0 && store) {
      window.location.href = store.affiliateLink;
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, store]);
  

  const handleRedirectNow = () => {
    if (store) {
      window.location.href = store.affiliateLink;
    }
  };
  

  const handleCancel = () => {
    navigate('/stores');
  };
  
  if (!store) return null;
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-black/5 backdrop-blur-sm p-8 rounded-lg border border-red-900/20 shadow-lg">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <AlertTriangle className="h-16 w-16 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2 text-red-600">{t('redirectWarningTitle')}</h1>
            
            <div className="mt-4 text-xl">
              {store.name}
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <p className="text-lg text-center">
              {t('redirectWarning')}
            </p>
            
            <div className="h-1 w-full bg-gray-300 rounded">
              <div 
                className="h-full bg-red-600 rounded transition-all duration-1000" 
                style={{ width: `${(countdown / 10) * 100}%` }}
              />
            </div>
            
            <p className="text-center text-lg font-medium">
              {t('redirectingIn')} <span className="text-red-600 font-bold">{countdown}</span> {t('seconds')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={handleCancel}
              variant="outline" 
              className="border-red-900"
            >
              {t('cancel')}
            </Button>
            
            <Button 
              onClick={handleRedirectNow} 
              className="bg-red-900 hover:bg-red-800 text-white"
            >
              {t('buyNow')}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RedirectWarning;
