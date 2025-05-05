
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import AdminStores from '@/components/admin/AdminStores';
import AdminFanTokens from '@/components/admin/AdminFanTokens';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading, checkAdminStatus } = useAdmin();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [verifiedAdmin, setVerifiedAdmin] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (checkingAdmin) return; 
      if (verifiedAdmin) return;
      
      console.log("Admin page - Verifying admin status");
      console.log("Current auth state:", { user, authLoading, isAdmin, adminLoading });
      
      if (!authLoading && !user) {
        console.log("No user detected, redirecting to auth");
        toast("Acesso negado", {
          description: "Você precisa estar logado para acessar esta página.",
        });
        navigate("/auth");
        return;
      }
      
      if (user && !adminLoading && !verifiedAdmin) {
        try {
          setCheckingAdmin(true);
          const adminStatus = await checkAdminStatus();
          console.log("Admin check result:", adminStatus);
          
          if (!adminStatus) {
            console.log("User is not admin, redirecting to dashboard");
            toast("Acesso negado", {
              description: "Você não tem permissão para acessar o painel de administração.",
            });
            navigate("/dashboard");
          } else {
            console.log("User is confirmed as admin");
            setVerifiedAdmin(true);
          }
        } catch (error) {
          console.error("Error during admin verification:", error);
          toast("Erro", {
            description: "Ocorreu um erro ao verificar suas permissões de administrador.",
          });
          navigate("/dashboard");
        } finally {
          setCheckingAdmin(false);
        }
      }
    };

    verifyAdmin();
  }, [user, authLoading, adminLoading, navigate, checkAdminStatus]);

  if (authLoading || adminLoading || checkingAdmin || (!verifiedAdmin && user)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">Verificando permissões de administrador...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !isAdmin || !verifiedAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg">Redirecionando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-red-900">Painel de Administração</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="stores">Lojas</TabsTrigger>
            <TabsTrigger value="fantokens">Fan Tokens</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="stores">
            <AdminStores />
          </TabsContent>
          
          <TabsContent value="fantokens">
            <AdminFanTokens />
          </TabsContent>
          
          <TabsContent value="users">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Gerenciamento de Usuários</h2>
              <p className="text-gray-500">Funcionalidade em desenvolvimento.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Configurações do Sistema</h2>
              <p className="text-gray-500">Funcionalidade em desenvolvimento.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
