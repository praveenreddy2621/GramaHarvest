"use client";
import React from 'react';
import { Facebook, Twitter, Instagram, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative bg-[#f4e4bc] text-[#5c4033] pt-24 pb-12 overflow-hidden"
            style={{
                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' // Fallback to "handwritten-ish" fonts if custom not avail 
            }}
        >
            {/* Sketchy Border Top using SVG */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-[40px] w-full fill-[#faf3e0]">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
                </svg>
            </div>

            {/* Background Texture - Sketch Paper */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/notebook-dark.png')` }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 text-center md:text-left">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <h2 className="text-4xl font-serif font-bold tracking-tighter" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
                            Gramaharvest
                        </h2>
                        <p className="text-lg leading-relaxed opacity-80" style={{ fontStyle: 'italic' }}>
                            "Sown with love, harvested with pride."<br />
                            We are simple farmers bringing you the best.
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 border-2 border-[#5c4033] rounded-full flex items-center justify-center hover:bg-[#5c4033] hover:text-[#f4e4bc] transition-colors shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 uppercase tracking-widest border-b-2 border-[#5c4033] inline-block pb-1">Shop</h3>
                        <ul className="space-y-3 text-lg">
                            <li><Link href="/harvest?category=Dairy" className="hover:underline decoration-wavy decoration-nature-green">Buffalo Ghee</Link></li>
                            <li><Link href="/harvest?category=Grains" className="hover:underline decoration-wavy decoration-nature-green">Aged Rice</Link></li>
                            <li><Link href="/harvest?category=Spices" className="hover:underline decoration-wavy decoration-nature-green">Spices</Link></li>
                            <li><Link href="/harvest?category=Pickles" className="hover:underline decoration-wavy decoration-nature-green">Pickles</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 uppercase tracking-widest border-b-2 border-[#5c4033] inline-block pb-1">Farm Info</h3>
                        <ul className="space-y-3 text-lg">
                            <li><Link href="/our-story" className="hover:underline decoration-wavy decoration-nature-green">Our Story</Link></li>
                            <li><Link href="/our-story" className="hover:underline decoration-wavy decoration-nature-green">Visit the Farm</Link></li>
                            <li><Link href="/contact" className="hover:underline decoration-wavy decoration-nature-green">Wholesale</Link></li>
                            <li><Link href="/contact" className="hover:underline decoration-wavy decoration-nature-green">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact - Sketchy Box */}
                    <div className="relative p-6 border-2 border-dashed border-[#5c4033] rounded-xl bg-[#fffef0]/50 rotate-1 transform hover:rotate-0 transition-transform">
                        <h3 className="text-xl font-bold mb-4">Visit Us</h3>
                        <p className="mb-4 text-base">
                            Gramaharvest Farm,<br />
                            Gampalagudem,<br />
                            NTR District, 521403
                        </p>
                        <p className="font-bold text-lg">+91 9492704264</p>
                        <p className="text-sm mt-2 text-[#5c4033]/80">support@gramaharvest.shop</p>

                        {/* Decorative Pin */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-800 shadow-md"></div>
                    </div>

                </div>

                <div className="mt-20 pt-8 border-t-2 border-[#5c4033]/20 flex flex-col md:flex-row justify-between items-center opacity-80 text-sm gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <p>© 2026 Gramaharvest.</p>
                        <div className="flex flex-wrap justify-center gap-4 font-medium">
                            <Link href="/privacy-policy" className="hover:underline hover:text-[#5c4033]">Privacy Policy</Link>
                            <Link href="/terms" className="hover:underline hover:text-[#5c4033]">Terms & Conditions</Link>
                            <Link href="/refund-policy" className="hover:underline hover:text-[#5c4033]">Refund Policy</Link>
                            <Link href="/shipping-policy" className="hover:underline hover:text-[#5c4033]">Shipping Policy</Link>
                        </div>
                    </div>
                    <p>Made with Nature.</p>
                </div>
            </div>

            <button
                onClick={scrollToTop}
                className="absolute bottom-10 right-10 w-12 h-12 border-2 border-[#5c4033] rounded-full flex items-center justify-center bg-[#f4e4bc] hover:bg-[#5c4033] hover:text-[#f4e4bc] transition-colors shadow-lg"
            >
                <ArrowUp size={20} />
            </button>
        </motion.footer>
    );
}
