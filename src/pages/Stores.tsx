
import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StoreCard from '@/components/StoreCard';
import FilterBar from '@/components/FilterBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { StoreService, Store } from '@/services/StoreService';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Stores = () => {
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClub, setSelectedClub] = useState('all');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        console.log("Fetching stores with detailed information...");
        const data = await StoreService.getStores();
        console.log("Fetched stores:", data);
        setStores(data);
      } catch (error) {
        console.error("Error fetching stores:", error);
        toast(t('error'), {
          description: t('errorFetchingStores'),
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStores();
  }, [t]);


  const filteredStores = useMemo(() => {
    if (stores.length === 0) return [];
    
    return stores.filter(store => {
      const matchesCountry = selectedCountry === 'all' ? true : store.country === selectedCountry;
      const matchesCategory = selectedCategory === 'all' ? true : store.category === selectedCategory;
      const matchesClub = selectedClub === 'all' ? true : store.club === selectedClub;
      
      return matchesCountry && matchesCategory && matchesClub;
    });
  }, [stores, selectedCountry, selectedCategory, selectedClub]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-red-900">{t('partnerStores')}</h1>
          <p className="text-gray-600">
            {t('storesDescription')}
          </p>
        </div>
        
        <FilterBar 
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory}
          selectedClub={selectedClub}
          setSelectedClub={setSelectedClub}
        />
        
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-red-900" />
            <p className="text-xl">{t('loading')}</p>
          </div>
        ) : filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredStores.map(store => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">{t('noStoresFound')}</h3>
            <p className="text-gray-600">
              {t('adjustFilters')}
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Stores;
