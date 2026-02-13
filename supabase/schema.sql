-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  address JSONB, -- Store default shipping address
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Products Table
CREATE TABLE public.products (
  id TEXT PRIMARY KEY, -- We'll use your 'prod_...' format or UUIDs
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  style TEXT CHECK (style IN ('FITTED', 'SNAPBACK', 'DAD_HAT', 'TRUCKER', 'APPAREL')),
  images TEXT[], -- Array of image URLs
  rating DECIMAL(2,1) DEFAULT 0.0,
  sold_count INTEGER DEFAULT 0,
  location TEXT,
  shop_name TEXT,
  release_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone." ON public.products
  FOR SELECT USING (true);

-- Only service role (admins) can insert/update/delete products for now
-- (Supabase default is deny all for mutation if no policy exists)


-- 3. Product Variants (Sizes and Stocks)
CREATE TABLE public.product_variants (
  id TEXT PRIMARY KEY, -- 'v_...'
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  price_override DECIMAL(10,2), -- If specific size has different price
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Variants are viewable by everyone." ON public.product_variants
  FOR SELECT USING (true);


-- 4. Orders Table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED')) DEFAULT 'PENDING',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders." ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders." ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 5. Order Items Table
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id),
  variant_id TEXT REFERENCES public.product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL, -- Price at time of purchase
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items." ON public.order_items
  FOR SELECT USING (
    EXISTS ( SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid() )
  );

CREATE POLICY "Users can create their own order items." ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS ( SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid() )
  );
