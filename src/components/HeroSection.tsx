import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  return (
    <div className="@container">
      <div className="@[480px]:p-4">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4 relative overflow-hidden shadow-medium"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%), url(${heroBackground})`
          }}
        >
          <div className="flex flex-col gap-4 text-center max-w-4xl">
            <h1 className="text-white text-4xl font-black leading-tight tracking-tight @[480px]:text-6xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-tight">
              Discover the perfect color palette for your next design
            </h1>
            <h2 className="text-white/90 text-lg font-medium leading-relaxed @[480px]:text-xl @[480px]:font-medium @[480px]:leading-relaxed">
              Uncover the dominant colors in any image and create stunning designs with ease. 
              Extract, analyze, and export beautiful color palettes instantly.
            </h2>
          </div>
          <div className="flex flex-col @[480px]:flex-row gap-4">
            <Button 
              size="lg" 
              className="gradient-primary text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-soft hover:shadow-medium transition-bounce hover:scale-105"
            >
              Upload Image
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 border-white/30 text-white font-semibold px-8 py-6 text-lg rounded-xl backdrop-blur-sm hover:bg-white/20 transition-smooth"
            >
              Try Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;