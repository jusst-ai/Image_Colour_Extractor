import { useState } from "react";
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

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-6 lg:px-10">
        {isLoggedIn ? (
          <Dashboard />
        ) : (
          <div className="py-8 space-y-12">
            <HeroSection />
            <PaletteGrid />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
