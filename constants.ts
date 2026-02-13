import { Product, Address } from './types';

export const MOCK_ADDRESS: Address = {
  name: "Juan Dela Cruz",
  phone: "(+63) 917-555-0123",
  street: "Unit 2401, High Street South Corporate Plaza",
  city: "BGC, Taguig",
  zip: "1634",
  isDefault: true
};

export const SQL_SCHEMA_DOC = `
-- Users & Auth
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id TEXT PRIMARY KEY, -- using stripe-like IDs 'prod_...'
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  style TEXT NOT NULL, -- ENUM('FITTED', 'SNAPBACK', ...)
  shop_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id),
  size TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  price_override DECIMAL(10,2), -- NULL if same as base
  sku TEXT UNIQUE
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'PENDING', -- PENDING, PAID, SHIPPED
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  product_variant_id TEXT REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price_at_purchase DECIMAL(10,2) NOT NULL
);
`;

export const API_ROUTES_DOC = `
GET    /api/v1/products
       Query: ?style=FITTED&sort=newest
       Response: { data: Product[], meta: Pagination }

GET    /api/v1/products/:id
       Response: Product & { variants: Variant[] }

POST   /api/v1/cart/sync
       Body: { items: { variantId: string, qty: number }[] }
       Response: { total: number, validItems: CartItem[] }

POST   /api/v1/checkout/intent
       Auth: Required
       Body: { addressId: string, paymentMethod: string }
       Response: { clientSecret: string, orderId: string }

GET    /api/v1/orders/history
       Auth: Required
       Response: Order[]
`;

const SIZES = ['7', '7 1/8', '7 1/4', '7 3/8', '7 1/2', '7 5/8', '7 3/4', '8'];

const generateVariants = (basePrice: number) => {
  return SIZES.map((s, i) => ({
    id: `v_${s.replace(/\s|\//g, '')}_${Math.random().toString(36).substr(2, 5)}`,
    size: s,
    stock: Math.floor(Math.random() * 20),
    price: basePrice
  }));
};

// Converted approx prices to PHP for realism
export const PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: 'IPAP LOGO EMBROIDERED FITTED',
    price: 3495.00,
    originalPrice: 4500.00,
    style: 'FITTED',
    description: 'Constructed from premium Japanese twill. Features our signature high-density embroidery on the front panel.',
    releaseDate: new Date().toISOString(),
    rating: 4.9,
    soldCount: 1240,
    location: 'Makati City',
    shopName: 'IPAP Official',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&q=80&w=800'
    ],
    variants: generateVariants(3495.00)
  },
  {
    id: 'prod_002',
    name: 'VINTAGE WASH DAD HAT',
    price: 2250.00,
    style: 'DAD_HAT',
    description: 'Enzyme washed cotton for that perfect vintage feel right out of the box.',
    releaseDate: new Date().toISOString(),
    rating: 4.7,
    soldCount: 856,
    location: 'Quezon City',
    shopName: 'Vintage Vault',
    images: [
      'https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800'
    ],
    variants: generateVariants(2250.00)
  },
  {
    id: 'prod_003',
    name: 'TECHNICAL RUNNER CAP',
    price: 2890.00,
    originalPrice: 3200.00,
    style: 'SNAPBACK',
    description: 'Lightweight, breathable nylon construction. Perfect for active use.',
    releaseDate: new Date().toISOString(),
    rating: 4.8,
    soldCount: 342,
    location: 'Pasig City',
    shopName: 'IPAP Sport',
    images: [
      'https://images.unsplash.com/photo-1622445272461-c6580cab8755?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&q=80&w=800'
    ],
    variants: generateVariants(2890.00)
  },
  {
    id: 'prod_004',
    name: 'HEAVYWEIGHT CANVAS TRUCKER',
    price: 2450.00,
    style: 'TRUCKER',
    description: 'Structured foam front with heavy canvas mesh back.',
    releaseDate: new Date().toISOString(),
    rating: 4.6,
    soldCount: 2100,
    location: 'Paranaque',
    shopName: 'IPAP Warehouse',
    images: [
      'https://images.unsplash.com/photo-1513187219567-36109e4141d4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1563200782-b732b1739c94?auto=format&fit=crop&q=80&w=800'
    ],
    variants: generateVariants(2450.00)
  }
];