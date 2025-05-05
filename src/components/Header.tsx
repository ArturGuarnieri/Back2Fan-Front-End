
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const { address, isConnected, connectWallet, disconnectWallet } = useWallet();
  const { user, profile, signOut } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="border-b border-red-900/10 py-4">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/2b120122-5e59-4305-9648-4d8fc0f93026.png" 
              alt="Back2Fan Logo" 
              className="h-12 w-auto"
            />
          </Link>
        </div>

        <nav className="flex flex-wrap justify-center sm:justify-end items-center gap-1">
          <Link 
            to="/" 
            className={`px-3 py-2 text-sm rounded-md hover:bg-red-900/5 transition-colors ${location.pathname === '/' ? 'font-medium text-red-800' : 'text-gray-600'}`}
          >
            {t('home')}
          </Link>
          
          <Link 
            to="/stores" 
            className={`px-3 py-2 text-sm rounded-md hover:bg-red-900/5 transition-colors ${location.pathname === '/stores' ? 'font-medium text-red-800' : 'text-gray-600'}`}
          >
            {t('stores')}
          </Link>
          
          <Link 
            to="/dashboard" 
            className={`px-3 py-2 text-sm rounded-md hover:bg-red-900/5 transition-colors ${location.pathname === '/dashboard' ? 'font-medium text-red-800' : 'text-gray-600'}`}
          >
            {t('dashboard')}
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-gray-600 hover:bg-red-900/5 hover:text-red-800"
          >
            {language === 'pt' ? 'EN' : 'PT'}
          </Button>

          {isConnected ? (
            <Button
              variant="outline"
              className="ml-2 border-red-900/20 text-red-900 hover:bg-red-900/5"
              onClick={disconnectWallet}
            >
              {formatAddress(address!)}
            </Button>
          ) : (
            <Button
              className="ml-2 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white"
              onClick={() => navigate('/auth')}
            >
              {t('connectWallet')}
            </Button>
          )}
          
          {user && (
            <Button
              variant="outline"
              className="ml-2 border-red-900/20 text-red-900 hover:bg-red-900/5"
              onClick={handleAuthAction}
            >
              {t('logout')}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
