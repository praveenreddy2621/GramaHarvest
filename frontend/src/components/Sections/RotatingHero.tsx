"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

const slides = [
    {
        id: 1,
        bg: "/images/hero-bg.png",
        title: "GOLDEN PURITY",
        subtitle: "Traditional Bilona Buffalo Ghee",
        desc: "Straight from our Farm to your Kitchen",
        theme: "text-[#422e1a]",
        accent: "text-nature-earth",
    },
    {
        id: 2,
        bg: "/images/hero-bg-2.png",
        title: "FRESH HARVEST",
        subtitle: "Nurtured by Nature",
        desc: "Experience the freshness of organic farming",
        theme: "text-white",
        accent: "text-lime-300",
    },
    {
        id: 3,
        bg: "/images/hero-bg-3.png",
        title: "TRADITION OF TASTE",
        subtitle: "Authentic Village Flavors",
        desc: "Bringing the village warmth to your home",
        theme: "text-[#2a1a0a]",
        accent: "text-orange-600",
    },
];

export default function RotatingHero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const bgRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const productRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            slides.forEach((_, index) => {
                const isLast = index === slides.length - 1;
                const duration = 5; // Time to stay on slide

                tl.to(
                    {},
                    {
                        duration: duration,
                        onStart: () => {
                            setCurrentSlide(index);
                            animateSlideTransition(index);
                        },
                    }
                );
            });
        }, bgRef);

        return () => ctx.revert();
    }, []);

    const animateSlideTransition = (index: number) => {
        // 1. Reset & Fade In Current Slide
        gsap.set(`.bg-slide-${index}`, { zIndex: 10 });

        // Reset scale immediately before starting animation
        gsap.set(`.bg-slide-${index} img`, { scale: 1 });

        // Fade in container
        gsap.fromTo(
            `.bg-slide-${index}`,
            { opacity: 0 },
            { opacity: 1, duration: 1.2, ease: "power2.out" }
        );

        // 2. Continuous "Ken Burns" Zoom Effect (Lasts entire slide duration + buffer)
        // This targets the IMAGE inside the slide div
        gsap.fromTo(
            `.bg-slide-${index} img`,
            { scale: 1 },
            { scale: 1.15, duration: 7, ease: "none", overwrite: true }
        );

        // 3. Fade Out Previous Slides
        slides.forEach((_, i) => {
            if (i !== index) {
                gsap.set(`.bg-slide-${i}`, { zIndex: 0 });
                gsap.to(`.bg-slide-${i}`, { opacity: 0, duration: 1.5 });
            }
        });

        // Text Animation
        gsap.fromTo(
            textRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
        );

        // Product Animation
        gsap.fromTo(
            productRef.current,
            { scale: 0.9, opacity: 0, rotation: 5 },
            { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: "back.out(1.7)", delay: 0.3 }
        );
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            {/* BACKGROUNDS */}
            <div ref={bgRef} className="absolute inset-0 w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`bg-slide-${index} absolute inset-0 w-full h-full opacity-0`}
                    >
                        <Image
                            src={slide.bg}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                ))}
            </div>

            {/* CONTENT LAYER */}
            <div className="absolute inset-0 z-20 container mx-auto px-6 flex flex-col md:flex-row items-center justify-center md:justify-between h-full pt-20">

                {/* TEXT LEFT */}
                <div ref={textRef} className="flex-1 text-center md:text-left space-y-6 max-w-2xl">
                    <h2 className={`text-lg md:text-xl font-bold tracking-widest uppercase ${slides[currentSlide].accent}`}>
                        {slides[currentSlide].subtitle}
                    </h2>
                    <h1 className={`text-5xl md:text-7xl font-serif font-black leading-tight ${slides[currentSlide].theme}`}>
                        {slides[currentSlide].title}
                    </h1>
                    <p className={`text-lg md:text-2xl font-medium opacity-90 ${slides[currentSlide].theme}`}>
                        {slides[currentSlide].desc}
                    </p>

                    <div className="pt-8">
                        <Link
                            href="/cart"
                            className="inline-flex items-center gap-3 rounded-full bg-nature-earth px-10 py-4 text-lg font-bold text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
                        >
                            Shop Now
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* HERO PRODUCT RIGHT (Constant) - REMOVED */}
                <div className="flex-1 hidden md:block" />
            </div>
        </section>
    );
}
