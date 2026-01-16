"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag, Flame, Droplet, Sun, Leaf } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamic import for 3D scenes
const GheeScene = dynamic(() => import("../Canvas/GheeScene"), { ssr: false });
const ChilliCanvas = dynamic(() => import("../Canvas/RealChilli").then(mod => mod.ChilliCanvas), { ssr: false });

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Product Data (Static for frontend demo, would ideally come from API)
const products = [
    {
        id: "ghee",
        name: "Pure Buffalo Ghee",
        desc: "Traditional Bilona method. Golden, granular, and aromatic.",
        price: "₹800 / 1L",
        icon: <Droplet className="text-nature-gold" />,
        color: "nature-gold",
        image: null, // 3D Scene
        features: ["100% Organic", "Bilona Method", "Immunity Booster"],
        component: <GheeScene />
    },
    {
        id: "rice",
        name: "Sona Masoori Rice",
        desc: "Aged naturally for 12 months. Fluffy and aromatic.",
        price: "₹1200 / 25kg",
        icon: <Leaf className="text-nature-green" />,
        color: "nature-green",
        image: "/images/rice-bag.png",
        features: ["Aged 12 Months", "Pesticide Free", "Direct from Farm"]
    },
    {
        id: "chilli",
        name: "Guntur Chilli & Powder",
        desc: "Hand-picked, sun-dried chillies with intense heat and color.",
        price: "₹400 / kg",
        icon: <Flame className="text-nature-red" />,
        color: "nature-red",
        image: null, // 3D Background
        features: ["Sun Dried", "High Heat", "No Color Added"],
        component: <div className="absolute inset-0 w-full h-full"><ChilliCanvas /></div>
    },
    {
        id: "turmeric",
        name: "Haldi (Turmeric)",
        desc: "High curcumin content. Natural antibiotic and antiseptic.",
        price: "₹300 / 500g",
        icon: <Sun className="text-yellow-600" />,
        color: "yellow-600",
        image: "/images/logo.jpg", // Placeholder
        features: ["High Curcumin", "Antiseptic", "Natural Color"]
    },
    {
        id: "mango",
        name: "Banganapalli Mangoes",
        desc: "The King of Fruits. Sweet, juicy, and naturally ripened.",
        price: "₹800 / Dozen",
        icon: <Sun className="text-orange-500" />,
        color: "orange-500",
        image: "/images/logo.jpg", // Placeholder
        features: ["Carbide Free", "Tree Ripened", "Summer Special"],
        seasonal: true
    }
];

