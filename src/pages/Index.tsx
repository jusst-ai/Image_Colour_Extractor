import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PaletteGrid from "@/components/PaletteGrid";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
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
      <Header isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
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
