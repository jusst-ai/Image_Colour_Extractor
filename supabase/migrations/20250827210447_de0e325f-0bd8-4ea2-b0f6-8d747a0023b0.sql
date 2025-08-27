-- Create storage bucket for palette images
INSERT INTO storage.buckets (id, name, public) VALUES ('palette-images', 'palette-images', true);

-- Create storage policies for palette images
CREATE POLICY "Palette images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'palette-images');

CREATE POLICY "Users can upload their own palette images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'palette-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own palette images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'palette-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own palette images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'palette-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add image_url column to palettes table
ALTER TABLE public.palettes 
ADD COLUMN image_url TEXT;