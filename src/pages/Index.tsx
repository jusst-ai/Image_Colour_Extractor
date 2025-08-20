import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PaletteGrid from "@/components/PaletteGrid";
import Dashboard from "@/components/Dashboard";

const Index = () => {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 flex">
            <div className="gap-1 px-6 flex flex-1 justify-center py-5">
              <Dashboard />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={!!user} onLogin={() => {}} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="py-8 space-y-12">
          <HeroSection />
          <PaletteGrid />
        </div>
      </main>
    </div>
  );
};

export default Index;
