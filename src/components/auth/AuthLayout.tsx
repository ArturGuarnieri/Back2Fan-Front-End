
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md p-6 md:p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('welcomeToBack2Fan')}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{t('connectWalletToEnter')}</p>
          </div>
          
          <Tabs defaultValue="wallet" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="wallet">
                <Wallet className="h-4 w-4 mr-2" />
                {t('metamaskConnectWallet')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="wallet" className="space-y-4 pt-4">
              {children}
            </TabsContent>
          </Tabs>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
            {t('termsAndPrivacyNotice')}
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthLayout;
