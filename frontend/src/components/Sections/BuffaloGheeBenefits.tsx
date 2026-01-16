"use client";
import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Wind, Moon, Flame, ShieldCheck, Heart } from 'lucide-react';

export default function BuffaloGheeBenefits() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const jarRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Only run complex ScrollTrigger animations on desktop (md+)
        // On mobile, we want a simple scrolling list, not a pin-and-reveal which feels clunky on small touch screens
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=300%",
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1
                    }
                });

                // 1. Center the Jar and Splash
                tl.to(jarRef.current, { scale: 1.1, y: -50, duration: 1 });

                // 2. Animate Benefits in a radial/staggered pattern
                const cards = gsap.utils.toArray('.benefit-item');

                // Left Side Items (coming from left)
                tl.fromTo(cards[0] as Element, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 2 }, "<");
                tl.fromTo(cards[1] as Element, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 2 }, "-=1");

                // Right Side Items (coming from right)
                tl.fromTo(cards[2] as Element, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 2 }, "-=2");
                tl.fromTo(cards[3] as Element, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 2 }, "-=1");

                // Bottom Item (coming from bottom)
                tl.fromTo(cards[4] as Element, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 2 }, "-=1");

            }, sectionRef);
            return () => ctx.revert();
        });

        // Mobile Animation: Simple fade up on scroll
        mm.add("(max-width: 767px)", () => {
            const cards = gsap.utils.toArray('.benefit-item');
            cards.forEach((card: any) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1, y: 0, duration: 0.8,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%",
                        }
                    }
                );
            });
        });

        return () => mm.revert();
    }, []);

    const benefits = [
        {
            title: "Enticing Aroma",
            desc: "The signature nutty fragrance of pure buffalo ghee fills your kitchen.",
            icon: <Wind />,
            position: "left-top"
        },
        {
            title: "Pure White & Granular",
            desc: "Unlike yellow cow ghee, pure buffalo ghee is ivory white with a rich granular texture.",
            icon: <ShieldCheck />,
            position: "left-bottom"
        },
        {
            title: "Better Sleep",
            desc: "Known to aid sleep and improve nervous system health naturally.",
            icon: <Moon />,
            position: "right-top"
        },
        {
            title: "High Smoke Point",
            desc: "Perfect for Indian frying and sautéing without burning.",
            icon: <Flame />,
            position: "right-bottom"
        },
        {
            title: "Bilona Method",
            desc: "Hand-churned from curd, ensuring zero machines touching the butter.",
            icon: <Heart />,
            position: "center-bottom"
        }
    ];

    return (
        <section ref={sectionRef} className="bg-[#fffcf5] relative min-h-screen w-full overflow-hidden flex items-center justify-center py-12 md:py-20">
            <div className="container mx-auto px-6 relative h-full flex flex-col justify-center">

                {/* HEADLINE */}
                {/* Desktop Headline */}
                <div className="text-center absolute top-10 w-full z-10 hidden md:block">
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-nature-earth mb-2">Pure & Authentic</h2>
                    <p className="text-zinc-500 uppercase tracking-widest text-sm">Buffalo Ghee Benefits</p>
                </div>
                {/* Mobile Headline */}
                <div className="text-center w-full z-10 md:hidden mb-12">
                    <h2 className="text-3xl font-serif font-bold text-nature-earth mb-1">Pure & Authentic</h2>
                    <p className="text-zinc-500 uppercase tracking-widest text-[10px]">Buffalo Ghee Benefits</p>
                </div>

                {/* RESPONSIVE LAYOUT CONTAINER */}
                <div className="relative flex-1 flex flex-col md:block items-center justify-center mt-0 md:mt-20 w-full">

                    {/* CENTER IMAGE */}
                    <div ref={jarRef} className="relative w-64 h-64 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] md:h-[500px] z-10 mx-auto mb-12 md:mb-0">
                        <div className="relative w-full h-full drop-shadow-2xl">
                            <Image
                                src="/images/branded-ghee-jar-latest.png"
                                alt="Grama Harvest Buffalo Ghee"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* BENEFITS LIST - DESKTOP (Radial Layout) */}
                    <div className="hidden md:block w-full h-full">
                        {/* 1. Aroma */}
                        <div className="benefit-item absolute left-20 top-20 max-w-xs text-right opacity-0">
                            <div className="flex flex-row items-center justify-end gap-3 mb-2">
                                <h3 className="text-2xl font-serif font-bold text-nature-earth order-1">{benefits[0].title}</h3>
                                <div className="p-3 bg-nature-cream rounded-full text-nature-earth shadow-sm order-2">{benefits[0].icon}</div>
                            </div>
                            <p className="text-base text-zinc-600 leading-relaxed">{benefits[0].desc}</p>
                        </div>

                        {/* 2. White Color */}
                        <div className="benefit-item absolute left-20 bottom-32 max-w-xs text-right opacity-0">
                            <div className="flex flex-row items-center justify-end gap-3 mb-2">
                                <h3 className="text-2xl font-serif font-bold text-nature-earth order-1">{benefits[1].title}</h3>
                                <div className="p-3 bg-nature-cream rounded-full text-nature-earth shadow-sm order-2">{benefits[1].icon}</div>
                            </div>
                            <p className="text-base text-zinc-600 leading-relaxed">{benefits[1].desc}</p>
                        </div>

                        {/* 3. Sleep */}
                        <div className="benefit-item absolute right-20 top-20 max-w-xs text-left opacity-0">
                            <div className="flex flex-row items-center justify-start gap-3 mb-2">
                                <div className="p-3 bg-nature-cream rounded-full text-nature-earth shadow-sm">{benefits[2].icon}</div>
                                <h3 className="text-2xl font-serif font-bold text-nature-earth">{benefits[2].title}</h3>
                            </div>
                            <p className="text-base text-zinc-600 leading-relaxed">{benefits[2].desc}</p>
                        </div>

                        {/* 4. Smoke Point */}
                        <div className="benefit-item absolute right-20 bottom-32 max-w-xs text-left opacity-0">
                            <div className="flex flex-row items-center justify-start gap-3 mb-2">
                                <div className="p-3 bg-nature-cream rounded-full text-nature-earth shadow-sm">{benefits[3].icon}</div>
                                <h3 className="text-2xl font-serif font-bold text-nature-earth">{benefits[3].title}</h3>
                            </div>
                            <p className="text-base text-zinc-600 leading-relaxed">{benefits[3].desc}</p>
                        </div>

                        {/* 5. Bilona (Center Bottom) */}
                        <div className="benefit-item absolute left-1/2 -translate-x-1/2 -bottom-10 max-w-md text-center opacity-0">
                            <div className="flex justify-center mb-3 text-nature-red">
                                {benefits[4].icon}
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-nature-earth mb-2">{benefits[4].title}</h3>
                            <p className="text-base text-zinc-600">{benefits[4].desc}</p>
                        </div>
                    </div>

                    {/* BENEFITS LIST - MOBILE (Horizontal Scroll Snap Carousel) */}
                    <div className="md:hidden w-screen -mx-6 mt-10 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory flex gap-4 px-6">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex-none w-[85vw] snap-center bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-nature-cream/50 rounded-full text-nature-earth mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-serif font-bold text-nature-earth mb-2">{benefit.title}</h3>
                                <p className="text-sm text-zinc-600 leading-relaxed text-balance">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
}


