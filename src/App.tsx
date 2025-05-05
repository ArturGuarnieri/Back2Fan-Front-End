
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { NFTProvider } from "./contexts/NFTContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Stores from "./pages/Stores";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import RedirectWarning from "./pages/RedirectWarning";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <WalletProvider>
              <AdminProvider>
                <NFTProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/stores" element={<Stores />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/redirect/:storeId" element={<RedirectWarning />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Analytics />
                  </TooltipProvider>
                </NFTProvider>
              </AdminProvider>
            </WalletProvider>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
