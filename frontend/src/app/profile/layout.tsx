"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { User, Package, LogOut, MapPin, ChevronRight, Home } from 'lucide-react';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                router.push('/login');
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null; // Or a loading spinner

    const menuItems = [
        { name: 'My Profile', icon: <User size={18} />, href: '/profile' },
        { name: 'My Orders', icon: <Package size={18} />, href: '/profile/orders' },
        // Future: { name: 'Addresses', icon: <MapPin size={18} />, href: '/profile/addresses' },
    ];

    return (
        <div className="min-h-screen bg-nature-cream flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 pt-32">
                <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">

                    {/* SIDEBAR NAVIGATION */}
                    <aside className="w-full md:w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden sticky top-32">
                            {/* User Header */}
                            <div className="p-6 bg-nature-earth text-white">
                                <h2 className="text-xl font-serif font-bold">Hello, {user?.name}</h2>
                                <p className="text-white/60 text-sm">{user?.email}</p>
                            </div>

                            {/* Navigation Links */}
                            <nav className="p-2">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all mb-1
                                                ${isActive
                                                    ? 'bg-nature-cream text-nature-earth font-bold'
                                                    : 'text-zinc-600 hover:bg-stone-50 hover:text-nature-earth'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {item.icon}
                                                <span>{item.name}</span>
                                            </div>
                                            {isActive && <ChevronRight size={16} />}
                                        </Link>
                                    );
                                })}

                                <div className="h-px bg-zinc-100 my-2 mx-2"></div>

                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left"
                                >
                                    <LogOut size={18} />
                                    <span>Sign Out</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1">
                        {children}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
