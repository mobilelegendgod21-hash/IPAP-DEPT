-- Create a new storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Give public access to view product images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'products' );

-- Policy: Allow Admins to upload/update/delete product images
-- We verify admin status via the public.profiles table
CREATE POLICY "Admins can upload product images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'products' 
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

CREATE POLICY "Admins can update product images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'products' 
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

CREATE POLICY "Admins can delete product images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'products' 
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
