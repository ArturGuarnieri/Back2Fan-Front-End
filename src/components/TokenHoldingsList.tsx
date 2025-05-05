
import React from 'react';
import { FanToken, fanTokensData } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface TokenHoldingsListProps {
  fanTokenHoldings: Record<FanToken, number>;
}

const TokenHoldingsList: React.FC<TokenHoldingsListProps> = ({ fanTokenHoldings }) => {
  const { t } = useLanguage();
  
  const getBonusTier = (amount: number) => {
    if (amount >= 50) return { badge: t('tier3Badge'), color: "bg-gradient-to-r from-red-600 to-red-900" };
    if (amount >= 30) return { badge: t('tier2Badge'), color: "bg-gradient-to-r from-yellow-600 to-amber-800" };
    if (amount >= 10) return { badge: t('tier1Badge'), color: "bg-gradient-to-r from-blue-600 to-blue-800" };
    return { badge: "", color: "" };
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">{t('token')}</TableHead>
            <TableHead>{t('name')}</TableHead>
            <TableHead className="text-right">{t('holdings')}</TableHead>
            <TableHead className="text-right">{t('bonusTier')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fanTokensData.map(token => {
            const holding = fanTokenHoldings[token.id as FanToken] || 0;
            const { badge, color } = getBonusTier(holding);
            
            return (
              <TableRow key={token.id}>
                <TableCell className="font-medium">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold">
                    {token.logo}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-xs text-gray-500">{token.name}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{holding}</TableCell>
                <TableCell className="text-right">
                  {badge && (
                    <Badge className={`ml-auto ${color} text-white`}>
                      {badge}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TokenHoldingsList;
