import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PaletteGrid from "@/components/PaletteGrid";

const Index = () => {
  const handleLogout = async () => {
    // This is handled at the App level
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={false} onLogin={() => {}} onLogout={handleLogout} />
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
