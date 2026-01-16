"use client";
import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';

export default function CinematicStoryHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cameraRef = useRef<HTMLDivElement>(null); // For Camera Shake

    const logoRef = useRef<HTMLDivElement>(null);

    // Scenes
    const scene1Ref = useRef<HTMLDivElement>(null);
    const scene2Ref = useRef<HTMLDivElement>(null);
    const scene3Ref = useRef<HTMLDivElement>(null);

    // Light/FX
    const sunFlareRef = useRef<HTMLDivElement>(null);
    const godRaysRef = useRef<HTMLDivElement>(null);

    // State
    const [storyPhase, setStoryPhase] = useState("origin");

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

            // --- INIT STATES ---
            gsap.set(cameraRef.current, { x: 0, y: 0 });
            gsap.set(scene2Ref.current, { opacity: 0, scale: 1.2 });
            gsap.set(scene3Ref.current, { opacity: 0 });
            gsap.set(logoRef.current, { scale: 1, opacity: 1, filter: "brightness(1)", rotation: 0 });

            gsap.set(sunFlareRef.current, { x: "-100%", opacity: 0 });
            gsap.set(godRaysRef.current, { opacity: 0, rotation: 0 });

            // ============================================
            // SCENE 1: THE ORIGIN (Mythical Reveal)
            // ============================================
            setStoryPhase("origin");

            // 1. Mystical Build-up (Glow only, no violent shake)
            tl.to(logoRef.current, {
                scale: 1.1,
                filter: "brightness(1.3) drop-shadow(0 0 30px rgba(255,215,0,0.6))",
                duration: 2,
                ease: "power2.inOut"
            });

            // 2. "Spirit Transformation" - Dissolve massive light
            tl.to(logoRef.current, {
                scale: 1.5,
                opacity: 0,
                filter: "blur(20px) brightness(3)",
                duration: 0.8,
                ease: "power2.in"
            }, "transform");

            // Flash of light to hide the swap
            tl.fromTo(sunFlareRef.current,
                { opacity: 0, x: "-50%" },
                { opacity: 0.8, x: "150%", duration: 1, ease: "power1.out" },
                "transform-=0.2"
            );



            // Subtle Handheld Camera Sway (No violent shake)
            tl.to(cameraRef.current, {
                x: "+=10",
                y: "+=5",
                rotation: 0.5,
                duration: 4,
                ease: "sine.inOut",
                yoyo: true,
                repeat: 1
            }, "transform");


            // ============================================
            // SCENE 2: THE HARVEST (Cinematic Reveal)
            // ============================================
            tl.call(() => setStoryPhase("harvest"), undefined, "-=1.5");

            // Cinematic "Wipe" Transition via Sun Flare
            const transitionTime = "transform+=3";

            tl.fromTo(sunFlareRef.current,
                { x: "-100%", opacity: 0 },
                { x: "200%", opacity: 0.8, duration: 2, ease: "power2.inOut" },
                transitionTime
            );

            // Swap Scenes behind the flare
            tl.to(scene1Ref.current, { opacity: 0, duration: 0.5 }, `${transitionTime}+=0.5`);
            tl.to(scene2Ref.current, { opacity: 1, duration: 0.5 }, `${transitionTime}+=0.5`);

            // Slow Pan/Zoom for Scale
            tl.to(scene2Ref.current, { scale: 1, duration: 5, ease: "none" }, `${transitionTime}+=0.5`);

            tl.to({}, { duration: 3 }); // Hold Phase


            // ============================================
            // SCENE 3: THE GLORY (God Tier Product)
            // ============================================
            tl.call(() => setStoryPhase("product"));

            // Fade to Product
            tl.to(scene2Ref.current, { opacity: 0, duration: 1.5 });
            tl.to(scene3Ref.current, { opacity: 1, duration: 1.5 }, "<");

            // God Rays Spin
            tl.to(godRaysRef.current, { opacity: 0.6, duration: 1 }, "<");
            gsap.to(godRaysRef.current, { rotation: 360, duration: 20, repeat: -1, ease: "none" });

            // Hero Jar Floating Landing
            tl.fromTo("#hero-product-jar",
                { y: -50, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
                "<+=0.5"
            );

            // Levitation Effect
            tl.to("#hero-product-jar", { y: -15, duration: 2, yoyo: true, repeat: 2, ease: "sine.inOut" });

            // LOOP RESET
            tl.to(scene3Ref.current, { opacity: 0, duration: 1 });
            tl.to(scene1Ref.current, { opacity: 1, duration: 1 });
            tl.to(logoRef.current, { opacity: 1, scale: 1, duration: 0.5 });
            gsap.set(cameraRef.current, { x: 0, y: 0 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black text-white">

            {/* GLOBAL CAMERA CONTAINER (For Shakes) */}
            <div ref={cameraRef} className="absolute inset-0 w-full h-full">

                {/* --- LAYERS: ATMOSPHERE --- */}
                <div className="absolute inset-0 z-40 pointer-events-none mix-blend-screen opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>

                {/* --- SCENE 1: ORIGIN --- */}
                <div ref={scene1Ref} className="absolute inset-0 w-full h-full z-10 flex items-center justify-center">
                    <div className="absolute inset-0">
                        <Image src="/images/hero-bg.png" alt="Origin" fill className="object-cover opacity-50" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
                    </div>

                    {/* LOGO */}
                    <div ref={logoRef} className="relative z-20 w-56 h-56 md:w-80 md:h-80 drop-shadow-[0_0_35px_rgba(255,215,0,0.3)]">
                        <Image src="/images/logo.jpg" alt="Logo" fill className="object-contain rounded-full border-4 border-nature-gold/20" />
                    </div>


                </div>

                {/* --- SCENE 2: HARVEST --- */}
                <div ref={scene2Ref} className="absolute inset-0 w-full h-full z-20 opacity-0">
                    <Image src="/images/farmers-harvest.png" alt="Harvest" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
                </div>

                {/* --- SCENE 3: PRODUCT GLORY --- */}
                <div ref={scene3Ref} className="absolute inset-0 w-full h-full z-30 opacity-0 flex items-center justify-center bg-[#1a0f05]">
                    {/* Background Glow */}
                    <div className="absolute inset-0">
                        <Image src="/images/hero-bg-3.png" alt="Atmosphere" fill className="object-cover opacity-30 blur-sm" />
                    </div>

                    {/* GOD RAYS - Centered to prevent overflow */}
                    <div ref={godRaysRef} className="absolute z-10 w-[200vw] h-[200vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-screen pointer-events-none">
                        <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,215,0,0.2)_20deg,transparent_40deg,rgba(255,215,0,0.2)_60deg,transparent_80deg,rgba(255,215,0,0.2)_100deg,transparent_120deg)] animate-spin-slow"></div>
                    </div>

                    {/* PRODUCT */}
                    <div id="hero-product-jar" className="relative z-50 w-[200px] h-[280px] md:w-[450px] md:h-[550px]">
                        <Image
                            src="/images/branded-ghee-jar-latest.png"
                            alt="Royal Ghee"
                            fill
                            className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        />
                        {/* Reflection/Ground Shadow */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-10 bg-black/50 blur-xl rounded-full" />
                    </div>
                </div>

                {/* --- FX: SUN FLARE TRANSITION LAYER --- */}
                <div ref={sunFlareRef} className="absolute top-0 left-0 z-50 pointer-events-none w-[150%] h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transform -skew-x-12 blur-2xl mix-blend-overlay" />

            </div>

            {/* --- UI: CINEMATIC TYPOGRAPHY --- */}
            <div className="absolute inset-x-0 bottom-16 z-[60] text-center px-6">
                <div className="max-w-5xl mx-auto">
                    {storyPhase === "origin" && (
                        <div className="space-y-2">
                            <div className="inline-block px-4 py-1 border border-nature-gold/30 rounded-full bg-black/40 backdrop-blur-md text-nature-gold text-xs tracking-[0.3em] uppercase mb-4 animate-fade-in">
                                Chapter I
                            </div>
                            <h1 className="text-4xl md:text-8xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-nature-cream to-nature-earth drop-shadow-lg tracking-tight">
                                THE ORIGIN
                            </h1>
                        </div>
                    )}
                    {storyPhase === "harvest" && (
                        <div className="space-y-2">
                            <div className="inline-block px-4 py-1 border border-lime-400/30 rounded-full bg-black/40 backdrop-blur-md text-lime-400 text-xs tracking-[0.3em] uppercase mb-4 animate-fade-in">
                                Chapter II
                            </div>
                            <h1 className="text-4xl md:text-8xl font-serif font-black text-white drop-shadow-xl tracking-tight">
                                EARTH'S BOUNTY
                            </h1>
                            <p className="text-lg md:text-2xl text-lime-100 font-light tracking-wide max-w-2xl mx-auto drop-shadow-md">
                                Where every grain tells a story of patience.
                            </p>
                        </div>
                    )}
                    {storyPhase === "product" && (
                        <div className="space-y-4 px-4">
                            <div className="inline-block px-3 py-1 border border-orange-400/30 rounded-full bg-black/40 backdrop-blur-md text-orange-400 text-[10px] md:text-xs tracking-[0.3em] uppercase animate-fade-in whitespace-nowrap">
                                The Masterpiece
                            </div>
                            <h1 className="text-4xl sm:text-6xl md:text-9xl font-serif font-black text-nature-gold drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] tracking-tighter leading-tight">
                                LIQUID<br className="md:hidden" /> GOLD
                            </h1>
                            <div className="pt-4 flex justify-center">
                                <Link
                                    href="/harvest"
                                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 md:px-10 md:py-5 bg-nature-gold text-nature-dark-brown rounded-full font-bold text-sm md:text-lg tracking-wider overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_40px_rgba(234,179,8,0.5)] w-auto max-w-[200px] md:max-w-none"
                                >
                                    <span className="relative z-10 whitespace-nowrap">CLAIM YOURS</span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* VIGNETTE OVERLAY */}
            <div className="absolute inset-0 z-[55] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6)_100%)]" />

        </section>
    );
}
