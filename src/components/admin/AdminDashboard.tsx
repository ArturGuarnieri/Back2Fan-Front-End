
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleUserRound, Store, ShoppingBag, BadgePercent } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TokenBonusInfo from '@/components/TokenBonusInfo';

const AdminDashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Lojas</CardTitle>
            <Store className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">+2 no último mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <CircleUserRound className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-gray-500">+156 no último mês</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Compras Realizadas</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,945</div>
            <p className="text-xs text-gray-500">+20% vs. mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Cashback Total</CardTitle>
            <BadgePercent className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9,721 CHZ</div>
            <p className="text-xs text-gray-500">+8% vs. mês anterior</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Atividades</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="font-medium">Nova loja adicionada: Nike</p>
                <p className="text-gray-500 text-xs">Hoje, 14:30</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="font-medium">Cashback atualizado: Adidas</p>
                <p className="text-gray-500 text-xs">Ontem, 09:15</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="font-medium">Usuário promovido a admin</p>
                <p className="text-gray-500 text-xs">22/05/2023, 16:45</p>
              </div>
              
              <div className="border-b pb-2">
                <p className="font-medium">Nova categoria de cashback: Eletrônicos</p>
                <p className="text-gray-500 text-xs">20/05/2023, 11:30</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <TokenBonusInfo />
      </div>
    </div>
  );
};

export default AdminDashboard;
