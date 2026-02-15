import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

interface HomeProps {
    onProductClick: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onProductClick }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const PRODUCTS_PER_PAGE = 8; // Adjust based on grid (2x4 on mobile, 4x2 on desktop)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Keep existing fetch logic...
                const { data, error } = await supabase
                    .from('products')
                    .select('*, variants:product_variants(*)')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const mapped: Product[] = data.map((p: any) => {
                        let variants = (p.variants || []).map((v: any) => ({
                            id: v.id,
                            size: v.size,
                            stock: v.stock,
                            price: v.price_override || Number(p.price)
                        }));

                        if (variants.length === 0 && p.sizes && p.sizes.length > 0) {
                            variants = p.sizes.map((size: string) => ({
                                id: `${p.id}_${size}_fallback`,
                                size: size,
                                stock: 100,
                                price: Number(p.price)
                            }));
                        }

                        return {
                            id: p.id,
                            name: p.name,
                            price: Number(p.price),
                            originalPrice: p.original_price,
                            style: p.style,
                            description: p.description,
                            images: p.images || [],
                            variants: variants,
                            rating: p.rating,
                            soldCount: p.sold_count,
                            location: p.location,
                            shopName: p.shop_name,
                            releaseDate: p.release_date,
                            sizes: variants.map((v: any) => v.size),
                            status: p.status || 'ACTIVE'
                        };
                    });
                    
                    const availableProducts = mapped.filter(p => {
                        const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
                        return p.status === 'ACTIVE' && totalStock > 0;
                    });

                    setProducts(availableProducts);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        // 🟢 REALTIME SUBSCRIPTION
        const channel = supabase
            .channel('public:products') // Unique name for the channel
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
                console.log('Product change detected! Refreshing...');
                fetchProducts();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'product_variants' }, () => {
                console.log('Stock/Variant change detected! Refreshing...');
                fetchProducts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Pagination Logic
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const currentProducts = products.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
        }
    };

    return (
        <div className="flex-1 bg-white flex flex-col">
            <div className="flex-1">
                {/* Banner Carousel Simulation */}
                <div className="w-full bg-black text-white h-40 md:h-64 flex items-center justify-center relative overflow-hidden border-b border-gray-900">
                    <div className="text-center z-10 p-4 relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-8 bg-white/20"></div>
                        <h2 className="text-3xl md:text-6xl font-black italic tracking-tighter mb-3 leading-none">SEASON<br/>DROP</h2>
                        <div className="flex items-center justify-center gap-3">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400">Limited Edition Headwear</p>
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </div>
                    </div>
                    {/* Technical Grid Background */}
                    <div className="absolute inset-0 opacity-10" 
                         style={{ 
                             backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
                             backgroundSize: '20px 20px' 
                         }}>
                    </div>
                    
                </div>

                {/* Categories / Quick Links */}
                <div className="border-b border-gray-100 py-6 px-4 mb-8">
                    <div className="max-w-screen-xl mx-auto">
                        <div className="flex justify-center gap-8 md:gap-16">
                            {[
                                { icon: 'FITTED', label: 'IPAP FITTED' },
                                { icon: 'SNAPBACK', label: 'IPAP SNAPBACK' },
                                
                            ].map((cat, i) => (
                                <div
                                    key={i}
                                    className="group flex flex-col items-center gap-2 cursor-pointer"
                                >
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 border border-gray-200 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm">
                                        <span className="font-black italic text-xs md:text-sm tracking-tighter">{cat.icon}</span>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">{cat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Feed */}
                <div className="px-2 md:px-8 max-w-screen-xl mx-auto mt-4 mb-16">
                    <div className="flex items-center justify-between mb-6 border-b border-black pb-2">
                        <h3 className="font-mono text-sm font-bold uppercase tracking-widest">Latest Arrivals</h3>
                        <span className="font-mono text-xs text-gray-400">{products.length} ITEMS</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-4">
                        {loading && <div className="col-span-full text-center py-20 font-mono text-sm">LOADING_DATA...</div>}

                        {!loading && currentProducts.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-400 font-mono">NO_PRODUCTS_FOUND</div>
                        )}

                        {currentProducts.map((product) => {
                            const discount = product.originalPrice
                                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                                : 0;

                            return (
                                <div
                                    key={product.id}
                                    className="group cursor-pointer flex flex-col"
                                    onClick={() => onProductClick(product)}
                                >
                                    <div className="aspect-square bg-gray-100 relative overflow-hidden mb-3 border border-transparent group-hover:border-black transition-all duration-300">
                                        <img 
                                            src={product.images[0]} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                            loading="lazy" 
                                        />
                                        {discount > 0 && (
                                            <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-mono font-bold px-2 py-1">
                                                -{discount}%
                                            </div>
                                        )}
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-xs md:text-sm font-bold uppercase tracking-tight leading-snug line-clamp-2 min-h-[2.5em] group-hover:underline decoration-1 underline-offset-4">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center justify-between mt-1 border-t border-gray-100 pt-2">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs text-gray-400 uppercase">Price</span>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="font-mono font-bold text-sm md:text-base">₱{product.price.toLocaleString()}</span>
                                                    {product.originalPrice && (
                                                        <span className="text-gray-300 text-[10px] line-through decoration-gray-400 font-mono">₱{product.originalPrice.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-mono text-xs text-gray-400 uppercase">Sold</span>
                                                <span className="font-mono text-xs font-bold">{product.soldCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {!loading && totalPages > 1 && (
                        <div className="mt-12 flex justify-center items-center gap-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white border border-gray-200 text-sm font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Prev
                            </button>

                            <span className="text-sm font-mono font-bold text-gray-500">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white border border-gray-200 text-sm font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};