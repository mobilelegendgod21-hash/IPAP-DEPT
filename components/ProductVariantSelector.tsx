import React from 'react';
import { ProductVariant } from '../types';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variantId: string) => void;
}

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants,
  selectedVariantId,
  onSelect,
}) => {
  // Sort variants logically (assuming numerical sizes for fitted hats)
  // In a real app, we might need a more robust sort function for S/M/L vs 7 1/8
  const sortedVariants = [...variants].sort((a, b) => {
    // Simple parser for fractions to decimals for sorting
    const parseSize = (s: string) => {
      // Check for fraction like "7 1/8"
      if (s.includes(' ')) {
        const [whole, frac] = s.split(' ');
        const [num, den] = frac.split('/').map(Number);
        return parseInt(whole) + (num / den);
      }
      return parseFloat(s) || 0;
    };
    return parseSize(a.size) - parseSize(b.size);
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-3">
        <span className="font-mono text-sm uppercase tracking-widest text-gray-500">
          Select Size
        </span>
        <button className="text-xs underline text-gray-400 hover:text-black transition-colors">
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {sortedVariants.map((variant) => {
          const isOOS = variant.stock === 0;
          const isSelected = selectedVariantId === variant.id;
          const isLowStock = variant.stock > 0 && variant.stock < 3;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => {
                if (!isOOS) {
                  onSelect(variant.id);
                }
              }}
              disabled={isOOS}
              className={`
                relative h-12 border transition-all duration-200 flex items-center justify-center
                font-mono text-sm
                ${isOOS
                  ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed decoration-slice line-through'
                  : isSelected
                    ? 'border-black bg-black text-white ring-1 ring-black ring-offset-2 cursor-pointer'
                    : 'hover:border-black cursor-pointer bg-white border-gray-200 text-gray-900'
                }
              `}
            >
              {variant.size}

              {/* Low Stock Indicator */}
              {isLowStock && !isOOS && !isSelected && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Feedback Text */}
      <div className="h-6 mt-2">
        {selectedVariantId && (
          <p className="text-xs font-mono text-gray-600">
            {variants.find(v => v.id === selectedVariantId)?.stock === 0 ? (
              <span className="text-red-600 font-bold">Out of Stock</span>
            ) : (
              <>
                Stocks: <span className="font-bold text-black">{variants.find(v => v.id === selectedVariantId)?.stock}</span>
                {variants.find(v => v.id === selectedVariantId)?.stock! < 5 && (
                  <span className="text-red-600 ml-2 animate-pulse text-[10px] uppercase font-bold">Only {variants.find(v => v.id === selectedVariantId)?.stock} left!</span>
                )}
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};