"use client";
import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

export default function StoryJourney() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: "300%",
                    scrub: 1,
                    pin: true
                }
            });

            // SCENE 1 to SCENE 2 transition
            tl.to(".scene-1", { opacity: 0, duration: 1 })
                .fromTo(".scene-2", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 })

                // SCENE 2 to SCENE 3
                .to(".scene-2", { opacity: 0, duration: 1 })
                .fromTo(".scene-3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-nature-cream relative">
            <div ref={triggerRef} className="h-screen w-full relative overflow-hidden flex items-center justify-center">

                {/* --- SCENE 1: THE CURD (Milk Fermentation) --- */}
                <div className="scene-1 absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-center p-10 bg-[#f4e4bc]">
                    <div className="w-full md:w-1/2 flex flex-col justify-center z-10">
                        <span className="text-nature-earth/60 font-serif tracking-widest uppercase mb-4">Step 01: Fermentation</span>
                        <h2 className="text-5xl md:text-7xl font-serif font-black text-nature-earth mb-6">
                            Ancient<br />Wisdom.
                        </h2>
                        <p className="text-xl text-zinc-700 max-w-lg leading-relaxed">
                            We don't just boil milk. We culture it in earthen pots overnight.
                            This slow fermentation turns rich buffalo milk into probiotic curd—the soul of Bilona ghee.
                        </p>
                    </div>
                    <div className="hidden md:block w-1/2 h-[70vh] relative">
                        {/* Conceptual abstract circle representing pot/moon */}
                        <div className="absolute inset-0 bg-nature-gold/20 rounded-full blur-3xl transform scale-75 animate-pulse"></div>
                    </div>
                </div>

                {/* --- SCENE 2: THE CHURN (Bilona) --- */}
                <div className="scene-2 absolute inset-0 w-full h-full flex items-center justify-center opacity-0 bg-[#3E2723]"> {/* Dark Earthy Background */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/bilona-process.png"
                            alt="Bilona Churning"
                            fill
                            className="object-cover opacity-40 mix-blend-overlay"
                        />
                    </div>
                    <div className="relative z-10 text-center text-[#F2C94C] max-w-3xl px-6">
                        <span className="tracking-[0.5em] uppercase text-sm mb-4 block animate-pulse">Before Sunrise</span>
                        <h2 className="text-6xl md:text-8xl font-serif font-bold mb-8 drop-shadow-lg">
                            The Bilona Churn.
                        </h2>
                        <p className="text-2xl font-light text-white/90 leading-relaxed drop-shadow-md">
                            Two-way wooden churning. Clockwise, then anti-clockwise.
                            Slowly separating the white butter (Makkhan) from the buttermilk.
                            <br /><span className="italic opacity-80 text-lg mt-4 block">"Just like Krishna used to love."</span>
                        </p>
                    </div>
                </div>

                {/* --- SCENE 3: THE GOLD (Boiling) --- */}
                <div className="scene-3 absolute inset-0 w-full h-full flex flex-col items-center justify-center opacity-0 bg-gradient-to-b from-[#FFF8E1] to-[#FFECB3]">
                    <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center px-6">
                        <div className="order-2 md:order-1 relative h-[500px] w-full rounded-full overflow-hidden shadow-2xl border-8 border-white">
                            <Image
                                src="/images/branded-ghee-jar-latest.png"
                                alt="Golden Ghee"
                                fill
                                className="object-contain transform scale-125"
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-5xl md:text-7xl font-serif font-bold text-nature-gold mb-6">
                                Liquid Gold.
                            </h2>
                            <p className="text-xl text-nature-earth leading-relaxed">
                                The butter is slowly boiled over a low wood fire.
                                No machines. No shortcuts.
                                Just patience, until the golden nectar separates, leaving behind rich, granular residue.
                            </p>
                            <div className="mt-8 flex gap-4">
                                <span className="px-4 py-2 bg-nature-earth text-white rounded-full text-sm font-bold">Aroma locked</span>
                                <span className="px-4 py-2 bg-nature-earth text-white rounded-full text-sm font-bold">Nutrients preserved</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
