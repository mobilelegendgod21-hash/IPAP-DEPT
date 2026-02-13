-- 1. Add is_admin column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Update Policies for Products to allow admin manipulation
-- First, drop existing restrictive policy if any, or create new ones
-- "Products are viewable by everyone" already exists.

-- Allow admins to INSERT products
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
  );

-- Allow admins to UPDATE products
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (
    EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
  );

-- Allow admins to DELETE products
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (
    EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
  );

-- Allow admins to enable/disable other admins (for simplicity, allow update on profiles if admin)
CREATE POLICY "Admins can update other profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
  );
