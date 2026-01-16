"use client";
import React, { useState } from 'react';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import { BACKEND_API } from '@/config';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch(`${BACKEND_API}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-nature-cream flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 pt-32 pb-20">
                <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-nature-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="text-nature-green" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-nature-earth">Forgot Password?</h1>
                        <p className="text-gray-500 mt-2">No worries! Enter your email and we'll send you a reset link.</p>
                    </div>

                    {message ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center mb-6">
                            {message}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center mb-4">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-nature-green outline-none transition-all"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-nature-earth text-white py-4 rounded-xl font-bold hover:bg-nature-green transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                            >
                                {loading ? 'Sending Link...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <Link href="/login" className="text-nature-earth font-bold hover:text-nature-green flex items-center justify-center gap-2">
                            <ArrowLeft size={18} />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
