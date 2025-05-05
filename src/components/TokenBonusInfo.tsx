
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award } from 'lucide-react';

const TokenBonusInfo: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-red-600" />
          {t('bonusSystem')}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <p className="mb-3">
          {t('bonusSystemExplanation')}
        </p>
        
        <div className="space-y-3">
          <div className="p-2 border rounded-md">
            <div className="font-semibold text-blue-800 flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              {t('tier1Name')}
            </div>
            <div className="text-xs mt-1">
              {t('tier1Description')}
            </div>
          </div>
          
          <div className="p-2 border rounded-md">
            <div className="font-semibold text-yellow-800 flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              {t('tier2Name')}
            </div>
            <div className="text-xs mt-1">
              {t('tier2Description')}
            </div>
          </div>
          
          <div className="p-2 border rounded-md">
            <div className="font-semibold text-red-800 flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              {t('tier3Name')}
            </div>
            <div className="text-xs mt-1">
              {t('tier3Description')}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          {t('bonusExample')}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenBonusInfo;
