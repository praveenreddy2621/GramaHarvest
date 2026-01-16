"use client";
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';

import Navbar from './Navbar';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    const buffaloRef = useRef<HTMLDivElement>(null);

    // -------------------------------------------
    // BUFFALO SKETCH ANIMATION (GSAP)
    // -------------------------------------------
    useEffect(() => {
        if (!buffaloRef.current) return;

        // Vintage "Hand-Drawn" Shake Effect (Roughness)
        gsap.to(buffaloRef.current, {
            rotation: 0.5,
            x: 2,
            y: 1,
            duration: 0.1,
            repeat: -1,
            yoyo: true,
            ease: "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false})"
        });

        // Slow Float/Breath
        gsap.to(buffaloRef.current, {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }, []);


    return (
        <div className="min-h-screen flex bg-nature-cream overflow-hidden">
            <Navbar />

            {/* LEFT: Vintage Sketch Scene */}
            <div className="hidden md:flex w-1/2 relative bg-[#FDFBF7] items-center justify-center overflow-hidden pt-20">
                {/* 1. PAPER TEXTURE OVERLAY */}
                <div className="absolute inset-0 opacity-20 pointer-events-none z-10"
                    style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
                </div>

                {/* 2. BACKGROUND BLOBS (Subtle Color) */}
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-nature-gold/10 rounded-full blur-3xl mix-blend-multiply" />
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-nature-earth/5 rounded-full blur-3xl mix-blend-multiply" />

                {/* 3. SKETCH BUFFALO IMAGE */}
                <div ref={buffaloRef} className="relative w-[80%] h-[60%] z-20 opacity-90 mix-blend-multiply grayscale-[20%] contrast-125">
                    <Image
                        src="/images/buffalo-sketch.png"
                        alt="Buffalo Sketch"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                {/* 4. TYPOGRAPHY */}
                <div className="absolute top-28 left-0 w-full text-center px-12 z-0 opacity-10">
                    <h2 className="text-[12rem] font-serif font-black text-nature-earth tracking-tighter leading-none">
                        GH
                    </h2>
                </div>

                {/* 5. TEXT CONTENT */}
                <div className="absolute bottom-12 left-12 text-nature-earth z-30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[2px] w-12 bg-nature-earth"></div>
                        <span className="text-xs uppercase tracking-[0.3em] font-bold">Est. 2026</span>
                    </div>
                    <p className="font-serif text-3xl italic max-w-sm leading-tight text-nature-earth/80">
                        "The soil, the soul, and the story of every grain."
                    </p>
                </div>
            </div>

            {/* RIGHT: Form Container */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 relative bg-white pt-24 md:pt-16">
                <div className="w-full max-w-md z-10">

                    <div className="text-center mb-8">
                        {/* BRAND LOGO Added Here */}
                        <div className="w-20 h-20 mx-auto mb-6 relative rounded-full overflow-hidden border-2 border-nature-earth shadow-lg block md:hidden">
                            <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" />
                        </div>
                        <div className="w-20 h-20 mx-auto mb-6 relative rounded-full overflow-hidden border-2 border-nature-earth shadow-lg hidden md:block">
                            <Image src="/images/logo.jpg" alt="Logo" fill className="object-cover" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-nature-earth mb-3 tracking-tight">{title}</h1>
                        <p className="text-nature-earth/60 text-lg">{subtitle}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
