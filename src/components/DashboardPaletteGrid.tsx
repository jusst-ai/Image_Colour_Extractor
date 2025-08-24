import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ExtractedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
}

interface Palette {
  id: string;
  title: string;
  colors: ExtractedColor[];
  is_public: boolean;
  created_at: string;
  user_id: string;
}

const DashboardPaletteGrid = () => {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPalettes();
  }, []);

  const fetchPalettes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('palettes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPalettes((data || []) as unknown as Palette[]);
    } catch (error) {
      console.error('Error fetching palettes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPalettes = palettes.filter(palette =>
    palette.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em]">
          Your palettes
        </h2>
        <p className="text-muted-foreground">Loading your palettes...</p>
      </div>
    );
  }
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredPalettes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-base">
            {palettes.length === 0 
              ? "No palettes yet. Upload an image to create your first palette!" 
              : "No palettes match your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {filteredPalettes.map((palette) => (
            <div key={palette.id} className="flex flex-col gap-3 pb-3">
              <div className="w-full aspect-square rounded-lg border border-border overflow-hidden bg-muted">
                <div className="h-full flex">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1 h-full"
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-foreground text-base font-medium leading-normal truncate">
                    {palette.title}
                  </p>
                  {palette.is_public && (
                    <span className="text-xs bg-muted px-2 py-1 rounded">Public</span>
                  )}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {palette.colors.map((color, index) => (
                    <span key={index} className="text-xs text-muted-foreground font-mono">
                      {color.hex}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(palette.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPaletteGrid;