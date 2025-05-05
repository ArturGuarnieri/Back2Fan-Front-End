
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useWallet } from '@/contexts/WalletContext';
import { Wallet } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useNFT } from '@/contexts/NFTContext';

const WalletLinking = () => {
  const { t } = useLanguage();
  const { address, isConnected, connectWallet } = useWallet();
  const { nativeBalance } = useNFT();

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">{t('wallet') || "Wallet"}</h2>
        
        {isConnected && address ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center p-4 border rounded-lg bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <Wallet className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium break-all">
                  {address.substring(0, 6)}...{address.substring(address.length - 4)}
                </span>
                <span className="text-sm text-gray-500">
                  {parseFloat(nativeBalance).toFixed(2)} CHZ
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="p-4 border rounded-lg bg-gray-50 text-gray-500 mb-4">
              {t('walletNotConnected') || "Wallet not connected"}
            </div>
            <Button 
              onClick={connectWallet}
              variant="outline"
              className="w-full"
            >
              {t('connectWallet') || "Connect Wallet"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletLinking;
