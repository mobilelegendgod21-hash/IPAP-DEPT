import { create } from 'zustand';
import { CartItem } from './types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  toggleItemSelection: (variantId: string) => void;
  toggleAllSelection: (selected: boolean) => void;
  updateQuantity: (variantId: string, delta: number) => void;
  clearCart: () => void;
  total: () => number;
  selectedTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  
  addToCart: (newItem) => set((state) => {
    const existingItemIndex = state.items.findIndex(
      (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
    );

    if (existingItemIndex > -1) {
      const updatedItems = [...state.items];
      updatedItems[existingItemIndex].quantity += 1;
      return { items: updatedItems, isOpen: true }; // Open drawer on add
    }

    // Default to selected when adding new item
    return { items: [...state.items, { ...newItem, selected: true }], isOpen: true };
  }),

  removeFromCart: (variantId) => set((state) => ({
    items: state.items.filter((i) => i.variantId !== variantId)
  })),

  toggleItemSelection: (variantId) => set((state) => ({
    items: state.items.map(item => 
      item.variantId === variantId ? { ...item, selected: !item.selected } : item
    )
  })),

  toggleAllSelection: (selected) => set((state) => ({
    items: state.items.map(item => ({ ...item, selected }))
  })),

  updateQuantity: (variantId, delta) => set((state) => ({
    items: state.items.map(item => {
      if (item.variantId === variantId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    })
  })),

  clearCart: () => set({ items: [] }),

  total: () => {
    const state = get();
    return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  selectedTotal: () => {
    const state = get();
    return state.items
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}));