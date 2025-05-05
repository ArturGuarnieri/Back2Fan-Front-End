
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthLayout from '@/components/auth/AuthLayout';
import WalletAuthForm from '@/components/auth/WalletAuthForm';
import ProfileForm from '@/components/auth/ProfileForm';
import { toast } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';

const Auth = () => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  let authContext = null;
  try {
    authContext = useAuth();
  } catch (error) {
    console.error("Auth context not available:", error);
  }
  
  const { profile, loading } = authContext || { profile: null, loading: true };

  useEffect(() => {
    if (profile && !loading) {
      console.log("User is authenticated, redirecting to dashboard");
      toast.success(t('success'), {
        description: t('pleaseLoginToAccessDashboard')
      });
      navigate('/dashboard');
    }
  }, [profile, navigate, loading, t]);

  const handleShowProfileForm = () => {
    setShowProfileForm(true);
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="text-center p-4 space-y-4 w-full">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-10 w-full mx-auto mt-6" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      {!showProfileForm ? (
        <WalletAuthForm onProfileFormNeeded={handleShowProfileForm} />
      ) : (
        <ProfileForm />
      )}
    </AuthLayout>
  );
};

export default Auth;
