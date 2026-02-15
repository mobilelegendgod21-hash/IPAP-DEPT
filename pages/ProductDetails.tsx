import React, { useState, useEffect } from 'react';
import { ProductVariantSelector } from '../components/ProductVariantSelector';
import { Product } from '../types';

interface ProductDetailsProps {
    product: Product;
    onBack: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const [activeStatus, setActiveStatus] = useState('Active now');

    // Simulate Facebook Page Activity
    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            // Convert to PH Time (UTC+8) roughly for logic, though system time is usually local
            const hour = now.getHours();
            // Assume 8:00 AM to 10:00 PM is active
            if (hour >= 8 && hour <= 22) {
                setActiveStatus('Active now');
            } else {
                // Randomize slightly for realism
                const mins = 5 + Math.floor(Math.random() * 10);
                setActiveStatus(`Active ${mins}m ago`);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    // Reset variant selection when product changes
    useEffect(() => {
        setSelectedVariantId(null);
    }, [product.id]);

    const handleMessageOrder = () => {
        if (!selectedVariantId) {
            alert("Please select a size first");
            return;
        }

        const variant = product.variants.find(v => v.id === selectedVariantId);
        if (!variant) return;

        const message = `Hi IPAP DEPT, I would like to order:
${product.name}
Size: ${variant.size}
Price: ₱${product.price.toLocaleString()}

Product Image:
${product.images[0]}

Description:
${product.description}

Is this available?`;

        // Use m.me link for Messenger
        const url = `https://m.me/61581559561803?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="flex-1 bg-white pb-24 lg:pb-0">
            <div className="max-w-screen-xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 lg:p-8">

                {/* Desktop Back Button */}
                <div className="hidden lg:block lg:col-span-12 mb-4">
                    <button onClick={onBack} className="group flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        Back to Shop
                    </button>
                </div>

                {/* Mobile Header (Floating) */}
                <div className="lg:hidden fixed top-0 left-0 right-0 z-30 p-4 flex justify-between pointer-events-none">
                    <button onClick={onBack} className="pointer-events-auto bg-white/90 backdrop-blur border border-gray-200 text-black w-10 h-10 flex items-center justify-center rounded-none shadow-sm hover:bg-black hover:text-white transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    </button>
                </div>

                <div className="lg:col-span-7 lg:col-start-1 bg-white relative">
                    <div className="grid grid-cols-1 gap-1">
                        {product.images.map((img, idx) => (
                            <div key={idx} className="relative w-full aspect-square bg-gray-50 border border-transparent hover:border-black transition-colors duration-300">
                                <img
                                    src={img}
                                    className="absolute inset-0 w-full h-full object-contain"
                                    style={{ objectPosition: 'center' }}
                                />
                                <div className="absolute bottom-2 right-2 font-mono text-[10px] text-gray-400">IMG_0{idx + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details Column */}
                <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24 h-fit pt-4 px-4 lg:px-0 lg:pt-0">
                    
                    {/* Header Info */}
                    <div className="border-b border-black pb-6">
                        <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-2 uppercase">{product.name}</h1>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-3">
                                <span className="text-xl md:text-2xl font-mono font-bold">₱{product.price.toLocaleString()}</span>
                                {product.originalPrice && (
                                    <span className="text-sm text-gray-400 line-through font-mono">₱{product.originalPrice.toLocaleString()}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                                <span>{product.soldCount} UNITS SOLD</span>
                                <span>|</span>
                                <span className="flex items-center gap-1 text-black">
                                    ★ {product.rating}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shop Info (Simplified) */}
                    <div className="flex items-center gap-3 py-2">
                        <div className="w-8 h-8 bg-gray-100 border border-gray-200">
                            <img src="/ipap-new.jpg" alt="IPAP DEPT" className="w-full h-full object-cover grayscale" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-mono text-xs font-bold uppercase tracking-widest">IPAP DEPT. Official</h3>
                            <p className="text-[10px] text-gray-400 font-mono">{activeStatus}</p>
                        </div>
                    </div>

                    {/* Selection */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500">Select Variant</h3>
                            </div>
                            <ProductVariantSelector
                                variants={product.variants}
                                selectedVariantId={selectedVariantId}
                                onSelect={setSelectedVariantId}
                            />
                        </div>

                        <div className="hidden lg:block">
                            <button
                                onClick={handleMessageOrder}
                                className="w-full bg-black text-white h-14 font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors border border-black flex items-center justify-center gap-3 text-sm"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                Message to Order
                            </button>
                            <p className="text-[10px] text-gray-400 text-center mt-2 font-mono">SECURE TRANSACTION VIA FACEBOOK MESSENGER</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Specifications</h3>
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-mono text-xs">{product.description}</p>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex flex-col z-40 p-3 pb-safe">
                <button
                    onClick={handleMessageOrder}
                    className="flex-1 bg-black text-white font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-sm"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    Message to Order
                </button>
            </div>
        </div>
    );
};