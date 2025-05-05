
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-5xl font-bold mb-4 text-chiliz">404</h1>
          <h2 className="text-2xl font-semibold mb-4">{t('pageNotFound')}</h2>
          <p className="text-gray-600 mb-8">
            {t('pageNotFoundDescription')}
          </p>
          <Button 
            onClick={() => navigate('/')} 
            className="chiliz-gradient text-white"
          >
            {t('backToHome')}
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
