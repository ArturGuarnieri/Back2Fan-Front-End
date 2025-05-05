
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StoreService } from '@/services/StoreService';

interface FilterBarProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedClub: string;
  setSelectedClub: (club: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedCountry,
  setSelectedCountry,
  selectedCategory,
  setSelectedCategory,
  selectedClub,
  setSelectedClub,
}) => {
  const [countries, setCountries] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [clubs, setClubs] = useState<string[]>([]);
  const { t } = useLanguage();
  
  useEffect(() => {
    const fetchStoresForFilters = async () => {
      try {
        const stores = await StoreService.getStores();
        
        const uniqueCountries = [...new Set(stores.map(store => store.country))].filter(Boolean).sort();
        const uniqueCategories = [...new Set(stores.map(store => store.category))].filter(Boolean).sort();
        const uniqueClubs = [...new Set(stores.map(store => store.club))].filter(Boolean).sort();
        
        setCountries(uniqueCountries);
        setCategories(uniqueCategories);
        setClubs(uniqueClubs);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    
    fetchStoresForFilters();
  }, []);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Select 
            value={selectedCountry} 
            onValueChange={setSelectedCountry}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('filterByCountry')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">{t('allCountries')}</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('filterByCategory')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        {clubs.length > 0 && (
          <div className="flex-1">
            <Select 
              value={selectedClub} 
              onValueChange={setSelectedClub}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('filterByClub')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">{t('allClubs')}</SelectItem>
                  {clubs.map(club => (
                    <SelectItem key={club} value={club}>
                      {club}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
