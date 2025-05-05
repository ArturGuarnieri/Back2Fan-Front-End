import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { AuthService, UserProfile } from '@/services/AuthService';
import { apiClient } from '@/services/ApiClient';

interface AuthContextType {
  session: any | null;
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message: string; userId?: string }>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  generateWalletLinkingNonce: (walletAddress: string) => Promise<string | null>;
  verifyAndLinkWallet: (walletAddress: string, signature: string, userId?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signUp: async () => ({ success: false, message: 'Auth context not initialized' }),
  signIn: async () => false,
  signOut: async () => {},
  refreshProfile: async () => null,
  generateWalletLinkingNonce: async () => null,
  verifyAndLinkWallet: async () => false
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Initializing auth state");
    
    const initializeAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const userProfile = await AuthService.getAuthenticatedProfile();
          
          if (userProfile) {
            setProfile(userProfile);
            setUser({ id: userProfile.id });
            setSession({ user: { id: userProfile.id } });
          } else {
            apiClient.setToken(null);
          }
        }
      } catch (error) {
        console.error("Error initializing auth state:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  const refreshProfile = async () => {
    try {
      const userProfile = await AuthService.getAuthenticatedProfile();
      
      if (userProfile) {
        setProfile(userProfile);
        setUser({ id: userProfile.id });
        setSession({ user: { id: userProfile.id } });
        return userProfile;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    
    try {
      toast("Wallet authentication required", {
        description: "This application now uses wallet authentication. Please connect your wallet to register.",
      });
      
      return { success: false, message: "Please use wallet authentication to register" };
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      toast("Registration failed", {
        description: error.message || "An error occurred during registration.",
      });
      
      return { success: false, message: error.message || "An error occurred during registration." };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      toast("Wallet authentication required", {
        description: "This application now uses wallet authentication. Please connect your wallet to login.",
      });
      
      return false;
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      toast("Login failed", {
        description: error.message || "An error occurred during login.",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    
    try {
      await AuthService.signOut();
      
      setProfile(null);
      setUser(null);
      setSession(null);
      
      toast("Signed out", {
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      
      toast("Sign out failed", {
        description: error.message || "An error occurred during sign out.",
      });
    } finally {
      setLoading(false);
    }
  };


  const generateWalletLinkingNonce = async (walletAddress: string) => {
    return AuthService.generateWalletLinkingNonce(walletAddress);
  };


  const verifyAndLinkWallet = async (walletAddress: string, signature: string, userId?: string) => {
    return AuthService.verifyAndLinkWallet(walletAddress, signature, userId);
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    generateWalletLinkingNonce,
    verifyAndLinkWallet
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
