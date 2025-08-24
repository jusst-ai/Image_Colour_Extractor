-- Create palettes table
CREATE TABLE public.palettes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  colors JSONB NOT NULL, -- Store as array of color objects
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.palettes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own palettes
CREATE POLICY "Users can view their own palettes" 
ON public.palettes 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can view public palettes
CREATE POLICY "Users can view public palettes" 
ON public.palettes 
FOR SELECT 
USING (is_public = true);

-- Users can create their own palettes
CREATE POLICY "Users can create their own palettes" 
ON public.palettes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own palettes
CREATE POLICY "Users can update their own palettes" 
ON public.palettes 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own palettes
CREATE POLICY "Users can delete their own palettes" 
ON public.palettes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_palettes_updated_at
BEFORE UPDATE ON public.palettes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();