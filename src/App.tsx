import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import TermsPage from "./pages/TermsPage";
import AuthenticatedLayout from "./components/AuthenticatedLayout";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Reset password should be accessible regardless of auth status */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            {/* Terms page should be accessible for authenticated users */}
            {user && <Route path="/terms" element={<TermsPage />} />}
            {user ? (
              <>
                <Route path="/" element={<AuthenticatedLayout />} />
                <Route path="/explore" element={<AuthenticatedLayout />} />
                <Route path="/profile" element={<AuthenticatedLayout />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
              </>
            )}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
