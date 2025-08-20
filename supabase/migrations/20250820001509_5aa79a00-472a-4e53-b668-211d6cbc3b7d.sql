-- Fix security issues: Set proper search_path for functions

-- Update generate_username function with secure search path
CREATE OR REPLACE FUNCTION public.generate_username()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  adjectives TEXT[] := ARRAY['Cool', 'Swift', 'Bright', 'Epic', 'Clever', 'Bold', 'Smart', 'Quick', 'Wild', 'Brave'];
  nouns TEXT[] := ARRAY['Tiger', 'Eagle', 'Shark', 'Wolf', 'Fox', 'Lion', 'Hawk', 'Bear', 'Falcon', 'Panther'];
  username TEXT;
  random_num INTEGER;
BEGIN
  random_num := floor(random() * 1000 + 1)::INTEGER;
  username := adjectives[floor(random() * array_length(adjectives, 1) + 1)] || 
              nouns[floor(random() * array_length(nouns, 1) + 1)] || 
              random_num::TEXT;
  RETURN username;
END;
$$;

-- Update handle_new_user function with secure search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_username TEXT;
  attempts INTEGER := 0;
  max_attempts INTEGER := 10;
BEGIN
  -- Generate unique username with retry logic
  LOOP
    new_username := public.generate_username();
    
    -- Check if username already exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = new_username) THEN
      EXIT; -- Username is unique, exit loop
    END IF;
    
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      -- Fallback to user ID if can't generate unique username
      new_username := 'User' || substring(NEW.id::TEXT from 1 for 8);
      EXIT;
    END IF;
  END LOOP;

  -- Insert profile for new user
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, new_username);
  
  RETURN NEW;
END;
$$;

-- Update update_updated_at_column function with secure search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;