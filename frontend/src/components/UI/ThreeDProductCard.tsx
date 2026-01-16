"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Star, Bell } from 'lucide-react';
import { BACKEND_API } from '@/config';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    stock: number;
    is_preorder: boolean;
}

interface ThreeDProductCardProps {
    product: Product;
    addToCart: (item: any) => void;
}

export default function ThreeDProductCard({ product, addToCart }: ThreeDProductCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

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
            className="group w-full h-[450px] [perspective:1000px]"
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
                <div className="relative h-full flex flex-col p-6 [transform-style:preserve-3d]">

                    {/* Header: Category & Rating */}
                    <div className="flex justify-between items-start mb-4 [transform:translateZ(20px)]">
                        <div className="text-xs font-bold text-nature-green uppercase tracking-wider bg-nature-green/10 px-2 py-1 rounded-md">{product.category}</div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-zinc-500">
                            <Star size={14} className="fill-nature-gold text-nature-gold" /> 5.0
                        </div>
                    </div>

                    {/* Floating Product Image - The "Pop Out" */}
                    {/* Negative margin top to make it pop out of the card boundary if possible, or just float high */}
                    <div className="relative h-56 w-full mb-6 [transform:translateZ(50px)] group-hover:[transform:translateZ(80px)_scale(1.1)] transition-all duration-300 ease-out [transform-style:preserve-3d]">
                        <div
                            className="w-full h-full relative transition-transform duration-200 ease-out"
                            style={{ transform: `rotateX(${rotation.x * 2}deg) rotateY(${rotation.y * 2}deg)` }}
                        >
                            <Image
                                src={product.image_url ? `${BACKEND_API}${product.image_url}` : '/images/logo.jpg'}
                                alt={product.name}
                                fill
                                className="object-contain drop-shadow-xl filter"
                            />
                        </div>
                        {product.is_preorder && (
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-nature-earth text-xs font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wide border-2 border-white [transform:translateZ(10px)]">
                                Waiting List
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="[transform:translateZ(30px)] text-center mt-auto">
                        <h3 className="text-2xl font-serif font-bold text-nature-earth mb-2 line-clamp-1">{product.name}</h3>
                        <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                    </div>

                    {/* Action Button */}
                    <div className="[transform:translateZ(40px)] mt-4 flex justify-center">
                        {product.is_preorder ? (
                            <button
                                onClick={handleNotify}
                                className="w-full bg-yellow-100 text-yellow-800 border-2 border-yellow-200 px-6 py-3 rounded-xl font-bold hover:bg-yellow-200 transition-colors shadow-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                            >
                                <Bell size={18} /> Join Waitlist
                            </button>
                        ) : (
                            <button
                                onClick={() => addToCart({
                                    id: product.id.toString(),
                                    name: product.name,
                                    price: product.price,
                                    image: product.image_url ? `${BACKEND_API}${product.image_url}` : '/images/logo.jpg',
                                    unit: '1 unit'
                                })}
                                className="w-full bg-nature-earth text-white px-6 py-3 rounded-xl font-bold hover:bg-nature-green transition-all shadow-lg shadow-nature-earth/30 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                            >
                                <ShoppingBag size={18} /> Add for ₹{product.price}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
