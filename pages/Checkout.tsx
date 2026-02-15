import React, { useState } from 'react';
import { useCartStore } from '../store';
import { MOCK_ADDRESS } from '../constants';

interface CheckoutProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onBack, onSuccess }) => {
  const { items, selectedTotal } = useCartStore();
  const selectedItems = items.filter(i => i.selected);
  const subtotal = selectedTotal();
  const shippingCost = 150.00; // PHP Standard Shipping
  const grandTotal = subtotal + shippingCost;
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
    }, 2000);
  };

  if (selectedItems.length === 0) {
      return (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-4">
              <p className="mb-4 text-gray-500">No items selected for checkout.</p>
              <button onClick={onBack} className="text-black underline">Go Back</button>
          </div>
      )
  }

  return (
    <div className="flex-1 bg-gray-100 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <h1 className="font-bold uppercase tracking-wider text-sm">Checkout</h1>
            </div>
        </div>
      </div>

      <div className="max-w-screen-md mx-auto p-2 md:p-4 space-y-3">
        {/* Address Section */}
        <div className="bg-white p-4 rounded shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(45deg,#ff6b6b,#ff6b6b_10px,#fff_10px,#fff_20px,#5c7cfa_20px,#5c7cfa_30px,#fff_30px,#fff_40px)]"></div>
            
            <div className="flex items-start gap-3 mt-2">
                <div className="text-gray-500 mt-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">{MOCK_ADDRESS.name}</span>
                        <span className="text-gray-500 text-sm">{MOCK_ADDRESS.phone}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-tight mb-2">
                        {MOCK_ADDRESS.street}, {MOCK_ADDRESS.city}, {MOCK_ADDRESS.zip}
                    </p>
                    <span className="text-[10px] text-red-600 border border-red-600 px-1 rounded">Default</span>
                </div>
                <div className="text-gray-400">›</div>
            </div>
        </div>

        {/* Product List */}
        <div className="bg-white rounded shadow-sm overflow-hidden">
            {selectedItems.map(item => (
                <div key={item.variantId} className="p-4 flex gap-4 border-b border-gray-50 last:border-0">
                    <img src={item.image} className="w-16 h-16 object-cover bg-gray-100 rounded" />
                    <div className="flex-1">
                        <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Variation: {item.size}</p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm font-mono font-bold">₱{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className="text-xs text-gray-500">x{item.quantity}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Shipping Option */}
        <div className="bg-white p-4 rounded shadow-sm flex justify-between items-center">
            <div>
                <h3 className="text-sm font-bold text-green-600">Standard Delivery</h3>
                <p className="text-xs text-gray-500">Receive by {new Date(Date.now() + 86400000 * 3).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold">₱{shippingCost.toFixed(2)}</span>
                <span className="text-gray-400">›</span>
            </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-4 rounded shadow-sm space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
                <span>Merchandise Subtotal</span>
                <span>₱{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
                <span>Shipping Subtotal</span>
                <span>₱{shippingCost.toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-xs text-yellow-600">
                <span>Voucher Discount</span>
                <span>-₱0.00</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                <span className="text-sm font-bold">Total Payment</span>
                <span className="text-lg font-bold text-red-600 font-mono">₱{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-0 flex justify-end items-stretch h-14 z-40">
        <div className="flex flex-col justify-center px-4 bg-white">
            <div className="text-xs text-gray-500 text-right">Total Payment</div>
            <div className="text-red-600 font-bold font-mono text-lg">₱{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <button 
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="bg-black text-white px-8 font-bold uppercase tracking-widest hover:bg-gray-900 disabled:opacity-70 flex items-center justify-center min-w-[140px]"
        >
            {isProcessing ? (
                <span className="animate-pulse">Processing...</span>
            ) : 'Place Order'}
        </button>
      </div>
    </div>
  );
};