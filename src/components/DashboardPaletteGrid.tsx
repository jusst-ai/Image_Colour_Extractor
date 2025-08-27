import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  updated_at: string;
  user_id: string;
  image_url?: string;
}

interface PaletteWithUsername extends Palette {
  username?: string;
}

const DashboardPaletteGrid = () => {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPalette, setSelectedPalette] = useState<PaletteWithUsername | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

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

  const handlePaletteClick = async (palette: Palette) => {
    try {
      // Fetch username from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', palette.user_id)
        .single();

      setSelectedPalette({
        ...palette,
        username: profile?.username || 'Unknown User'
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching username:', error);
      setSelectedPalette({
        ...palette,
        username: 'Unknown User'
      });
      setIsModalOpen(true);
    }
  };

  const handlePublicToggle = async (checked: boolean) => {
    if (!selectedPalette) return;

    try {
      const { error } = await supabase
        .from('palettes')
        .update({ is_public: checked })
        .eq('id', selectedPalette.id);

      if (error) throw error;

      // Update local state
      setSelectedPalette(prev => prev ? { ...prev, is_public: checked } : null);
      setPalettes(prev => prev.map(p => 
        p.id === selectedPalette.id ? { ...p, is_public: checked } : p
      ));

      toast({
        title: checked ? "Palette made public" : "Palette made private",
        description: checked ? "Your palette is now visible to everyone" : "Your palette is now private"
      });
    } catch (error) {
      console.error('Error updating palette:', error);
      toast({
        title: "Error",
        description: "Failed to update palette visibility",
        variant: "destructive"
      });
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
            <div 
              key={palette.id} 
              className="flex flex-col gap-3 pb-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handlePaletteClick(palette)}
            >
              <div className="w-full aspect-square rounded-lg border border-border overflow-hidden bg-muted">
                {palette.image_url ? (
                  <div className="h-full relative">
                    <img 
                      src={palette.image_url} 
                      alt={palette.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-12 flex">
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
                ) : (
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
                )}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedPalette?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPalette && (
            <div className="space-y-6">
              {/* Image Display */}
              {selectedPalette.image_url && (
                <div className="w-full max-h-64 rounded-lg border border-border overflow-hidden">
                  <img 
                    src={selectedPalette.image_url} 
                    alt={selectedPalette.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Color Palette Display */}
              <div className="w-full h-32 rounded-lg border border-border overflow-hidden">
                <div className="h-full flex">
                  {selectedPalette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1 h-full"
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    />
                  ))}
                </div>
              </div>

              {/* Color Values */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">Colors</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedPalette.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
                      <div 
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm font-mono text-foreground">{color.hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Palette Info */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Created by</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedPalette.username}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public-toggle"
                      checked={selectedPalette.is_public}
                      onCheckedChange={handlePublicToggle}
                    />
                    <Label htmlFor="public-toggle" className="text-sm font-medium">
                      {selectedPalette.is_public ? 'Public' : 'Private'}
                    </Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Created</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(selectedPalette.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">Updated</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(selectedPalette.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPaletteGrid;