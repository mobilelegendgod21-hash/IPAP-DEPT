-- Seed Products
INSERT INTO public.products (id, name, price, original_price, style, description, shop_name, location, images, sold_count)
VALUES 
(
  'prod_001',
  'IPAP LOGO EMBROIDERED FITTED',
  3495.00,
  4500.00,
  'FITTED',
  'Constructed from premium Japanese twill. Features our signature high-density embroidery on the front panel.',
  'IPAP Official',
  'Makati City',
  ARRAY['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&q=80&w=800'],
  1240
),
(
  'prod_002',
  'VINTAGE WASH DAD HAT',
  2250.00,
  NULL,
  'DAD_HAT',
  'Enzyme washed cotton for that perfect vintage feel right out of the box.',
  'Vintage Vault',
  'Quezon City',
  ARRAY['https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800'],
  856
),
(
  'prod_003',
  'TECHNICAL RUNNER CAP',
  2890.00,
  3200.00,
  'SNAPBACK',
  'Lightweight, breathable nylon construction. Perfect for active use.',
  'IPAP Sport',
  'Pasig City',
  ARRAY['https://images.unsplash.com/photo-1622445272461-c6580cab8755?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&q=80&w=800'],
  342
),
(
  'prod_004',
  'HEAVYWEIGHT CANVAS TRUCKER',
  2450.00,
  NULL,
  'TRUCKER',
  'Structured foam front with heavy canvas mesh back.',
  'IPAP Warehouse',
  'Paranaque',
  ARRAY['https://images.unsplash.com/photo-1513187219567-36109e4141d4?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1563200782-b732b1739c94?auto=format&fit=crop&q=80&w=800'],
  2100
)
ON CONFLICT (id) DO NOTHING;