export default function ProductShowcase() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Scroll Animations
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.product-card').forEach((card: any, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    },
                    y: 100,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: i * 0.1
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-zinc-50 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-24">
                    <span className="text-nature-green font-bold tracking-widest uppercase text-sm mb-2 block">Our Harvest</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-nature-earth mb-6">Straight from the Soil</h2>
                    <div className="w-24 h-1 bg-nature-gold mx-auto rounded-full"></div>
                </div>

                <div className="space-y-32">
                    {/* 1. GHEE (Featured 3D) */}
                    <div className="product-card grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 space-y-6">
                            <div className="flex items-center gap-3 text-nature-gold">
                                {products[0].icon}
                                <span className="font-bold tracking-wider uppercase">Dairy</span>
                            </div>
                            <h3 className="text-4xl font-serif font-bold text-nature-earth">{products[0].name}</h3>
                            <p className="text-lg text-zinc-600 leading-relaxed">{products[0].desc}</p>
                            <ul className="space-y-2">
                                {products[0].features?.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-zinc-700">
                                        <div className="w-1.5 h-1.5 bg-nature-gold rounded-full" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button className="px-8 py-3 bg-nature-earth text-nature-cream rounded-full hover:bg-nature-gold hover:text-nature-earth transition-all shadow-lg hover:shadow-xl font-semibold transform hover:-translate-y-1">
                                Buy Now - {products[0].price}
                            </button>
                        </div>
                        <div className="order-1 md:order-2 h-[400px] bg-nature-cream/30 rounded-3xl relative overflow-hidden">
                            {products[0].component}
                        </div>
                    </div>

                    {/* 2. RICE & TURMERIC (Grid) */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Rice */}
                        <div className="product-card bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-zinc-100 group">
                            <div className="relative h-64 mb-6 rounded-2xl overflow-hidden bg-stone-100">
                                <Image
                                    src={products[1].image!}
                                    alt={products[1].name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold text-nature-earth">{products[1].name}</h3>
                                        <p className="text-zinc-500 text-sm mt-1">{products[1].desc}</p>
                                    </div>
                                    <div className="p-2 bg-nature-green/10 rounded-full text-nature-green">
                                        {products[1].icon}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                                    <span className="font-bold text-lg text-nature-earth">{products[1].price}</span>
                                    <button className="text-nature-green font-semibold hover:underline">Add to Cart</button>
                                </div>
                            </div>
                        </div>

                        {/* Turmeric */}
                        <div className="product-card bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-zinc-100 group">
                            <div className="relative h-64 mb-6 rounded-2xl overflow-hidden bg-yellow-50 flex items-center justify-center">
                                {/* Placeholder Image replacement */}
                                <div className="text-center p-6">
                                    <div className="w-32 h-32 bg-yellow-400 rounded-full blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
                                    <Image src="/images/logo.jpg" alt="Turmeric" width={150} height={150} className="relative z-10 rounded-full shadow-lg" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-serif font-bold text-nature-earth">{products[3].name}</h3>
                                        <p className="text-zinc-500 text-sm mt-1">{products[3].desc}</p>
                                    </div>
                                    <div className="p-2 bg-yellow-100 rounded-full text-yellow-700">
                                        {products[3].icon}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                                    <span className="font-bold text-lg text-nature-earth">{products[3].price}</span>
                                    <button className="text-yellow-700 font-semibold hover:underline">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. CHILLI COLLECTION (Full Width Immersive) */}
                    <div className="product-card relative rounded-[3rem] overflow-hidden bg-red-50 min-h-[500px] flex items-center">
                        {/* 3D Background */}
                        {products[2].component}

                        <div className="relative z-10 w-full md:w-1/2 p-12 md:p-20 pointer-events-none">
                            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl pointer-events-auto border border-red-100">
                                <div className="flex items-center gap-2 text-nature-red mb-4">
                                    <Flame size={20} />
                                    <span className="font-bold uppercase tracking-wider">Spices</span>
                                </div>
                                <h3 className="text-4xl font-serif font-bold text-nature-earth mb-4">{products[2].name}</h3>
                                <p className="text-zinc-600 mb-6 leading-relaxed">
                                    Our Guntur chillies are world-renowned for their pungency and color. Available as whole dried chillies or fine powder.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button className="px-6 py-2 bg-nature-red text-white rounded-full hover:bg-red-700 transition-colors shadow-lg">
                                        Whole Chilli - ₹400
                                    </button>
                                    <button className="px-6 py-2 border border-nature-red text-nature-red rounded-full hover:bg-red-50 transition-colors">
                                        Powder - ₹450
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. SEASONAL MANGOES */}
                    <div className="product-card bg-orange-50 rounded-3xl p-8 md:p-16 relative overflow-hidden border border-orange-100">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full blur-[100px] opacity-50"></div>
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div className="inline-block px-4 py-1 bg-orange-500 text-white rounded-full text-sm font-bold uppercase tracking-wider animate-pulse">
                                    Summer Special
                                </div>
                                <h3 className="text-4xl font-serif font-bold text-orange-900">{products[4].name}</h3>
                                <p className="text-orange-900/70 text-lg leading-relaxed">{products[4].desc}</p>
                                <div className="flex gap-4 pt-2">
                                    <button className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 font-semibold">
                                        Pre-Order Now
                                    </button>
                                </div>
                            </div>
                            <div className="relative h-64 md:h-80 flex items-center justify-center">
                                {/* Using generic logo as placeholder but styled as Mango */}
                                <div className="relative w-64 h-64">
                                    <Image src="/images/logo.jpg" alt="Mango" fill className="object-contain drop-shadow-2xl rounded-full" />
                                    <div className="absolute inset-0 bg-orange-500 Mix-blend-overlay opacity-20 rounded-full"></div>
                                </div>
                                {/* Animated 'Seasonal' Badge */}
                                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-full shadow-xl rotate-12">
                                    <span className="block text-center font-bold text-orange-500 leading-tight">ONLY<br />IN<br />SEASON</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
