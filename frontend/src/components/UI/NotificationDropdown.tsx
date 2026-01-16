"use client";
import React, { useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Bell, X, Check } from 'lucide-react';
import Link from 'next/link';

export default function NotificationDropdown({ textColorClass }: { textColorClass: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead } = useNotifications();

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative group transition-colors ${textColorClass} p-1`}
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    {/* Notification Box */}
                    <div className="fixed sm:absolute top-24 sm:top-full left-4 right-4 sm:left-auto sm:-right-4 sm:w-80 mt-2 bg-white rounded-3xl shadow-2xl z-50 border border-nature-earth/10 overflow-hidden transform-gpu animate-in fade-in zoom-in duration-200">
                        {/* Pointer Triangle (Desktop only) */}
                        <div className="hidden sm:block absolute top-0 right-7 -mt-2 w-4 h-4 bg-white border-t border-l border-nature-earth/10 rotate-45 z-50"></div>

                        <div className="relative p-5 border-b border-nature-earth/10 flex justify-between items-center bg-nature-cream/30">
                            <h3 className="font-serif font-bold text-nature-earth text-lg">Notifications</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-nature-earth/10 rounded-full transition-colors"
                            >
                                <X size={20} className="text-nature-earth/50 hover:text-nature-earth" />
                            </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-zinc-400 italic">
                                    No notifications yet
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-4 border-b border-nature-earth/5 hover:bg-nature-cream/20 transition-colors relative ${n.status === 'unread' ? 'bg-nature-gold/5' : ''}`}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <h4 className={`text-sm font-bold ${n.status === 'unread' ? 'text-nature-green' : 'text-nature-earth'}`}>
                                                    {n.title}
                                                </h4>
                                                <p className="text-xs text-nature-earth/70 mt-1 line-clamp-2">
                                                    {n.message}
                                                </p>
                                                <span className="text-[10px] text-zinc-400 mt-2 inline-block">
                                                    {new Date(n.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {n.status === 'unread' && (
                                                <button
                                                    onClick={() => markAsRead(n.id)}
                                                    className="p-1 bg-white border border-nature-earth/10 rounded-full text-nature-green hover:bg-nature-green hover:text-white transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <Check size={12} />
                                                </button>
                                            )}
                                        </div>
                                        {n.link && (
                                            <Link
                                                href={n.link}
                                                onClick={() => setIsOpen(false)}
                                                className="absolute inset-0 z-0 pointer-events-auto"
                                            ></Link>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <div className="p-2 text-center bg-nature-cream/10 border-t border-nature-earth/10">
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs font-bold text-nature-green hover:underline"
                                >
                                    View all activity
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
