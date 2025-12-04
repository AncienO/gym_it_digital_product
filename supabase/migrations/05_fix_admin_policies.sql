-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a security definer function to check if user is admin
-- This bypasses RLS and prevents infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Update RLS policies for products to use the security definer function
CREATE POLICY "Admins can insert products" ON public.products 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products" ON public.products 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete products" ON public.products 
FOR DELETE 
USING (public.is_admin());

-- Policy to allow admins to view all profiles (optional, for user management)
CREATE POLICY "Admins can view all profiles" ON public.profiles 
FOR SELECT 
USING (public.is_admin());
