
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Wallet, Loader2 } from 'lucide-react';
import { AuthService } from '@/services/AuthService';
import { apiClient } from '@/services/ApiClient';

interface WalletAuthFormProps {
  onProfileFormNeeded: () => void;
}

const WalletAuthForm: React.FC<WalletAuthFormProps> = ({ onProfileFormNeeded }) => {
  const [connecting, setConnecting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [processingLogin, setProcessingLogin] = useState(false);
  const checkingRef = useRef<boolean>(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  let authContext = null;
  let walletContext = null;
  
  try {
    authContext = useAuth();
    walletContext = useWallet();
  } catch (error) {
    console.error("Error accessing contexts:", error);
  }
  
  const { profile, refreshProfile } = authContext || { 
    profile: null, 
    refreshProfile: async () => null 
  };
  
  const { connectWallet, address, isConnected } = walletContext || { 
    connectWallet: async () => { 
      toast("Erro", { description: "Contexto de carteira não disponível" }); 
    }, 
    address: null, 
    isConnected: false 
  };

  // Handle wallet connection
  const handleConnectWallet = async () => {
    if (connecting) return;
    
    setConnecting(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error("Erro ao conectar carteira:", error);
      toast("Falha na conexão", {
        description: "Não foi possível conectar sua carteira. Tente novamente.",
      });
    } finally {
      setConnecting(false);
    }
  };

  const checkWalletRegistration = async () => {
    if (!isConnected || !address) return;
    if (checking || processingLogin) return;
    if (checkingRef.current) return; 
    
    setChecking(true);
    checkingRef.current = true;
    
    try {
      console.log("Verificando se a carteira está registrada:", address.toLowerCase());
      

      const checkResult = await apiClient.checkUser(address.toLowerCase());
      console.log("Resultado da verificação de usuário:", checkResult);
      
      if (checkResult.success && checkResult.exists) {
        console.log("Carteira já registrada, fazendo login");
        setProcessingLogin(true);
        
        const loginSuccess = await AuthService.loginWithWallet(address.toLowerCase());
        
        if (loginSuccess) {
          toast.success("Login realizado com sucesso", {
            description: "Você foi autenticado com sua carteira",
          });
          
          await refreshProfile();
          
          navigate('/dashboard');
        } else {
          toast.error("Falha no login", {
            description: "Não foi possível fazer login com sua carteira. Tente novamente.",
          });
        }
      } else {
        console.log("Carteira não registrada, mostrando formulário de registro");
        onProfileFormNeeded();
      }
    } catch (error) {
      console.error("Erro ao verificar registro da carteira:", error);
      toast.error("Erro", {
        description: "Falha ao verificar o registro da carteira. Tente novamente.",
      });
    } finally {
      setChecking(false);
      setProcessingLogin(false);
      checkingRef.current = false;
    }
  };

  useEffect(() => {
    if (isConnected && address && !checking && !processingLogin && !checkingRef.current) {
      checkWalletRegistration();
    }
  }, [isConnected, address]);

  if (profile) {
    return (
      <Button
        onClick={() => navigate('/dashboard')}
        className="w-full"
      >
        {t('goToDashboard') || "Ir para o Dashboard"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <Button 
          onClick={handleConnectWallet} 
          className="w-full"
          disabled={connecting}
        >
          {connecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('connecting') || "Conectando..."}
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              {t('connectWallet') || "Conectar Carteira"}
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">
            {t('walletConnected') || "Carteira conectada"}: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
            {checking && (
              <div className="flex items-center mt-1 text-xs">
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                {t('checkingWalletRegistration') || "Verificando registro da carteira..."}
              </div>
            )}
            
            {processingLogin && (
              <div className="flex items-center mt-1 text-xs">
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                {t('processingLogin') || "Processando login..."}
              </div>
            )}
          </div>
          
          {!checking && !processingLogin && (
            <Button 
              onClick={onProfileFormNeeded}
              className="w-full"
            >
              {t('continueToRegistration') || "Continuar para o registro"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletAuthForm;
