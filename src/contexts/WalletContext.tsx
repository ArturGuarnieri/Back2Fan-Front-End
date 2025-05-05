
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { ethers } from 'ethers';
import { useLanguage } from '@/contexts/LanguageContext';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signMessage: (message: string) => Promise<string | null>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const CHILIZ_SPICY_CHAIN_ID = '0x15b32'; 
const CHILIZ_SPICY_RPC = 'https://spicy-rpc.chiliz.com';
const CHILIZ_SPICY_BLOCK_EXPLORER = 'https://spicy-explorer.chiliz.com';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { language, t } = useLanguage();
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          checkNetwork();
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const checkNetwork = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const isSpicy = chainId === CHILIZ_SPICY_CHAIN_ID;
        setIsCorrectNetwork(isSpicy);
        
        if (!isSpicy) {
          toast(`${t('wrongNetwork') || "Wrong network"}`);
        }
      }
    } catch (error) {
      console.error("Error checking network:", error);
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined') {
        if (!window.ethereum) {
          toast(`${t('metamaskNotFound') || "MetaMask not found"}`);
          return;
        }
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        await provider.send("eth_requestAccounts", []);
        const accounts = await provider.listAccounts();
        
        setAddress(accounts[0]);
        setIsConnected(true);
        
        await checkNetwork();
        
        if (!isCorrectNetwork) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: CHILIZ_SPICY_CHAIN_ID }], 
            });
            setIsCorrectNetwork(true);
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: CHILIZ_SPICY_CHAIN_ID, 
                    chainName: 'Chiliz Spicy Testnet',
                    nativeCurrency: {
                      name: 'Chiliz',
                      symbol: 'CHZ',
                      decimals: 18
                    },
                    rpcUrls: [CHILIZ_SPICY_RPC],
                    blockExplorerUrls: [CHILIZ_SPICY_BLOCK_EXPLORER]
                  }]
                });
                setIsCorrectNetwork(true);
              } catch (addError) {
                console.error("Error adding network:", addError);
                toast(`${t('errorAddingNetwork') || "Error adding network"}`);
              }
            }
          }
        }

        const shortAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`;
        toast(`${t('walletConnected') || "Wallet connected successfully!"}`);

      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast(`${t('connectionError') || "Connection error"}`);
    }
  };

  const signMessage = async (message: string): Promise<string | null> => {
    try {
      if (!isConnected || !address) {
        await connectWallet();
        
        if (!isConnected || !address) {
          return null;
        }
      }
      
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return await signer.signMessage(message);
      }
      
      return null;
    } catch (error) {
      console.error("Error signing message:", error);
      return null;
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setIsConnected(false);
    toast(`${t('walletDisconnected') || "Wallet disconnected"}`);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          const shortAccount = `${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`;
          toast(`${t('accountChanged') || "Account changed"}`);
        } else {
          setAddress(null);
          setIsConnected(false);
          toast(`${t('walletDisconnected') || "Wallet disconnected"}`);
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        const isSpicy = chainId === CHILIZ_SPICY_CHAIN_ID;
        setIsCorrectNetwork(isSpicy);
        
        if (!isSpicy) {
          toast(`${t('wrongNetwork') || "Wrong network"}`);
        } else {
          toast(`${t('correctNetwork') || "Correct network"}`);
        }
        
        window.location.reload();
      });
    }

    checkIfWalletIsConnected();
    
    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{
      address,
      isConnected,
      isCorrectNetwork,
      connectWallet,
      disconnectWallet,
      signMessage
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
