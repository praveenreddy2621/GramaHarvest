"use client";
import React, { useState } from 'react';
import AuthLayout from '@/components/UI/AuthLayout';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, User, Phone } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { BACKEND_API } from '@/config';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_API}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password })
            });

            const data = await res.json();

            if (res.ok) {
                login(data);
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Something went wrong. Check server.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Join the Family"
            subtitle="Start your journey with pure, organic staples."
        >
            <form onSubmit={handleSubmit} className="space-y-5">

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                {/* Name Field */}
                <div className="space-y-1">
                    <label className="text-sm font-bold text-nature-earth ml-1">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-nature-earth/40 group-focus-within:text-nature-green transition-colors" size={20} />
                        <input
                            type="text"
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-nature-earth/10 rounded-xl focus:border-nature-green focus:outline-none transition-colors text-nature-earth placeholder:text-nature-earth/30 font-medium"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                    <label className="text-sm font-bold text-nature-earth ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-nature-earth/40 group-focus-within:text-nature-green transition-colors" size={20} />
                        <input
                            type="email"
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-nature-earth/10 rounded-xl focus:border-nature-green focus:outline-none transition-colors text-nature-earth placeholder:text-nature-earth/30 font-medium"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1">
                    <label className="text-sm font-bold text-nature-earth ml-1">Phone Number</label>
                    <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-nature-earth/40 group-focus-within:text-nature-green transition-colors" size={20} />
                        <input
                            type="tel"
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-nature-earth/10 rounded-xl focus:border-nature-green focus:outline-none transition-colors text-nature-earth placeholder:text-nature-earth/30 font-medium"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                    <label className="text-sm font-bold text-nature-earth ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-nature-earth/40 group-focus-within:text-nature-green transition-colors" size={20} />
                        <input
                            type="password"
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-nature-earth/10 rounded-xl focus:border-nature-green focus:outline-none transition-colors text-nature-earth placeholder:text-nature-earth/30 font-medium"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-nature-green text-white rounded-xl font-bold text-lg hover:bg-nature-earth transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                    {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>

                {/* Login Link */}
                <div className="text-center text-nature-earth mt-4">
                    Already a member? {' '}
                    <Link href="/login" className="font-bold text-nature-green hover:underline">
                        Sign in
                    </Link>
                </div>

            </form>
        </AuthLayout>
    );
}
