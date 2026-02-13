import React from 'react';
import { useCartStore } from '../store';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { 
    isOpen, items, toggleCart, removeFromCart, 
    toggleItemSelection, updateQuantity, selectedTotal 
  } = useCartStore();

  if (!isOpen) return null;

  const selectedCount = items.filter(i => i.selected).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideIn">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <h2 className="font-mono text-lg font-bold uppercase tracking-tighter">
            Cart ({items.length})
          </h2>
          <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 font-mono text-sm">
              <p>CART IS EMPTY</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex gap-3">
                  {/* Selection Checkbox */}
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={item.selected}
                      onChange={() => toggleItemSelection(item.variantId)}
                      className="w-5 h-5 accent-black rounded cursor-pointer"
                    />
                  </div>

                  <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm uppercase line-clamp-1">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-600 border border-gray-200">
                          {item.size}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                      <span className="font-mono text-sm font-bold">₱{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      
                      <div className="flex items-center border border-gray-200 rounded">
                        <button 
                          onClick={() => updateQuantity(item.variantId, -1)}
                          className="px-2 py-0.5 text-gray-500 hover:bg-gray-100"
                        >-</button>
                        <span className="px-2 text-xs font-mono w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.variantId, 1)}
                          className="px-2 py-0.5 text-gray-500 hover:bg-gray-100"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shopee Style Bottom Bar */}
        <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-mono uppercase">Vouchers</span>
             </div>
             <div className="text-xs text-blue-600 font-medium cursor-pointer flex items-center gap-1">
                Select Voucher <span className="text-xs">›</span>
             </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
                <span className="text-xs text-gray-500">Total ({selectedCount} items)</span>
                <span className="font-bold text-lg text-red-600 font-mono">₱{selectedTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <button 
              onClick={() => { toggleCart(); onCheckout(); }}
              disabled={selectedCount === 0}
              className="flex-1 bg-black text-white h-12 font-bold uppercase tracking-widest hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm rounded"
            >
              Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};