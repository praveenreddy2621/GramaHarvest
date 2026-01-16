"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif font-bold text-nature-earth">My Profile</h1>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-1">Full Name</label>
                        <p className="text-lg font-medium text-nature-earth">{user?.name}</p>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-1">Email Address</label>
                        <p className="text-lg font-medium text-nature-earth">{user?.email}</p>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-1">Account Role</label>
                        <span className="inline-block px-3 py-1 bg-nature-cream text-nature-earth text-sm font-bold rounded-full capitalize">
                            {user?.role}
                        </span>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-zinc-400 font-bold mb-1">Member Since</label>
                        <p className="text-lg font-medium text-nature-earth">January 2026</p>
                    </div>
                </div>
            </div>

            {/* Future: Address Book Preview */}
        </div>
    );
}
