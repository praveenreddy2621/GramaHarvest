"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stories = [
    {
        name: "Rao Ramesh",
        role: "Buffalo Farmer",
        image: "/images/farmer-1.png",
        quote: "Our buffaloes are family. We don't use hormones or injections. The milk is pure, just like nature intended.",
        location: "Guntur District"
    },
    {
        name: "Savitri Devi",
        role: "Rice Cultivator",
        image: "/images/farmer-2.png",
        quote: "We age our rice for 12 months in traditional clay silos. That's the secret to the aroma you can't find elsewhere.",
        location: "Krishna Delta"
    },
    {
        name: "Krishna Murthy",
        role: "Spice Farmer",
        image: "/images/farmer-3.png",
        quote: "Every chilli is hand-picked. We dry them on open rooftops under the hot Guntur sun for 2 weeks.",
        location: "Palnadu"
    }
];

export default function FarmerStories() {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-scroll logic
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % stories.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [isPaused]);

    const next = () => setIndex((prev) => (prev + 1) % stories.length);
    const prev = () => setIndex((prev) => (prev - 1 + stories.length) % stories.length);

    return (
        <section className="py-24 bg-nature-earth text-nature-cream relative overflow-hidden">
            {/* Parallax Background hint */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-nature-gold font-bold uppercase tracking-widest text-sm mb-2 block">Our Roots</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Stories from the Soil</h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="bg-nature-cream text-nature-earth rounded-[3rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-12"
                            >
                                <div className="w-full md:w-1/2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden relative shadow-inner">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={stories[index].image}
                                        alt={stories[index].name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="w-full md:w-1/2 space-y-6">
                                    <div className="text-6xl text-nature-gold font-serif opacity-30">"</div>
                                    <h3 className="text-2xl md:text-4xl font-serif font-medium leading-relaxed italic">
                                        {stories[index].quote}
                                    </h3>
                                    <div className="pt-6 border-t border-nature-earth/10">
                                        <h4 className="text-xl font-bold">{stories[index].name}</h4>
                                        <p className="text-nature-green font-bold text-sm uppercase tracking-wide">{stories[index].role} — {stories[index].location}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Controls */}
                        <div className="flex justify-center gap-4 mt-8">
                            <button onClick={prev} className="p-4 rounded-full border border-nature-cream/20 hover:bg-nature-gold hover:text-nature-earth transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={next} className="p-4 rounded-full border border-nature-cream/20 hover:bg-nature-gold hover:text-nature-earth transition-colors">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
