import { ethers } from "ethers";
import { toast } from "@/components/ui/sonner";
import { apiClient } from "./ApiClient";
import { FanToken } from "@/lib/data";

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

export interface Token {
  contract: string;
  name: string;
  symbol: string;
  decimals: string;
  balance: string;
}

export interface BlockchainNFT {
  tokenId: string;
  contract: string;
  name: string;
  symbol: string;
  txHash: string;
  metadata?: NFTMetadata;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  wallet_address: string | null;
  nativeBalance?: string;
  tokens?: Token[];
  nfts?: BlockchainNFT[];
}

export const AuthService = {

  async getAuthenticatedProfile(): Promise<UserProfile | null> {
    try {

      if (!apiClient.isAuthenticated()) {
        console.log("No authenticated profile found");
        return null;
      }
      

      const userResponse = await apiClient.getCurrentUser();
      
      if (userResponse.success && userResponse.data) {

        const data = userResponse.data;
        
        return {
          id: data.wallet,
          email: data.email,
          full_name: `${data.first_name} ${data.last_name}`,
          wallet_address: data.wallet,
          nativeBalance: data.nativeBalance,
          tokens: data.tokens,
          nfts: data.nfts
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error getting authenticated profile:", error);
      return null;
    }
  },

  async getProfileByWallet(walletAddress: string): Promise<UserProfile | null> {
    try {
      if (!walletAddress) {
        console.log("No wallet address provided");
        return null;
      }
      
      const normalizedAddress = walletAddress.toLowerCase();
      

      const checkResponse = await apiClient.checkUser(normalizedAddress);
      
      if (checkResponse.success && checkResponse.exists) {

        const storedWallet = localStorage.getItem('current_wallet_address');
        
        if (storedWallet && storedWallet.toLowerCase() === normalizedAddress) {

          return this.getAuthenticatedProfile();
        }
        

        return {
          id: normalizedAddress,
          email: "",
          full_name: null,
          wallet_address: normalizedAddress
        };
      }
      
      console.log("No profile found for wallet address:", normalizedAddress);
      return null;
    } catch (error) {
      console.error("Error in getProfileByWallet:", error);
      return null;
    }
  },

  async registerWithWallet(walletAddress: string, email: string, fullName: string): Promise<{ success: boolean; message: string; userId?: string }> {
    try {
      if (!walletAddress) {
        return { success: false, message: "No wallet address provided" };
      }
      
      const normalizedAddress = walletAddress.toLowerCase();
      

      const existingProfile = await this.getProfileByWallet(normalizedAddress);
      if (existingProfile) {
        return { success: false, message: "This wallet is already registered" };
      }
      

      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      const signatureMessage = `Cadastro Back2Fan para ${normalizedAddress}`;
      const signature = await this.getSignature(normalizedAddress, signatureMessage);
      
      if (!signature) {
        return { success: false, message: "Failed to sign registration message" };
      }
      

      const registerResponse = await apiClient.registerUserData(
        normalizedAddress,
        firstName,
        lastName,
        email,
        signature
      );
      
      if (!registerResponse.success) {
        return { success: false, message: registerResponse.message || "Registration failed" };
      }
      
      await this.loginWithWallet(normalizedAddress);
      
      return { 
        success: true, 
        message: "Account created successfully",
        userId: normalizedAddress
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      return { success: false, message: error.message || "An error occurred during registration." };
    }
  },

  async loginWithWallet(walletAddress: string): Promise<boolean> {
    try {
      if (!walletAddress) {
        console.error("No wallet address provided");
        return false;
      }
      
      const normalizedAddress = walletAddress.toLowerCase();

      const checkResponse = await apiClient.checkUser(normalizedAddress);
      
      if (!checkResponse.success || !checkResponse.exists) {
        console.error("No profile found for this wallet");
        return false;
      }
      

      const signatureMessage = `Login Back2Fan para ${normalizedAddress}`;
      const signature = await this.getSignature(normalizedAddress, signatureMessage);
      
      if (!signature) {
        return false;
      }

      const loginResponse = await apiClient.login(normalizedAddress, signature);
      
      if (!loginResponse.success || !loginResponse.token) {
        console.error("Login failed");
        return false;
      }
      

      localStorage.setItem("current_wallet_address", normalizedAddress);
      
      console.log("Wallet login successful");
      return true;
    } catch (error: any) {
      console.error("Error in loginWithWallet:", error);
      return false;
    }
  },
  

  async signOut(): Promise<void> {
    apiClient.setToken(null);
    localStorage.removeItem("current_wallet_address");
  },

  async getSignature(address: string, message: string): Promise<string | null> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        toast("Wallet not found", { 
          description: "MetaMask or compatible wallet is required" 
        });
        return null;
      }
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
  
      const currentAddress = await signer.getAddress();
      
      if (currentAddress.toLowerCase() !== address.toLowerCase()) {
        toast("Address mismatch", { 
          description: "Please use the same wallet address that's connected" 
        });
        return null;
      }
      
      return await signer.signMessage(message);
    } catch (error) {
      console.error("Error signing message:", error);
      toast("Signature failed", { 
        description: "Failed to sign message with your wallet" 
      });
      return null;
    }
  },

  async hasLinkedWallet(): Promise<boolean> {
    const profile = await this.getAuthenticatedProfile();
    return !!profile?.wallet_address;
  },
  
  async generateWalletLinkingNonce(walletAddress: string): Promise<string | null> {
    if (!walletAddress) return null;
    
    const nonce = Math.random().toString(36).substring(2, 15);
    localStorage.setItem(`wallet_nonce_${walletAddress.toLowerCase()}`, nonce);
    return nonce;
  },
  
  async verifyAndLinkWallet(walletAddress: string, signature: string, userId?: string): Promise<boolean> {
    console.log("Using legacy wallet linking method");
    return this.loginWithWallet(walletAddress);
  }
};
