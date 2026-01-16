"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Minus, Plus, Trash2, ArrowRight, Tag, X } from 'lucide-react';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import { BACKEND_API } from '@/config';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
    const { token } = useAuth();
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState('');
    const [loadingCoupon, setLoadingCoupon] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        setLoadingCoupon(true);
        setCouponError('');

        try {
            const res = await fetch(`${BACKEND_API}/api/coupons/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    code: couponCode,
                    orderAmount: cartTotal
                })
            });

            const data = await res.json();

            if (res.ok && data.valid) {
                setAppliedCoupon(data.coupon);
                setCouponError('');
            } else {
                setCouponError(data.message || 'Invalid coupon code');
                setAppliedCoupon(null);
            }
        } catch (err) {
            setCouponError('Error applying coupon');
            setAppliedCoupon(null);
        } finally {
            setLoadingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    const finalTotal = appliedCoupon ? appliedCoupon.finalAmount : cartTotal;
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;

    return (
        <main className="min-h-screen bg-nature-cream">
            <Navbar />

            <section className="pt-32 pb-24 container mx-auto px-4">
                <h1 className="text-4xl font-serif font-bold text-nature-earth mb-8 text-center">Your Harvest Basket</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <div className="w-48 h-48 bg-nature-cream/50 rounded-full mx-auto flex items-center justify-center mb-6">
                            <div className="text-6xl">🧺</div>
                        </div>
                        <h2 className="text-2xl font-bold text-nature-earth mb-4">Your basket is empty</h2>
                        <p className="text-zinc-500 mb-8">Looks like you haven't added any traditional goodness yet.</p>
                        <Link href="/harvest" className="inline-flex items-center gap-2 bg-nature-green text-white px-8 py-3 rounded-full hover:bg-nature-earth transition-all shadow-lg font-semibold">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12">

                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex gap-6 items-center">
                                    <div className="w-24 h-24 relative bg-stone-100 rounded-xl overflow-hidden shrink-0">
                                        <Image
                                            src={item.image || "/images/logo.jpg"}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-serif font-bold text-nature-earth">{item.name}</h3>
                                        <p className="text-sm text-zinc-500 mb-2">{item.unit}</p>
                                        <div className="text-lg font-bold text-nature-green">₹{item.price * item.quantity}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 bg-stone-100 rounded-full p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-nature-cream transition-colors"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-nature-cream transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors p-2"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
                                <h2 className="text-2xl font-bold text-nature-earth">Order Summary</h2>

                                {/* Coupon Section */}
                                <div className="border-t border-b border-gray-200 py-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Tag size={18} className="text-green-600" />
                                        <h3 className="font-bold text-gray-800">Have a Coupon?</h3>
                                    </div>

                                    {!appliedCoupon ? (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    placeholder="Enter code"
                                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none uppercase"
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={loadingCoupon}
                                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                                                >
                                                    {loadingCoupon ? 'Checking...' : 'Apply'}
                                                </button>
                                            </div>
                                            {couponError && (
                                                <p className="text-sm text-red-600">{couponError}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-green-700">{appliedCoupon.code}</span>
                                                        <span className="text-sm text-green-600">Applied!</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-1">{appliedCoupon.description}</p>
                                                </div>
                                                <button
                                                    onClick={handleRemoveCoupon}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">₹{cartTotal}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount ({appliedCoupon.code})</span>
                                            <span className="font-semibold">- ₹{discount}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="font-semibold text-green-600">FREE</span>
                                    </div>

                                    <div className="border-t pt-3 flex justify-between text-xl font-bold text-nature-earth">
                                        <span>Total</span>
                                        <span>₹{finalTotal}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="text-sm text-green-600 text-center">
                                            You saved ₹{discount}! 🎉
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full bg-nature-earth text-white py-4 rounded-lg font-bold text-lg hover:bg-nature-green transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    Proceed to Checkout
                                    <ArrowRight size={20} />
                                </Link>

                                <button
                                    onClick={clearCart}
                                    className="w-full text-red-600 hover:text-red-700 transition-colors text-sm font-medium"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
