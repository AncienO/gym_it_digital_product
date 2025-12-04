-- Add role column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Update RLS policies for products to allow admins to manage them
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- Policy to allow admins to view all profiles (optional, for user management)
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);
