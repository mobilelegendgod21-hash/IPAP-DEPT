import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import { Footer } from '../components/Footer';

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
                const { data, error } = await supabase
                    .from('products')
                    .select('*, variants:product_variants(*)')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const mapped: Product[] = data.map((p: any) => {
                        // Map variants from joined data
                        let variants = (p.variants || []).map((v: any) => ({
                            id: v.id,
                            size: v.size,
                            stock: v.stock,
                            price: v.price_override || Number(p.price)
                        }));

                        // Fallback for Products without Variants (Legacy or incomplete data)
                        if (variants.length === 0 && p.sizes && p.sizes.length > 0) {
                            variants = p.sizes.map((size: string) => ({
                                id: `${p.id}_${size}_fallback`,
                                size: size,
                                stock: 100, // Default stock fallback
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
                            sizes: variants.map((v: any) => v.size)
                        };
                    });
                    setProducts(mapped);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
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
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="flex-1 pb-10">
                {/* Banner Carousel Simulation */}
                {/* ... (Same Banner) ... */}
                <div className="w-full bg-black text-white h-48 md:h-64 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center z-10 p-4">
                        <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-2">SEASON DROP</h2>
                        <p className="font-mono text-sm uppercase tracking-widest text-gray-300">Free shipping on all orders</p>
                    </div>
                    {/* Abstract Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-50"></div>
                </div>

                {/* Categories / Quick Links */}
                {/* ... (Same Categories) ... */}
                <div className="bg-white py-6 px-4 mb-4 shadow-sm overflow-x-auto">
                    <div className="flex gap-6 min-w-max md:justify-center">
                        {[
                            { icon: '🧢', label: 'Fitted' },
                            { icon: '🎩', label: 'Snapback' },
                        ].map((cat, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 w-16"
                            >
                                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-xl shadow-sm">
                                    {cat.icon}
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-wide text-gray-600 text-center">{cat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Feed */}
                <div className="px-2 md:px-4 max-w-screen-xl mx-auto mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                        {loading && <div className="col-span-full text-center py-10">Loading...</div>}

                        {!loading && currentProducts.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-400">No products found.</div>
                        )}

                        {currentProducts.map((product) => {
                            // ... (Same Product Card Rendering)
                            const discount = product.originalPrice
                                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                                : 0;

                            return (
                                <div
                                    key={product.id}
                                    className="bg-white rounded hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-100 flex flex-col"
                                    onClick={() => onProductClick(product)}
                                >
                                    <div className="aspect-square bg-gray-100 relative">
                                        <img src={product.images[0]} className="w-full h-full object-cover" loading="lazy" />
                                        {discount > 0 && (
                                            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5">
                                                -{discount}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2 md:p-3 flex-1 flex flex-col">
                                        <h3 className="text-xs md:text-sm font-medium line-clamp-2 mb-2 min-h-[2.5em]">{product.name}</h3>

                                        <div className="mt-auto">
                                            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-red-600 font-mono font-bold text-sm md:text-base">₱{product.price.toLocaleString()}</span>
                                                    {product.originalPrice && (
                                                        <span className="text-gray-400 text-[10px] line-through">₱{product.originalPrice.toLocaleString()}</span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-gray-500">{product.soldCount} sold</span>
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

            <Footer />
        </div>
    );
};