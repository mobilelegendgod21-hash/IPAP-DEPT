export interface ProductVariant {
  id: string;
  size: string;
  stock: number;
  price?: number; // Optional override price
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  style: 'FITTED' | 'SNAPBACK' | 'DAD_HAT' | 'TRUCKER' | 'APPAREL';
  images: string[];
  variants: ProductVariant[];
  releaseDate: string;
  rating: number;
  soldCount: number;
  location: string;
  shopName: string;
  sizes?: string[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  selected: boolean; // Crucial for Shopee-style checkout
  shopName: string;
}

export interface FilterState {
  style: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

export interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  isDefault: boolean;
}