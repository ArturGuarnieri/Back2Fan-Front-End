
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-100 mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/2b120122-5e59-4305-9648-4d8fc0f93026.png" 
                alt="Back2Fan Logo" 
                className="h-10 w-auto mr-2"
              />
              <span className="text-sm font-semibold">Back2Fan</span>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-6 text-sm text-gray-600 items-center">
            <a href="#" className="hover:text-chiliz mb-2 md:mb-0">{t('about')}</a>
            <a href="#" className="hover:text-chiliz mb-2 md:mb-0">{t('faq')}</a>
            <a href="#" className="hover:text-chiliz mb-2 md:mb-0">{t('contact')}</a>
            <a href="#" className="hover:text-chiliz">{t('termsOfUse')}</a>
          </div>
          
          <div className="mt-4 md:mt-0 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Back2Fan. {t('allRightsReserved')}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
