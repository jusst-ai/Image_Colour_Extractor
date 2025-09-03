-- Update the palette-images bucket to be private and set file size limit
UPDATE storage.buckets 
SET 
  public = false,
  file_size_limit = 10485760  -- 10MB limit
WHERE id = 'palette-images';

-- Create RLS policies for private bucket access

-- Allow users to view their own images
CREATE POLICY "Users can view their own palette images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'palette-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to upload their own images
CREATE POLICY "Users can upload their own palette images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'palette-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own palette images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'palette-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own images
CREATE POLICY "Users can update their own palette images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'palette-images' AND auth.uid()::text = (storage.foldername(name))[1]);