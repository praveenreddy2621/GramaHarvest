"use client";
import React, { useState, Suspense } from 'react';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import { BACKEND_API } from '@/config';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError('Reset token is missing');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${BACKEND_API}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-nature-earth mb-2">Password Reset Successful!</h1>
                <p className="text-gray-500 mb-6">Your password has been changed. You will be redirected to the login page shortly.</p>
                <Link href="/login" className="bg-nature-earth text-white px-8 py-3 rounded-xl font-bold hover:bg-nature-green transition-all inline-block">
                    Go to Login Now
                </Link>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                    <AlertCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-nature-earth mb-2">Invalid Reset Link</h1>
                <p className="text-gray-500 mb-6">This password reset link is invalid or has expired.</p>
                <Link href="/forgot-password" className="text-nature-earth font-bold hover:underline">
                    Request a new link
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-nature-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="text-nature-green" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-nature-earth">Create New Password</h1>
                <p className="text-gray-500 mt-2">Enter your new secure password below.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center mb-4">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-nature-green outline-none transition-all"
                    placeholder="Min. 6 characters"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-nature-green outline-none transition-all"
                    placeholder="Confirm password"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-nature-earth text-white py-4 rounded-xl font-bold hover:bg-nature-green transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
                {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-nature-cream flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 pt-32 pb-20">
                <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
                    <Suspense fallback={<div className="text-center">Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
            <Footer />
        </main>
    );
}
