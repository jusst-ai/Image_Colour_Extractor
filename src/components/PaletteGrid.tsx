import { Button } from "@/components/ui/button";
import palette1 from "@/assets/palette-1.jpg";
import palette2 from "@/assets/palette-2.jpg";
import palette3 from "@/assets/palette-3.jpg";
import palette4 from "@/assets/palette-4.jpg";
import palette5 from "@/assets/palette-5.jpg";
import palette6 from "@/assets/palette-6.jpg";
import palette7 from "@/assets/palette-7.jpg";
import palette8 from "@/assets/palette-8.jpg";

const paletteData = [
  { id: 1, image: palette1, title: "Sunset Ocean", colors: ["#FF6B35", "#F7931E", "#FFD23F", "#06FFA5"] },
  { id: 2, image: palette2, title: "Forest Nature", colors: ["#2D5016", "#61892F", "#86C232", "#C6E377"] },
  { id: 3, image: palette3, title: "Minimal Pastels", colors: ["#FFE5E5", "#FFD1DC", "#E6E6FA", "#F0F8FF"] },
  { id: 4, image: palette4, title: "Electric Neon", colors: ["#00FFFF", "#FF00FF", "#FFFF00", "#00FF00"] },
  { id: 5, image: palette5, title: "Vintage Retro", colors: ["#D2691E", "#DAA520", "#8B0000", "#F5F5DC"] },
  { id: 6, image: palette6, title: "Ocean Depths", colors: ["#003366", "#006699", "#0099CC", "#66CCFF"] },
  { id: 7, image: palette7, title: "Autumn Warmth", colors: ["#8B0000", "#DAA520", "#CD853F", "#A0522D"] },
  { id: 8, image: palette8, title: "Monochrome", colors: ["#000000", "#404040", "#808080", "#FFFFFF"] }
];

const PaletteCard = ({ palette }: { palette: typeof paletteData[0] }) => {
  return (
    <div className="group cursor-pointer transition-smooth hover:scale-105">
      <div className="flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-xl shadow-soft hover:shadow-medium transition-smooth">
          <img
            src={palette.image}
            alt={palette.title}
            className="w-full aspect-square object-cover transition-smooth group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-smooth" />
        </div>
        <div className="px-2">
          <h3 className="font-semibold text-foreground mb-2">{palette.title}</h3>
          <div className="flex gap-1">
            {palette.colors.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PaletteGrid = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold leading-tight tracking-tight">
          Explore Color Schemes
        </h2>
        <Button variant="outline" className="transition-smooth hover:shadow-soft">
          View All
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paletteData.map((palette) => (
          <PaletteCard key={palette.id} palette={palette} />
        ))}
      </div>
    </section>
  );
};

export default PaletteGrid;