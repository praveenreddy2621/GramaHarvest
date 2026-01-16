"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User, Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { cartCount } = useCart();
    const { isAuthenticated } = useAuth(); // Get Auth State
    const pathname = usePathname();

    // ... (rest of state logic)

    // Check if we are on the homepage
    const isHome = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ...

    // Helper class for text color based on state
    // Home + Top = White Text (for dark hero)
    // Home + Scrolled or Other Page = Earth Text
    const textColorClass = (isHome && !scrolled && !isOpen) ? "text-white hover:text-nature-gold" : "text-nature-earth hover:text-nature-green";
    const iconColorClass = (isHome && !scrolled && !isOpen) ? "text-white" : "text-nature-earth";

    // Background logic
    // Home + Top = Transparent
    // Home + Scrolled = Cream
    // Other Pages = Cream (always readable)
    const navBgClass = (isHome && !scrolled) ? "bg-transparent" : "bg-nature-cream/95 backdrop-blur-md shadow-sm";

    return (
        <nav className={`fixed w-full z-[100] transition-all duration-300 ${navBgClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            {/* Logo Image */}
                            <div className={`relative h-12 w-12 rounded-full overflow-hidden border-2 transition-colors ${isHome && !scrolled ? 'border-white/50' : 'border-nature-gold'}`}>
                                <Image src="/images/logo.jpg" alt="Grama Harvest" fill className="object-cover" />
                            </div>
                            <span className={`font-serif text-xl sm:text-2xl font-bold tracking-wide transition-colors ${isHome && !scrolled && !isOpen ? 'text-white' : 'text-nature-green'}`}>
                                Grama Harvest
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-12">
                            {['Home', 'Products', 'Our Story', 'Contact'].map((item) => (
                                <Link
                                    key={item}
                                    href={item === 'Home' ? '/' : item === 'Products' ? '/harvest' : item === 'Our Story' ? '/our-story' : '/contact'}
                                    className={`${textColorClass} text-lg font-serif italic tracking-wide transition-colors relative group`}
                                >
                                    {item}
                                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full ${isHome && !scrolled ? 'bg-white' : 'bg-nature-gold'}`}></span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated && (
                            <NotificationDropdown textColorClass={textColorClass} />
                        )}
                        <Link href={isAuthenticated ? "/profile" : "/login"} className={`relative group transition-colors ${textColorClass}`}>
                            <User size={24} />
                        </Link>
                        <Link href="/cart" className={`relative group transition-colors ${textColorClass}`}>
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-nature-green text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/contact" className={`px-6 py-2 rounded-full transition-colors ${isHome && !scrolled ? 'bg-white text-nature-earth hover:bg-nature-gold' : 'bg-nature-green text-white hover:bg-nature-earth'}`}>
                            Order Now
                        </Link>
                    </div>

                    <div className="md:hidden flex items-center gap-2 sm:gap-4">
                        {isAuthenticated && (
                            <NotificationDropdown textColorClass={iconColorClass} />
                        )}
                        <Link href={isAuthenticated ? "/profile" : "/login"} className={`relative transition-colors ${iconColorClass} p-1`}>
                            <User className="h-6 w-6" />
                        </Link>
                        <Link href="/cart" className={`relative transition-colors ${iconColorClass} p-1`}>
                            <ShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-nature-green text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`transition-colors ${iconColorClass} p-1`}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-nature-cream absolute w-full shadow-lg border-t border-nature-earth/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {['Home', 'Products', 'Our Story', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'Home' ? '/' : item === 'Products' ? '/harvest' : item === 'Our Story' ? '/our-story' : '/contact'}
                                className="text-nature-earth hover:text-nature-green block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
