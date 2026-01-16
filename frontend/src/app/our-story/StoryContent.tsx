"use client";
import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';

export default function StoryContent() {
    return (
        <main className="min-h-screen bg-nature-cream">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-nature-earth">
                    {/* Ideally a farm background image here */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-nature-cream to-transparent"></div>
                </div>

                <div className="relative z-10 text-center container px-4">
                    <span className="text-nature-gold font-bold tracking-[0.3em] uppercase mb-4 block animate-fade-in">Our Heritage</span>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 drop-shadow-lg">Roots & Soil</h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
                        A journey back to the village, preserving traditions one harvest at a time.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 container mx-auto px-4 max-w-5xl">
                <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-serif font-bold text-nature-earth">The Beginning</h2>
                        <div className="w-20 h-1 bg-nature-green rounded-full"></div>
                        <p className="text-lg text-nature-earth/70 leading-relaxed text-justify">
                            Gramaharvest was born out of a simple desire: to taste the food of our childhood again. Living in the city, we realized that the "Ghee" we bought lacked aroma, the "Rice" was polished beyond recognition, and the "Chillies" were more color than spice.
                        </p>
                        <p className="text-lg text-nature-earth/70 leading-relaxed text-justify">
                            We went back to our roots—to our ancestral village in Andhra Pradesh. There, we found that the old ways were still alive. Farmers still used natural manure, buffaloes still grazed freely, and grandmothers still churned curd by hand.
                        </p>
                    </div>
                    <div className="relative h-[500px] rounded-full overflow-hidden border-8 border-white shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                        <Image src="/images/logo.jpg" alt="Gramaharvest Logo" fill className="object-cover" />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl group">
                        <Image src="/images/rice-bag.png" alt="Traditional Farming" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6">
                        <h2 className="text-4xl font-serif font-bold text-nature-earth">Our Promise</h2>
                        <div className="w-20 h-1 bg-nature-gold rounded-full"></div>
                        <p className="text-lg text-nature-earth/70 leading-relaxed text-justify">
                            We don't just sell products; we deliver a piece of our heritage. Every jar of ghee is made using the laborious Bilona method. Every grain of rice is aged naturally. We ensure:
                        </p>
                        <ul className="space-y-4 pt-4">
                            {[
                                "Direct sourcing from small farmers",
                                "Fair pricing ensuring farmer prosperity",
                                "No preservatives or artificial additives",
                                "Eco-friendly, plastic-free packaging where possible"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-nature-earth font-medium">
                                    <div className="w-10 h-10 rounded-full bg-nature-green/10 flex items-center justify-center text-nature-green shrink-0">
                                        ✓
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Closing */}
            <section className="bg-nature-earth py-24 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 Q 50 0 100 100" stroke="white" strokeWidth="0.5" fill="none" />
                        <path d="M0 100 Q 50 20 100 100" stroke="white" strokeWidth="0.5" fill="none" />
                        <path d="M0 100 Q 50 40 100 100" stroke="white" strokeWidth="0.5" fill="none" />
                    </svg>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl font-serif font-bold mb-8">Join Our Family</h2>
                    <p className="max-w-2xl mx-auto text-white/70 mb-10 text-xl">
                        Experience the difference of food made with patience, love, and respect for nature.
                    </p>
                    <div className="w-32 h-32 mx-auto rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center mb-6">
                        <span className="text-4xl">🌾</span>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
