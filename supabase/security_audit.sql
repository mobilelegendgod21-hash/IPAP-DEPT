-- 1. Enable Row Level Security (RLS) on ALL tables
-- This is the most crucial step. Without RLS, anyone with the Anon key could potentially do anything if policies aren't set.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. PUBLIC READ-ONLY TABLES (Products, Variants)
-- Everyone (logged in or not) can VIEW products.
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view product variants" ON public.product_variants;
CREATE POLICY "Public can view product variants" ON public.product_variants FOR SELECT USING (true);

-- ONLY Admins can MODIFY products/variants
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (
  EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
);

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (
  EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
);

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (
  EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
);

-- Same for variants (Admins only)
DROP POLICY IF EXISTS "Admins can insert product variants" ON public.product_variants;
CREATE POLICY "Admins can insert product variants" ON public.product_variants FOR INSERT WITH CHECK (
  EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
);

DROP POLICY IF EXISTS "Admins can update product variants" ON public.product_variants;
CREATE POLICY "Admins can update product variants" ON public.product_variants FOR UPDATE USING (
  EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
);

DROP POLICY IF EXISTS "Admins can delete product variants" ON public.product_variants;
CREATE POLICY "Admins can delete product variants" ON public.product_variants FOR DELETE USING (
  EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
);


-- 3. PRIVATE USER DATA (Orders, Order Items)
-- Users can only see THEIR OWN orders. Admins can see ALL.
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
);

DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- Only Admins can UPDATE orders (e.g. change status to 'SHIPPED')
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (
  EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
);


-- Order Items (linked to orders)
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS ( SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR 
    EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE )
  ))
);

DROP POLICY IF EXISTS "Users can create own order items" ON public.order_items;
CREATE POLICY "Users can create own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS ( SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid() )
);


-- 4. PROFILES (User Data)
-- Users can see their own profile. Admins can see all. Public might see basic info (name/avatar) for reviews/comments if needed, otherwise strict.
-- Let's stick to: Everyone can see basic profiles (needed for 'shop' owner info or reviews), but only owner can edit.
DROP POLICY IF EXISTS "Public/Admins can view profiles" ON public.profiles;
CREATE POLICY "Public/Admins can view profiles" ON public.profiles FOR SELECT USING (true); 

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (
  auth.uid() = id OR
  EXISTS ( SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE ) -- Admins can edit others? Maybe safer to restrict.
);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (
  auth.uid() = id
);
