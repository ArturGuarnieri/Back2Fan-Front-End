
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { useAuth } from './AuthContext';
import { BlockchainNFT, Token } from '@/services/AuthService';

export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  store: string;
  purchaseDate?: string;
  cashbackAmount?: string;
  amount: number;
  date: string;
  cashback: number;
  status: "Pendente" | "Confirmado";
  destination: string;
  tokenType?: string;
}

interface NFTContextType {
  nfts: NFT[];
  totalCashback: number;
  fanTokenHoldings: Record<string, number>;
  refreshWalletData: () => Promise<void>;
  loading: boolean;
  simulatePurchase: (storeName: string, amount: number, tokenType: string) => void;
  blockchainNFTs: BlockchainNFT[];
  tokens: Token[];
  nativeBalance: string;
}

const NFTContext = createContext<NFTContextType | undefined>(undefined);

const mockNFTs: NFT[] = [
  {
    id: "nft-1",
    name: "Back2Fan Purchase #1",
    description: "Purchase at Nike Store",
    image: "https://via.placeholder.com/300",
    attributes: [
      { trait_type: "Store", value: "Nike" },
      { trait_type: "Amount", value: "$150" },
      { trait_type: "Cashback", value: "5%" },
      { trait_type: "Date", value: "2025-04-15" }
    ],
    store: "Nike",
    purchaseDate: "15 Apr 2025",
    cashbackAmount: "7.5 USDT",
    amount: 150,
    date: "2025-04-15",
    cashback: 7.5,
    status: "Confirmado",
    destination: "0xb49B482BE3a7e1A13F65Ae6A45F78e666b292131",
    tokenType: "chz"
  },
  {
    id: "nft-2",
    name: "Back2Fan Purchase #2",
    description: "Purchase at Adidas Store",
    image: "https://via.placeholder.com/300",
    attributes: [
      { trait_type: "Store", value: "Adidas" },
      { trait_type: "Amount", value: "$85" },
      { trait_type: "Cashback", value: "3%" },
      { trait_type: "Date", value: "2025-04-20" }
    ],
    store: "Adidas",
    purchaseDate: "20 Apr 2025",
    cashbackAmount: "2.55 USDT",
    amount: 85,
    date: "2025-04-20",
    cashback: 2.55,
    status: "Pendente",
    destination: "0xb49B482BE3a7e1A13F65Ae6A45F78e666b292131",
    tokenType: "chz"
  }
];

const mockFanTokenHoldings: Record<string, number> = {
  chz: 10.5,
  psg: 5.75,
  bar: 0,
  juv: 2.3,
  atm: 0,
  acm: 0
};

export function NFTProvider({ children }: { children: React.ReactNode }) {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [blockchainNFTs, setBlockchainNFTs] = useState<BlockchainNFT[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fanTokenHoldings, setFanTokenHoldings] = useState<Record<string, number>>({});
  const [totalCashback, setTotalCashback] = useState(0);
  const [nativeBalance, setNativeBalance] = useState("0");
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useWallet();
  const { profile } = useAuth();

  const fetchNFTs = async () => {
    setLoading(true);
    try {
      if (!isConnected || !address) {
        setNFTs([]);
        setTotalCashback(0);
        setFanTokenHoldings({});
        setBlockchainNFTs([]);
        setTokens([]);
        setNativeBalance("0");
        return;
      }

      console.log("Fetching NFTs for address:", address);
      
      if (profile && profile.nfts && profile.tokens && profile.nativeBalance) {
        setBlockchainNFTs(profile.nfts);
        
        setTokens(profile.tokens);
        
        setNativeBalance(profile.nativeBalance);
        
        const fanTokens: Record<string, number> = {
          chz: parseFloat(profile.nativeBalance || "0")
        };
        
        profile.tokens.forEach(token => {
          const symbol = token.symbol.toLowerCase();
          fanTokens[symbol] = parseFloat(token.balance);
        });
        
        setFanTokenHoldings(fanTokens);
        

        let cashbackSum = 0;
        
        if (profile.nfts && profile.nfts.length > 0) {
          profile.nfts.forEach(nft => {
            if (nft.metadata && nft.metadata.attributes) {
              const valueAttr = nft.metadata.attributes.find(attr => attr.trait_type === 'Valor da Compra');
              const cashbackAttr = nft.metadata.attributes.find(attr => attr.trait_type === 'Cashback');
              
              if (valueAttr && cashbackAttr) {
                const value = parseFloat(valueAttr.value);
                const cashbackPercent = parseFloat(cashbackAttr.value.replace('%', '')) / 100;
                cashbackSum += value * cashbackPercent;
              }
            }
          });
        } else {
          cashbackSum = mockNFTs.reduce((sum, nft) => {
            const cashbackValue = nft.cashback || parseFloat(nft.cashbackAmount?.split(' ')[0] || '0');
            return sum + cashbackValue;
          }, 0);
        }
        
        setTotalCashback(cashbackSum);
      } else {
        setFanTokenHoldings(mockFanTokenHoldings);
        setBlockchainNFTs([]);
        setTokens([]);
        setNativeBalance("0");
        
        setNFTs(mockNFTs);
        
        const cashbackSum = mockNFTs.reduce((sum, nft) => {
          const cashbackValue = nft.cashback || parseFloat(nft.cashbackAmount?.split(' ')[0] || '0');
          return sum + cashbackValue;
        }, 0);
        
        setTotalCashback(cashbackSum);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setNFTs([]);
      setTotalCashback(0);
      setBlockchainNFTs([]);
      setTokens([]);
      setNativeBalance("0");
    } finally {
      setLoading(false);
    }
  };

  const simulatePurchase = (storeName: string, amount: number, tokenType: string) => {
    console.log(`Simulating purchase at ${storeName} for ${amount} using ${tokenType}`);

  };

  useEffect(() => {
    fetchNFTs();
  }, [address, isConnected, profile]);

  const refreshWalletData = async () => {
    await fetchNFTs();
  };

  return (
    <NFTContext.Provider
      value={{
        nfts,
        totalCashback,
        fanTokenHoldings,
        refreshWalletData,
        loading,
        simulatePurchase,
        blockchainNFTs,
        tokens,
        nativeBalance
      }}
    >
      {children}
    </NFTContext.Provider>
  );
}

export function useNFT() {
  const context = useContext(NFTContext);
  if (context === undefined) {
    throw new Error('useNFT must be used within an NFTProvider');
  }
  return context;
}
