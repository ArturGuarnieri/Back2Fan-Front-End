
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthService } from '@/services/AuthService';

const ProfileForm: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [registering, setRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  let walletContext = null;
  try {
    walletContext = useWallet();
  } catch (error) {
    console.error("Wallet context not available:", error);
  }
  
  const { address, isConnected } = walletContext || { address: null, isConnected: false };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!firstName || !lastName || !email || !isConnected || !address) {
      toast("Registration error", {
        description: "Please fill all fields and ensure your wallet is connected.",
      });
      return;
    }
    
    setRegistering(true);
    try {
      const fullName = `${firstName} ${lastName}`;
      const result = await AuthService.registerWithWallet(address.toLowerCase(), email, fullName);
      
      if (!result.success) {
        setErrorMessage(result.message);
        throw new Error(result.message);
      }
      
      toast("Account created successfully!", {
        description: "Your wallet is now linked to your account.",
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast("Registration failed", {
        description: error.message || "An error occurred during registration.",
      });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <form onSubmit={handleCreateAccount} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          {t('firstName')}
          </label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t('firstName')}
            required
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          {t('lastName')}
          </label>
          <Input
            id={t('lastName')}
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t('lastName')}
            className="mt-1"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('email')}
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('yourEmail')}
          className="mt-1"
          required
        />
      </div>
      
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {isConnected && address && (
        <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
          <p>{t('waalletWillbeLinked')}: <strong>{address.substring(0, 6)}...{address.substring(address.length - 4)}</strong></p>
        </div>
      )}
      
      <Button
        type="submit"
        className="w-full"
        disabled={registering || !isConnected}
      >
        {registering ? t('createing') : t('createyour')}
      </Button>
    </form>
  );
};

export default ProfileForm;
