
export interface Store {
  id: number;
  name: string;
  category: string;
  country: string;
  max_cashback?: string;
  club?: string;
  cashback: string;
  affiliateLink: string;
  logo?: string;
}

export interface NFT {
  id: string;
  store: string;
  amount: number;
  date: string;
  cashback: number;
  status: "Pendente" | "Confirmado";
  destination: string;
  tokenType?: FanToken;
}

export type FanToken = "CHZ" | "PSG" | "BAR" | "JUV" | "ATM" | "NAP" | "PFL" | "ASR" | "CITY";

export const fanTokensData = [

  { 
    id: "PSG", 
    name: "Paris Saint-Germain", 
    symbol: "PSG", 
    logo: "P",
    clubId: "PSG"
  },
  { 
    id: "VERDAO", 
    name: "Palmeiras", 
    symbol: "VERDAO", 
    logo: "P",
    clubId: "Palmeiras"
  }
];

export const storeData: Store[] = [
  { 
    id: 1, 
    name: "Nike", 
    category: "Esportes", 
    country: "Brasil", 
    club: "Diversos", 
    cashback: "5%", 
    affiliateLink: "https://nike.com",
    logo: "N"
  },
  { 
    id: 2, 
    name: "Palmeiras Store", 
    category: "Clube", 
    country: "Brasil", 
    club: "Palmeiras", 
    cashback: "7%", 
    affiliateLink: "https://palmeirasstore.com",
    logo: "P"
  },
  { 
    id: 3, 
    name: "Amazon", 
    category: "Tecnologia", 
    country: "Global", 
    club: "Diversos", 
    cashback: "3%", 
    affiliateLink: "https://amazon.com",
    logo: "A"
  },
  { 
    id: 4, 
    name: "Adidas", 
    category: "Esportes", 
    country: "Global", 
    club: "Diversos", 
    cashback: "4.5%", 
    affiliateLink: "https://adidas.com",
    logo: "A"
  },
  { 
    id: 5, 
    name: "PSG Official Store", 
    category: "Clube", 
    country: "França", 
    club: "PSG", 
    cashback: "6%", 
    affiliateLink: "https://psg.fr/shop",
    logo: "P"
  },
  { 
    id: 6, 
    name: "Fnac", 
    category: "Tecnologia", 
    country: "França", 
    club: "Diversos", 
    cashback: "2.5%", 
    affiliateLink: "https://fnac.com",
    logo: "F"
  },
  { 
    id: 7, 
    name: "Casas Bahia", 
    category: "Varejo", 
    country: "Brasil", 
    club: "Diversos", 
    cashback: "3.5%", 
    affiliateLink: "https://casasbahia.com.br",
    logo: "C"
  },
  { 
    id: 8, 
    name: "Santos FC Store", 
    category: "Clube", 
    country: "Brasil", 
    club: "Santos", 
    cashback: "7%", 
    affiliateLink: "https://santosfc.com.br/loja",
    logo: "S"
  }
];

export const countries = [...new Set(storeData.map(store => store.country))];
export const categories = [...new Set(storeData.map(store => store.category))];
export const clubs = [...new Set(storeData.map(store => store.club ?? ""))].filter(Boolean);
