"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Star, Bell } from 'lucide-react';
import { BACKEND_API } from '@/config';
import { useCart } from '@/context/CartContext';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    image_url: string;
    gallery_urls?: string[];
    category: string;
    stock: number;
    is_preorder: boolean;
    sizes?: { size: string, price: number }[];
}

interface ThreeDProductCardProps {
    product: Product;
    addToCart: (item: any) => void;
}

export default function ThreeDProductCard({ product, addToCart }: ThreeDProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isInCart, setIsInCart] = useState(false);

    const { updateQuantity } = useCart();

    // Combine main image with gallery images
    const allImages = [
        product.image_url,
        ...(Array.isArray(product.gallery_urls) ? product.gallery_urls : [])
    ].filter(Boolean);

    const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
    const currentPrice = hasSizes
        ? (product.sizes![selectedSizeIndex]?.price || 0)
        : parseFloat(product.price?.toString() || '0');
    const currentSizeLabel = hasSizes
        ? (product.sizes![selectedSizeIndex]?.size || 'Standard')
        : '1 unit';

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Max rotation 15 degrees
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    const handleNotify = () => {
        const email = prompt('Enter your email to be notified when available:');
        if (email) {
            fetch(`${BACKEND_API}/api/products/${product.id}/notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
                .then(res => res.json())
                .then(data => alert(data.message))
                .catch(err => alert('Failed to subscribe'));
        }
    };

    return (
        <div
            className="group w-full min-h-[500px] h-auto [perspective:1000px] mb-8"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={cardRef}
                className="w-full h-full relative transition-transform duration-200 ease-out [transform-style:preserve-3d]"
                style={{}}
            >
                {/* Background Card Base */}
                <div className="absolute inset-0 bg-white rounded-[2rem] shadow-xl border border-stone-100/50 [transform:translateZ(0px)] transition-shadow duration-300 group-hover:shadow-2xl">
                    {/* Subtle Grain or Texture could go here */}
                </div>

                {/* Content Container */}
                <div className="relative h-full flex flex-col p-4 md:p-6 [transform-style:preserve-3d]">

                    {/* Header: Category & Rating */}
                    <div className="flex justify-between items-start mb-3 md:mb-4 [transform:translateZ(20px)]">
                        <div className="text-xs font-bold text-nature-green uppercase tracking-wider bg-nature-green/10 px-2 py-1 rounded-md">{product.category}</div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-zinc-500">
                            <Star size={14} className="fill-nature-gold text-nature-gold" /> 5.0
                        </div>
                    </div>

                    {/* Floating Product Image - The "Pop Out" */}
                    <div className="relative h-40 md:h-48 w-full mb-4 md:mb-6 [transform:translateZ(50px)] group-hover:[transform:translateZ(80px)_scale(1.1)] transition-all duration-300 ease-out [transform-style:preserve-3d]">
                        <div
                            className="w-full h-full relative transition-transform duration-200 ease-out"
                            style={{ transform: `rotateX(${rotation.x * 2}deg) rotateY(${rotation.y * 2}deg)` }}
                        >
                            <Image
                                src={allImages[currentImageIndex] ? `${BACKEND_API}${allImages[currentImageIndex]}` : '/images/logo.jpg'}
                                alt={product.name}
                                fill
                                className="object-contain drop-shadow-xl filter"
                            />
                        </div>

                        {/* Image Navigation Dots */}
                        {allImages.length > 1 && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-3 [transform:translateZ(15px)]">
                                {allImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${currentImageIndex === idx
                                            ? 'bg-nature-green w-6'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                        aria-label={`View image ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {product.is_preorder && (
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-nature-earth text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wide border-2 border-white [transform:translateZ(10px)]">
                                Waiting List
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="[transform:translateZ(30px)] text-center">
                        <h3 className="text-lg md:text-xl font-serif font-bold text-nature-earth mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-zinc-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                    </div>

                    {/* Size Selector */}
                    {hasSizes && (
                        <div className="[transform:translateZ(35px)] mb-3">
                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 text-center">Select Size</label>
                            <select
                                value={selectedSizeIndex}
                                onChange={(e) => setSelectedSizeIndex(parseInt(e.target.value))}
                                className="block w-full max-w-[200px] mx-auto border-2 border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 bg-white hover:border-nature-green focus:border-nature-green focus:ring-2 focus:ring-nature-green/20 outline-none transition-all text-center"
                            >
                                {product.sizes!.map((s, idx) => (
                                    <option key={idx} value={idx}>
                                        {s.size} - ₹{s.price}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="[transform:translateZ(40px)] mt-auto flex justify-center pb-2">
                        {product.is_preorder ? (
                            <button
                                onClick={handleNotify}
                                className="w-full bg-yellow-100 text-yellow-800 border-2 border-yellow-200 px-6 py-3 rounded-xl font-bold hover:bg-yellow-200 transition-colors shadow-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                            >
                                <Bell size={18} /> Join Waitlist
                            </button>
                        ) : !isInCart ? (
                            <button
                                onClick={() => {
                                    setIsInCart(true);
                                    addToCart({
                                        id: `${product.id}-${currentSizeLabel}`,
                                        productId: product.id.toString(),
                                        name: product.name,
                                        price: currentPrice,
                                        quantity: quantity,
                                        image: product.image_url ? `${BACKEND_API}${product.image_url}` : '/images/logo.jpg',
                                        unit: currentSizeLabel
                                    });
                                }}
                                className="w-full bg-nature-earth text-white px-6 py-3 rounded-xl font-bold hover:bg-nature-green transition-all shadow-lg shadow-nature-earth/30 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                            >
                                <ShoppingBag size={18} /> Add to Cart • ₹{currentPrice}
                            </button>
                        ) : (
                            <div className="w-full flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        setQuantity(Math.max(1, quantity - 1));
                                        updateQuantity(`${product.id}-${currentSizeLabel}`, -1);
                                    }}
                                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl transition-colors flex items-center justify-center"
                                >
                                    −
                                </button>
                                <div className="flex-1 text-center">
                                    <div className="text-sm font-semibold text-gray-500">In Cart</div>
                                    <div className="text-2xl font-bold text-nature-earth">{quantity}</div>
                                </div>
                                <button
                                    onClick={() => {
                                        setQuantity(Math.min(10, quantity + 1));
                                        updateQuantity(`${product.id}-${currentSizeLabel}`, 1);
                                    }}
                                    className="w-12 h-12 rounded-xl bg-nature-green hover:bg-nature-earth text-white font-bold text-xl transition-colors flex items-center justify-center"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
