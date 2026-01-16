"use client";
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Tag, Clock, FolderTree } from 'lucide-react';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If not authenticated or not admin, redirect
        // We use a small timeout to allow context to load from localstorage
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (!isAdmin) {
                router.push('/');
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [isAuthenticated, isAdmin, router]);

    if (!isAuthenticated || !isAdmin) {
        return <div className="min-h-screen flex items-center justify-center">Loading Admin Panel...</div>;
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex-shrink-0 hidden md:block">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-nature-earth">Grama Admin</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-nature-cream rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-nature-cream rounded-lg transition-colors">
                        <ShoppingBag size={20} />
                        Orders
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-nature-cream rounded-lg transition-colors">
                        <Package size={20} />
                        Products
                    </Link>
                    <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-nature-cream rounded-lg transition-colors">
                        <FolderTree size={20} />
                        Categories
                    </Link>
                    <Link href="/admin/coupons" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-nature-cream rounded-lg transition-colors">
                        <Tag size={20} />
                        Coupons
                    </Link>
                    <Link href="/admin/waitlist" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-nature-cream rounded-lg transition-colors">
                        <Clock size={20} />
                        Waitlist
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-10">
                        <LogOut size={20} />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
