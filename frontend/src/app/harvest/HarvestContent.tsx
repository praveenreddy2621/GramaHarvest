"use client";
import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import { useCart } from '@/context/CartContext';
import { BACKEND_API } from '@/config';
import { useSearchParams } from 'next/navigation';
import { ShoppingBag, Star, Bell } from 'lucide-react';
import ThreeDProductCard from '@/components/UI/ThreeDProductCard';

export default function HarvestContent() {
    const { addToCart } = useCart();
    // ... rest of the component
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setSelectedCategory(cat);
    }, [searchParams]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${BACKEND_API}/api/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${BACKEND_API}/api/categories`);
            if (res.ok) {
                const data = await res.json();
                const categoryNames = data.map((cat: any) => cat.name);
                setCategories(['All', ...categoryNames]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <main className="min-h-screen bg-nature-cream">
            <Navbar />

            {/* Header */}
            <div className="bg-nature-green text-white pt-32 pb-20 rounded-b-[3rem] shadow-xl">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-serif font-bold mb-4">Our Harvest</h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Explore our complete collection of farm-fresh produce and traditional staples.
                    </p>
                </div>
            </div>

            {/* Product Grid */}
            <section className="container mx-auto px-4 py-20">

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${cat === selectedCategory
                                ? 'bg-nature-earth text-white shadow-lg'
                                : 'bg-white text-nature-earth hover:bg-nature-earth/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>



                {loading ? (
                    <div className="text-center py-20">
                        <div className="text-2xl text-gray-500 font-serif">Harvesting products...</div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-2xl text-gray-500 font-serif">No products found in this category.</div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
                        {filteredProducts.map((product: any) => (
                            <ThreeDProductCard
                                key={product.id}
                                product={product}
                                addToCart={addToCart}
                            />
                        ))}
                    </div>
                )}

            </section>

            <Footer />
        </main>
    );
}

