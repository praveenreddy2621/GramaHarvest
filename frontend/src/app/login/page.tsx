"use client";
import React, { useState } from 'react';
import AuthLayout from '@/components/UI/AuthLayout';
import Link from 'next/link';
import { ArrowRight, Mail, Lock } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { BACKEND_API } from '@/config';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_API}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                login(data);
            } else {
                setError(data.message || 'Login failed');
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
            title="Welcome Back"
            subtitle="Sign in to access your harvest."
        >
            <form onSubmit={handleSubmit} className="space-y-6">

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
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

                {/* Password Field */}
                <div className="space-y-2">
                    <div className="flex justify-between ml-1">
                        <label className="text-sm font-bold text-nature-earth">Password</label>
                        <Link href="/forgot-password" className="text-xs font-bold text-nature-green hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-nature-earth/40 group-focus-within:text-nature-green transition-colors" size={20} />
                        <input
                            type="password"
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-nature-earth/10 rounded-xl focus:border-nature-green focus:outline-none transition-colors text-nature-earth placeholder:text-nature-earth/30 font-medium"
                            placeholder="••••••••"
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
                    className="w-full py-4 bg-nature-green text-white rounded-xl font-bold text-lg hover:bg-nature-earth transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                    {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>

                {/* Divider */}
                <div className="relative flex items-center gap-4 py-4">
                    <div className="h-px bg-nature-earth/10 flex-grow"></div>
                    <span className="text-xs text-nature-earth/40 font-bold uppercase tracking-wider">Or</span>
                    <div className="h-px bg-nature-earth/10 flex-grow"></div>
                </div>

                {/* Signup Link */}
                <div className="text-center text-nature-earth">
                    Don't have an account? {' '}
                    <Link href="/signup" className="font-bold text-nature-green hover:underline">
                        Create one now
                    </Link>
                </div>

            </form>
        </AuthLayout>
    );
}
