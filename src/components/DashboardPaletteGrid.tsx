import { Search } from "lucide-react";
import palette1 from "@/assets/palette-1.jpg";
import palette2 from "@/assets/palette-2.jpg";
import palette3 from "@/assets/palette-3.jpg";
import palette4 from "@/assets/palette-4.jpg";

const paletteData = [
  {
    id: 1,
    image: palette1,
    title: "Sunset Over Mountains",
    colors: "#F2F2F2, #E0E0E0, #BDBDBD, #9E9E9E, #757575"
  },
  {
    id: 2,
    image: palette2,
    title: "Urban Cityscape",
    colors: "#F2F2F2, #E0E0E0, #BDBDBD, #9E9E9E, #757575"
  },
  {
    id: 3,
    image: palette3,
    title: "Autumn Forest",
    colors: "#F2F2F2, #E0E0E0, #BDBDBD, #9E9E9E, #757575"
  },
  {
    id: 4,
    image: palette4,
    title: "Coastal Beach",
    colors: "#F2F2F2, #E0E0E0, #BDBDBD, #9E9E9E, #757575"
  }
];

const DashboardPaletteGrid = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em]">
        Your palettes
      </h2>
      
      <div className="flex">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <input
            placeholder="Search"
            className="w-full h-12 pl-12 pr-4 rounded-lg bg-muted border-none focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground text-base font-normal leading-normal"
          />
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
        {paletteData.map((palette) => (
          <div key={palette.id} className="flex flex-col gap-3 pb-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg cursor-pointer hover:shadow-soft transition-all duration-200"
              style={{ backgroundImage: `url(${palette.image})` }}
            />
            <div className="space-y-1">
              <p className="text-foreground text-base font-medium leading-normal">
                {palette.title}
              </p>
              <p className="text-muted-foreground text-sm font-normal leading-normal">
                {palette.colors}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPaletteGrid;