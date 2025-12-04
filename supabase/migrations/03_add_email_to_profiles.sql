-- 1. Add email column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- 2. Update the trigger function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'user');
  RETURN new;
END;
$$;

-- 3. Backfill email for existing profiles (optional, best effort)
-- This requires access to auth.users which this script might have if run in SQL Editor
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;
