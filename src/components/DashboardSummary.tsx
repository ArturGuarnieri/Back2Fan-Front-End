
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NFT } from '@/contexts/NFTContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { BlockchainNFT } from '@/services/AuthService';

interface DashboardSummaryProps {
  nfts: NFT[] | BlockchainNFT[];
  totalCashback: number;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ nfts, totalCashback }) => {
  const { t } = useLanguage();
  
  const pendingCount = nfts.filter(nft => {
    if ('metadata' in nft) {
      const statusAttr = nft.metadata?.attributes?.find(attr => attr.trait_type === 'Status');
      return statusAttr?.value === 'Pending';
    }
    return (nft as NFT).status === 'Pendente';
  }).length;
  
  const confirmedCount = nfts.filter(nft => {
    if ('metadata' in nft) {
      const statusAttr = nft.metadata?.attributes?.find(attr => attr.trait_type === 'Status');
      return statusAttr?.value === 'Confirmed';
    }
    return (nft as NFT).status === 'Confirmado';
  }).length;
  
  // Calculate total pending cashback
  const pendingCashback = nfts.reduce((total, nft) => {
    if ('metadata' in nft && nft.metadata?.attributes) {
      const statusAttr = nft.metadata.attributes.find(attr => attr.trait_type === 'Status');
      const valueAttr = nft.metadata.attributes.find(attr => attr.trait_type === 'Valor da Compra');
      const cashbackAttr = nft.metadata.attributes.find(attr => attr.trait_type === 'Cashback');
      
      if (statusAttr?.value === 'Pending' && valueAttr?.value && cashbackAttr?.value) {
        const purchaseAmount = parseFloat(valueAttr.value);
        const cashbackPercentage = parseFloat(cashbackAttr.value.replace('%', '')) / 100;
        return total + (purchaseAmount * cashbackPercentage);
      }
    } else if ('cashback' in nft && (nft as NFT).status === 'Pendente') {
      return total + ((nft as NFT).cashback || 0);
    }
    
    return total;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-red-900 to-red-700 text-white">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-1">{t('totalCashback')}</h3>
          <p className="text-3xl font-bold">{totalCashback.toFixed(2)} CHZ</p>
          <p className="text-sm mt-2 opacity-80">{t('accumulatedInWallet')}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-1">{t('transactions')}</h3>
          <p className="text-3xl font-bold">{nfts.length}</p>
          <div className="text-sm mt-2 text-gray-500 flex justify-between">
            <span>{t('confirmed')}: {confirmedCount}</span>
            <span>{t('pending')}: {pendingCount}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-1">{t('pendingCashback')}</h3>
          <p className="text-3xl font-bold">{pendingCashback.toFixed(2)} CHZ</p>
          <p className="text-sm mt-2 text-gray-500">
            {t('inTransactions').replace('{count}', pendingCount.toString())}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
