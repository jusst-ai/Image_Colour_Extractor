import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Copy, Eye, Search, Trash2 } from "lucide-react";

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
  signed_image_url?: string; // For displaying private images
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
  const [deleting, setDeleting] = useState(false);

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
      
      // Generate signed URLs for images from private bucket
      const palettesWithSignedUrls = await Promise.all(
        (data || []).map(async (palette) => {
          if (palette.image_url) {
            try {
              const { data: signedUrlData } = await supabase.storage
                .from('palette-images')
                .createSignedUrl(palette.image_url, 60 * 60); // 1 hour expiry
              
              return {
                ...palette,
                signed_image_url: signedUrlData?.signedUrl
              };
            } catch (error) {
              console.error('Error generating signed URL:', error);
              return palette;
            }
          }
          return palette;
        })
      );
      
      setPalettes(palettesWithSignedUrls as unknown as Palette[]);
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

      toast.success(`Palette ${checked ? 'made public' : 'made private'}`);
    } catch (error) {
      console.error('Error updating palette visibility:', error);
      toast.error('Failed to update palette visibility');
    }
  };

  const handleDeletePalette = async (paletteId: string) => {
    if (!selectedPalette) return;
    
    setDeleting(true);
    try {
      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('You must be logged in to delete palettes');
      }

      console.log('Attempting to delete palette:', paletteId, 'by user:', user.id);

      // Delete image from storage if it exists
      if (selectedPalette.image_url) {
        console.log('Deleting image from storage:', selectedPalette.image_url);
        // Use the stored file path directly (no need to extract from URL)
        const { error: storageError } = await supabase.storage
          .from('palette-images')
          .remove([selectedPalette.image_url]);
          
        if (storageError) {
          console.error('Error deleting image:', storageError);
          // Don't fail the entire operation if image deletion fails
        } else {
          console.log('Image deleted successfully');
        }
      }

      // Delete palette from database
      console.log('Deleting palette from database...');
      const { data, error } = await supabase
        .from('palettes')
        .delete()
        .eq('id', paletteId)
        .select();

      if (error) {
        console.error('Database deletion error:', error);
        throw error;
      }

      console.log('Delete result:', data);

      if (!data || data.length === 0) {
        throw new Error('Palette not found or you do not have permission to delete it');
      }

      // Update local state
      setPalettes(prev => prev.filter(palette => palette.id !== paletteId));
      setIsModalOpen(false);
      setSelectedPalette(null);
      
      toast.success('Palette deleted successfully');
      console.log('Palette deletion completed successfully');
    } catch (error) {
      console.error('Error deleting palette:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete palette';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
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
              <div className="w-full rounded-lg border border-border overflow-hidden bg-muted">
                {palette.signed_image_url ? (
                  <div className="relative">
                    <div className="w-full aspect-square overflow-hidden">
                      <img 
                        src={palette.signed_image_url} 
                        alt={palette.title}
                        className="w-full h-full object-contain bg-muted"
                      />
                    </div>
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
                  <div className="aspect-square flex">
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedPalette?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPalette && (
            <div className="space-y-4">
              {/* Image Display */}
              {selectedPalette.signed_image_url && (
                <div className="w-full rounded-lg border border-border overflow-hidden bg-muted">
                  <img 
                    src={selectedPalette.signed_image_url} 
                    alt={selectedPalette.title}
                    className="w-full max-h-48 object-contain"
                  />
                </div>
              )}
              
              {/* Color Palette Display */}
              <div className="w-full h-20 rounded-lg border border-border overflow-hidden">
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
                <div className="grid grid-cols-2 gap-2">
                  {selectedPalette.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
                      <div 
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm font-mono text-foreground">{color.hex}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(color.hex);
                          toast.success(`Copied ${color.hex} to clipboard`);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Palette Info */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-foreground">Created by</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedPalette.username}</p>
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
                
                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Switch
                    id="public-toggle"
                    checked={selectedPalette.is_public}
                    onCheckedChange={handlePublicToggle}
                  />
                  <Label htmlFor="public-toggle">Make palette public</Label>
                </div>

                <div className="pt-4 border-t">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Palette
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Palette?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this palette
                          {selectedPalette.image_url ? ' and its associated image' : ''}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeletePalette(selectedPalette.id)}
                          disabled={deleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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