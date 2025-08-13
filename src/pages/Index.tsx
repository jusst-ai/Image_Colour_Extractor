import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PaletteGrid from "@/components/PaletteGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
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
