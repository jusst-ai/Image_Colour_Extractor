-- Update the palette-images bucket to be private and set file size limit
UPDATE storage.buckets 
SET 
  public = false,
  file_size_limit = 10485760  -- 10MB limit
WHERE id = 'palette-images';

-- Create missing RLS policies (using IF NOT EXISTS equivalent)
-- Note: PostgreSQL doesn't have IF NOT EXISTS for policies, so we'll use DO blocks

DO $$
BEGIN
  -- Allow users to view their own images
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can view their own palette images') THEN
    CREATE POLICY "Users can view their own palette images" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'palette-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  -- Allow users to delete their own images
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can delete their own palette images') THEN
    CREATE POLICY "Users can delete their own palette images" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'palette-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;

  -- Allow users to update their own images
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can update their own palette images') THEN
    CREATE POLICY "Users can update their own palette images" 
    ON storage.objects 
    FOR UPDATE 
    USING (bucket_id = 'palette-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;