import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { StoreService } from '@/services/StoreService';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/sonner';

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  checkAdminStatus: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  loading: true,
  checkAdminStatus: async () => false
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  
  const lastCheckedUserId = useRef<string | null>(null);
  const checkPromiseRef = useRef<Promise<boolean> | null>(null);
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
      checkTimeoutRef.current = null;
    }

    if (!user) {
      console.log("No user in AdminContext, setting admin to false");
      setIsAdmin(false);
      setLoading(false);
      lastCheckedUserId.current = null;
      return;
    }
    
    if (user.id === lastCheckedUserId.current && !loading) {
      console.log("Using cached admin status for user");
      return;
    }

    console.log("User detected in AdminContext, checking admin status...");
    setLoading(true);
    
    if (!checkPromiseRef.current) {
      checkPromiseRef.current = checkAdminStatusInternal();
    }
    
    checkPromiseRef.current
      .then(status => {
        console.log("Admin status check result:", status);
        setIsAdmin(status);
        setLoading(false);
        lastCheckedUserId.current = user.id;
        checkPromiseRef.current = null;
      })
      .catch(error => {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        setLoading(false);
        checkPromiseRef.current = null;
        
        checkTimeoutRef.current = setTimeout(() => {
          checkAdminStatus();
        }, 5000);
      });
    
  }, [user]);

  const checkAdminStatusInternal = async (): Promise<boolean> => {
    console.log("Making admin status API call...");
    try {
      const adminStatus = await StoreService.isUserAdmin();
      console.log("Admin status from API:", adminStatus);
      return adminStatus;
    } catch (error) {
      console.error("Error checking admin status:", error);
      throw error;
    }
  };

  const checkAdminStatus = async (): Promise<boolean> => {
    if (!user) {
      return false;
    }
    
    if (user.id === lastCheckedUserId.current && !loading) {
      return isAdmin;
    }
    
    setLoading(true);
    try {
      if (checkPromiseRef.current) {
        return await checkPromiseRef.current;
      }
      
      checkPromiseRef.current = checkAdminStatusInternal();
      const status = await checkPromiseRef.current;
      
      setIsAdmin(status);
      lastCheckedUserId.current = user.id;
      checkPromiseRef.current = null;
      return status;
    } catch (error) {
      console.error("Error in checkAdminStatus:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, loading, checkAdminStatus }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
