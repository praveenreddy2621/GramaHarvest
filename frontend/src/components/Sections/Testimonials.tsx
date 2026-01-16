"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Star } from "lucide-react";

// --- DATA ---
const reviews = [
    {
        name: "Lakshmi Narayana",
        location: "Hyderabad",
        product: "Pure Buffalo Ghee",
        text: "The Bilona Ghee brings back memories of my grandmother's cooking. The aroma is distinct and pure.",
        rating: 5,
        date: "09/17/2025"
    },
    {
        name: "Rajesh Kumar",
        location: "Vijayawada",
        product: "Guntur Chilli",
        text: "Best chillies I've found. The heat is perfect for my curries. Fast delivery and eco-friendly packaging.",
        rating: 5,
        date: "04/05/2025"
    },
    {
        name: "Sarah Jenkins",
        location: "Bangalore",
        product: "Sona Masoori Rice",
        text: "I was skeptical about ordering rice online, but this is perfectly aged. Fluffy and aromatic every time.",
        rating: 5,
        date: "03/25/2025"
    },
    {
        name: "Priya Reddy",
        location: "Chennai",
        product: "Turmeric Powder",
        text: "Very potent turmeric. You only need a pinch. Highly recommend for its medicinal value.",
        rating: 5,
        date: "02/10/2025"
    }
];

const galleryImages = [
    {
        src: "https://images.unsplash.com/photo-1541600383005-565c949cf777?q=80&w=600&auto=format&fit=crop",
        alt: "Grazing Buffaloes"
    },
    {
        src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop",
        alt: "Green Fields"
    },
    {
        src: "https://images.unsplash.com/photo-1627920769841-628d0524cb5e?q=80&w=600&auto=format&fit=crop",
        alt: "Harvest Season"
    },
    {
        src: "https://images.unsplash.com/photo-1595909200427-0238d3878b27?q=80&w=600&auto=format&fit=crop",
        alt: "Village Morning"
    },
    {
        src: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=600&auto=format&fit=crop",
        alt: "Pure Nature"
    }
];

export default function Testimonials() {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(scrollRef.current, {
                xPercent: -50,
                ease: "none",
                duration: 50, // Slower for elegance
                repeat: -1,
            });
        }, scrollRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="py-8 md:py-24 bg-nature-cream relative overflow-hidden">
            {/* Background & Patterns */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none"></div>

            {/* PART 1: REVIEWS (Gavyamart Style - Trusted Voices) */}
            <div className="container mx-auto px-4 mb-8 md:mb-24 relative z-10">
                <div className="text-center mb-8">
                    <span className="text-nature-green font-bold uppercase tracking-wider text-[10px] md:text-sm">Community Love</span>
                    <h2 className="text-2xl md:text-5xl font-serif font-bold text-nature-earth mt-1">Trusted by Families</h2>
                    <p className="text-nature-earth/60 mt-3 max-w-xl mx-auto text-xs md:text-base px-4">See what our customers are saying about our authentic products.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {reviews.map((r, i) => (
                        <div key={i} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-nature-earth/5 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full">
                            <div className="flex gap-0.5 mb-3 text-nature-gold">
                                {[...Array(5)].map((_, s) => <Star key={s} size={12} fill="currentColor" />)}
                            </div>
                            <h4 className="font-bold text-[11px] md:text-lg text-nature-earth mb-2 flex-grow leading-tight">"{r.text}"</h4>

                            <div className="pt-3 border-t border-gray-100/50 mt-auto">
                                <p className="text-[8px] md:text-xs font-bold text-nature-green uppercase mb-1">{r.product}</p>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end text-[8px] md:text-xs text-nature-earth/40 font-medium">
                                    <span>{r.name.split(' ')[0]}</span>
                                    <span className="hidden sm:inline">{r.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PART 2: GALLERY (Farm Life Marquee) */}
            <div className="relative z-10 border-t border-nature-earth/5 pt-8 md:pt-20">
                <div className="container mx-auto px-4 mb-6 md:mb-10 text-center">
                    <span className="text-nature-green font-bold uppercase tracking-widest text-[10px] md:text-sm mb-1 block">Our Heritage</span>
                    <h2 className="text-xl md:text-4xl font-serif font-bold text-nature-earth mb-2">Life at Gramaharvest</h2>
                </div>

                {/* Marquee Container */}
                <div className="overflow-hidden w-full flex" onMouseEnter={() => gsap.globalTimeline.timeScale(0.5)} onMouseLeave={() => gsap.globalTimeline.timeScale(1)}>
                    <div ref={scrollRef} className="flex gap-3 md:gap-6 px-4 w-max">
                        {/* Triple the array for seamless loop on wide screens */}
                        {[...galleryImages, ...galleryImages, ...galleryImages].map((img, i) => (
                            <div key={i} className="w-[140px] h-[180px] md:w-[350px] md:h-[450px] relative rounded-xl md:rounded-3xl overflow-hidden shadow-md group cursor-pointer border-2 md:border-4 border-white">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 md:p-8">
                                    <p className="text-white font-bold text-xs md:text-lg font-serif">{img.alt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
