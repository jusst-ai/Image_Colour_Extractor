import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExtractedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
}

const UploadSection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractColorsFromImage = (imageElement: HTMLImageElement): ExtractedColor[] => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    // Set canvas size to image size
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;

    // Draw image to canvas
    ctx.drawImage(imageElement, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Sample pixels (every 10th pixel to improve performance)
    const pixels: { r: number; g: number; b: number }[] = [];
    for (let i = 0; i < data.length; i += 40) { // 40 = 4 * 10 (RGBA * skip factor)
      pixels.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2]
      });
    }

    // Group similar colors using k-means clustering (simplified)
    const colorGroups: { r: number; g: number; b: number; count: number }[] = [];
    
    pixels.forEach(pixel => {
      let found = false;
      for (const group of colorGroups) {
        const distance = Math.sqrt(
          Math.pow(pixel.r - group.r, 2) +
          Math.pow(pixel.g - group.g, 2) +
          Math.pow(pixel.b - group.b, 2)
        );
        
        if (distance < 50) { // Threshold for similar colors
          group.r = (group.r * group.count + pixel.r) / (group.count + 1);
          group.g = (group.g * group.count + pixel.g) / (group.count + 1);
          group.b = (group.b * group.count + pixel.b) / (group.count + 1);
          group.count++;
          found = true;
          break;
        }
      }
      
      if (!found) {
        colorGroups.push({ ...pixel, count: 1 });
      }
    });

    // Sort by frequency and take top 4
    colorGroups.sort((a, b) => b.count - a.count);
    
    return colorGroups.slice(0, 4).map(group => ({
      rgb: { 
        r: Math.round(group.r), 
        g: Math.round(group.g), 
        b: Math.round(group.b) 
      },
      hex: `#${Math.round(group.r).toString(16).padStart(2, '0')}${Math.round(group.g).toString(16).padStart(2, '0')}${Math.round(group.b).toString(16).padStart(2, '0')}`
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);

      // Create image element to extract colors
      const img = new Image();
      img.onload = () => {
        const colors = extractColorsFromImage(img);
        setExtractedColors(colors);
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setSelectedImage(null);
    setExtractedColors([]);
    setTitle("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em]">
        Upload new image
      </h2>
      
      {!selectedImage ? (
        <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-border px-6 py-14">
          <div className="flex max-w-[480px] flex-col items-center gap-2">
            <p className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
              Drag and drop an image here
            </p>
            <p className="text-foreground text-sm font-normal leading-normal max-w-[480px] text-center">
              Or click to browse
            </p>
          </div>
          <Button variant="secondary" className="px-4" onClick={handleUploadClick}>
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4">
            <img
              src={selectedImage}
              alt="Uploaded"
              className="w-full max-w-md mx-auto rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="palette-title">Palette Title</Label>
            <Input
              id="palette-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your palette"
            />
          </div>

          {extractedColors.length > 0 && (
            <div className="space-y-2">
              <Label>Extracted Colors</Label>
              <div className="flex gap-2">
                {extractedColors.map((color, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div
                      className="w-16 h-16 rounded-lg border border-border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs text-muted-foreground font-mono">
                      {color.hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="default" className="px-4">
              Save Palette
            </Button>
            <Button variant="outline" className="px-4" onClick={handleReset}>
              Upload Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;