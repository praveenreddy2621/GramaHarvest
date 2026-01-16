"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Tag, Clock, FolderTree, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // If not authenticated or not admin, redirect
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (!isAdmin) {
                router.push('/');
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [isAuthenticated, isAdmin, router]);

    // Close sidebar on mobile when route changes
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    if (!isAuthenticated || !isAdmin) {
        return <div className="min-h-screen flex items-center justify-center">Loading Admin Panel...</div>;
    }

    const navLinks = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        { href: '/admin/products', label: 'Products', icon: Package },
        { href: '/admin/categories', label: 'Categories', icon: FolderTree },
        { href: '/admin/coupons', label: 'Coupons', icon: Tag },
        { href: '/admin/waitlist', label: 'Waitlist', icon: Clock },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <span className="text-xl font-bold text-nature-earth">Grama Admin</span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:static md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b hidden md:block">
                    <h1 className="text-2xl font-bold text-nature-earth">Grama Admin</h1>
                </div>

                {/* Mobile Sidebar Close Button */}
                <div className="p-4 flex justify-between items-center md:hidden bg-nature-cream">
                    <span className="font-bold text-nature-earth">Navigation</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-120px)] md:max-h-none">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                        ? 'bg-nature-green text-white shadow-md'
                                        : 'text-gray-600 hover:bg-nature-cream hover:text-nature-earth'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </nav>

                {/* User Profile Info (Bottom of Sidebar) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-nature-green text-white flex items-center justify-center font-bold text-xs">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="truncate">
                            <p className="text-xs font-bold text-gray-800 truncate">{user?.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 w-full">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
