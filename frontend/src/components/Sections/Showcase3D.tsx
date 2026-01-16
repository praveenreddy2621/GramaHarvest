"use client";
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';

// Dynamic 3D imports
const GheeScene = dynamic(() => import('../Canvas/GheeScene'), { ssr: false });
const ChillisComposition = dynamic(() => import('../Canvas/RealChilli').then(m => m.ChillisComposition), { ssr: false });
// Need to wrap Chillis in Canvas for this section if not already
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

function ChilliesCanvasWrapper() {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
                <ambientLight intensity={1} />
                <ChillisComposition />
            </Canvas>
        </div>
    )
}

export default function Showcase3D() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const chilliesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Chillies Slide In Animation
            gsap.from(chilliesRef.current, {
                scrollTrigger: {
                    trigger: chilliesRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    scrub: 1
                },
                x: 100,
                opacity: 0,
                duration: 1
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="products" ref={sectionRef} className="py-24 bg-[#fffefc] relative">
            <div className="container mx-auto px-4">

                {/* 1. HERO PRODUCT: GHEE */}
                <div className="flex flex-col md:flex-row items-center gap-12 mb-32">
                    <div className="w-full md:w-1/2 h-[500px] bg-[#fdfbf7] rounded-[3rem] shadow-inner relative overflow-hidden">
                        {/* Static Branded Ghee Jar */}
                        <div className="relative w-full h-full p-8 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/branded-ghee-jar-latest.png"
                                alt="Pure Buffalo Ghee"
                                className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-6">
                        <span className="text-nature-gold font-bold text-xl tracking-widest uppercase">The Essence</span>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-nature-earth">Pure Buffalo Ghee</h2>
                        <p className="text-lg text-zinc-600 leading-relaxed">
                            Hand-churned using the Bilona method. Our ghee is granular, golden, and packed with nostalgia.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {["100% Organic", "A2 Protein", "Immunity Booster"].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-nature-green font-medium">
                                    <div className="w-2 h-2 bg-nature-gold rounded-full" /> {item}
                                </li>
                            ))}
                        </ul>
                        <button className="mt-8 px-8 py-4 bg-nature-earth text-white rounded-full font-bold hover:bg-nature-green transition-colors flex items-center gap-2">
                            Shop Ghee <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                {/* 2. SECONDARY PRODUCTS: RICE & CHILLIES */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* RICE CARD */}
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-nature-earth/10 group">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-3xl font-serif font-bold text-nature-earth">Aged Rice</h3>
                                <p className="text-nature-earth/60">Sona Masoori</p>
                            </div>
                            <div className="w-16 h-16 bg-nature-green/10 rounded-full flex items-center justify-center text-nature-green group-hover:scale-110 transition-transform">
                                <span className="font-bold">25kg</span>
                            </div>
                        </div>
                        <div className="h-64 rounded-2xl bg-zinc-100 mb-8 overflow-hidden relative">
                            {/* Static Image for Rice */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/rice-bag.png" alt="Rice Bag" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <button className="w-full py-4 border-2 border-nature-green text-nature-green rounded-xl font-bold hover:bg-nature-green hover:text-white transition-colors">
                            View Details
                        </button>
                    </div>

                    {/* CHILLIES CARD - With Slide Animation */}
                    <div ref={chilliesRef} className="bg-red-50 p-8 md:p-12 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-red-100 group relative overflow-hidden">
                        {/* 3D Background */}
                        <div className="absolute inset-0 opacity-50 pointer-events-none">
                            <ChilliesCanvasWrapper />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-3xl font-serif font-bold text-nature-red">Guntur Chillies</h3>
                                    <p className="text-red-800/60">Fiery & Authentic</p>
                                </div>
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-nature-red group-hover:rotate-12 transition-transform">
                                    <span className="font-bold">Hot</span>
                                </div>
                            </div>

                            <div className="h-64 grid place-items-center mb-8">
                                <p className="text-xl md:text-2xl font-serif text-center text-red-900 max-w-xs leading-snug">
                                    "The spice that defines Andhra cuisine."
                                </p>
                            </div>

                            <button className="w-full py-4 border-2 border-nature-red text-nature-red rounded-xl font-bold hover:bg-nature-red hover:text-white transition-colors shadow-sm">
                                Browse Spices
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
