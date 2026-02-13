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

Is this available?`;

        // Use m.me link for Messenger
        const url = `https://m.me/61581559561803?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
            <div className="max-w-screen-xl mx-auto lg:grid lg:grid-cols-12 lg:gap-8 lg:p-8">

                {/* Mobile Header (Floating) */}
                <div className="lg:hidden fixed top-0 left-0 right-0 z-30 p-4 flex justify-between pointer-events-none">
                    <button onClick={onBack} className="pointer-events-auto bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        <span className="text-sm font-bold uppercase tracking-wider">Back</span>
                    </button>
                    {/* Cart button removed */}
                </div>

                <div className="lg:col-span-5 lg:col-start-2 bg-white lg:rounded-lg overflow-hidden shadow-sm relative">
                    <div className="grid grid-cols-1 gap-1">
                        {product.images.map((img, idx) => (
                            <div key={idx} className="relative w-full aspect-[4/3] lg:aspect-square bg-white">
                                <img
                                    src={img}
                                    className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                                    style={{ objectPosition: 'center' }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details Column - Overlapping on mobile for modern look */}
                <div className="lg:col-span-6 flex flex-col gap-2 lg:gap-4 relative -mt-6 lg:mt-0 z-10">
                    {/* Main Info Card */}
                    <div className="bg-white p-5 pt-8 lg:p-6 rounded-t-3xl lg:rounded-lg shadow-sm lg:shadow-none border-b lg:border-none border-gray-100">
                        <div className="flex justify-between items-start">
                            <h1 className="text-xl font-medium leading-snug mb-2 flex-1">{product.name}</h1>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-red-600 font-mono">₱{product.price.toLocaleString()}</span>
                                {product.originalPrice && (
                                    <span className="text-sm text-gray-400 line-through font-mono">₱{product.originalPrice.toLocaleString()}</span>
                                )}
                            </div>
                            {product.originalPrice && (
                                <span className="bg-red-50 text-red-600 text-xs font-bold px-1 rounded uppercase">
                                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                </span>
                            )}
                        </div>

                        {/* Trust Signals */}
                        <div className="flex items-center gap-4 text-sm border-t border-gray-100 pt-3">
                            <div className="flex items-center gap-1 text-black">
                                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                                <span className="font-bold border-b border-black">{product.rating}</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <div className="text-gray-600">
                                <span className="font-bold text-black border-b border-black">{product.soldCount}</span> Sold
                            </div>
                            <div className="w-px h-4 bg-gray-300"></div>
                        </div>
                    </div>

                    {/* Shop Card */}
                    <div className="bg-white p-4 lg:rounded-lg shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                <img src="/ipap-new.jpg" alt="IPAP DEPT" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm">IPAP DEPT</h3>
                                <div className="flex items-center gap-1.5">
                                    {activeStatus === 'Active now' && (
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                    )}
                                    <p className="text-xs text-gray-400">{activeStatus}</p>
                                </div>
                            </div>
                        </div>
                        <a
                            href="https://www.facebook.com/profile.php?id=61581559561803"
                            target="_blank"
                            rel="noreferrer"
                            className="border border-red-500 text-red-500 px-4 py-1.5 text-xs rounded hover:bg-red-50 transition-colors"
                        >
                            View Shop
                        </a>
                    </div>

                    {/* Selection Card */}
                    <div className="bg-white p-4 lg:p-6 lg:rounded-lg shadow-sm">
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-sm uppercase">Variation</h3>
                            </div>
                            <ProductVariantSelector
                                variants={product.variants}
                                selectedVariantId={selectedVariantId}
                                onSelect={setSelectedVariantId}
                            />
                        </div>

                        <div className="p-3 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800 flex items-start gap-2 mb-4">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span><strong>Fast Transaction</strong> via Messenger.</span>
                        </div>

                        <div className="hidden lg:flex gap-4">
                            <button
                                onClick={handleMessageOrder}
                                className="w-full bg-blue-600 text-white h-12 font-medium rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                Message to Order
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-4 lg:rounded-lg shadow-sm">
                        <h3 className="font-bold text-sm uppercase mb-3">Product Description</h3>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex z-40 p-2">
                <button
                    onClick={handleMessageOrder}
                    className="flex-1 bg-blue-600 text-white font-bold uppercase tracking-wider rounded flex items-center justify-center gap-2"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    Message to Order
                </button>
            </div>
        </div>
    );
};