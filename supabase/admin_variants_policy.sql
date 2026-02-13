-- Enable RLS on product_variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Allow public read access to product_variants (so customers can see stock/price)
-- Drop existing policy if any to avoid conflict, or catch error. Assuming clean slate or IF NOT EXISTS
DROP POLICY IF EXISTS "Public can view product variants" ON public.product_variants;
CREATE POLICY "Public can view product variants" 
ON public.product_variants
FOR SELECT USING (true);

-- Allow admins to insert product_variants
DROP POLICY IF EXISTS "Admins can insert product variants" ON public.product_variants;
CREATE POLICY "Admins can insert product variants" 
ON public.product_variants
FOR INSERT 
WITH CHECK (
  EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
);

-- Allow admins to update product_variants
DROP POLICY IF EXISTS "Admins can update product variants" ON public.product_variants;
CREATE POLICY "Admins can update product variants" 
ON public.product_variants
FOR UPDATE 
USING (
  EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
);

-- Allow admins to delete product_variants
DROP POLICY IF EXISTS "Admins can delete product variants" ON public.product_variants;
CREATE POLICY "Admins can delete product variants" 
ON public.product_variants
FOR DELETE 
USING (
  EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
);
