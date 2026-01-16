"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { BACKEND_API, RAZORPAY_KEY_ID } from '@/config';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const { user, token, isAuthenticated } = useAuth();
    const { items: cartItems, cartTotal, clearCart, coupon } = useCart();

    const [paymentMethod, setPaymentMethod] = useState('online');
    const [loading, setLoading] = useState(false);
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
        if (cartItems.length === 0) {
            router.push('/cart');
        }

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, [isAuthenticated, cartItems, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
    };

    const handleRazorpayPayment = async (orderData: any) => {
        try {
            // Create Razorpay order
            const response = await fetch(`${BACKEND_API}/api/payment/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ amount: cartTotal })
            });

            const razorpayOrder = await response.json();

            const options = {
                key: RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'Gramaharvest',
                description: 'Order Payment',
                order_id: razorpayOrder.id,
                handler: async function (response: any) {
                    // Verify payment
                    const verifyRes = await fetch(`${BACKEND_API}/api/payment/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        // Create order in database with paid status
                        await createOrder(orderData.addressId, 'paid', verifyData.paymentId);
                    } else {
                        alert('Payment verification failed');
                        setLoading(false);
                    }
                },
                prefill: {
                    name: addressForm.fullName,
                    email: user?.email,
                    contact: addressForm.phone
                },
                theme: {
                    color: '#01BF64'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                alert('Payment failed: ' + response.error.description);
                setLoading(false);
            });
            rzp.open();
        } catch (error) {
            console.error(error);
            alert('Error initiating payment');
            setLoading(false);
        }
    };

    const createOrder = async (addressId: number, paymentStatus: string, paymentId?: string) => {
        try {
            const orderItems = cartItems.map(item => ({
                product_id: parseInt(item.id),
                quantity: item.quantity,
                price: item.price
            }));

            const orderRes = await fetch(`${BACKEND_API}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderItems,
                    addressId,
                    totalAmount: cartTotal,
                    paymentStatus,
                    paymentId,
                    couponCode: coupon?.code
                })
            });

            if (orderRes.ok) {
                clearCart();
                alert('Order placed successfully!');
                router.push('/profile/orders');
            } else {
                alert('Failed to create order');
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert('Error creating order');
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create address
            const addressRes = await fetch(`${BACKEND_API}/api/addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(addressForm)
            });

            if (!addressRes.ok) {
                alert('Failed to save address');
                setLoading(false);
                return;
            }

            const addressData = await addressRes.json();

            // Handle payment based on method
            // Handle payment (Always Online)
            await handleRazorpayPayment({ addressId: addressData.id });
        } catch (error) {
            console.error(error);
            alert('Error processing checkout');
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-nature-cream">
            <Navbar />

            <div className="container mx-auto px-4 py-32">
                <h1 className="text-4xl font-serif font-bold text-nature-earth mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
                            <h2 className="text-2xl font-bold text-nature-earth mb-4">Shipping Address</h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={addressForm.fullName}
                                    onChange={handleInputChange}
                                    required
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nature-green outline-none"
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={addressForm.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nature-green outline-none"
                                />
                            </div>

                            <input
                                type="text"
                                name="street"
                                placeholder="Street Address"
                                value={addressForm.street}
                                onChange={handleInputChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nature-green outline-none"
                            />

                            <div className="grid md:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={addressForm.city}
                                    onChange={handleInputChange}
                                    required
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nature-green outline-none"
                                />
                                <input
                                    type="text"
                                    name="state"
                                    placeholder="State"
                                    value={addressForm.state}
                                    onChange={handleInputChange}
                                    required
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nature-green outline-none"
                                />
                                <input
                                    type="text"
                                    name="zipCode"
                                    placeholder="ZIP Code"
                                    value={addressForm.zipCode}
                                    onChange={handleInputChange}
                                    required
                                    className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nature-green outline-none"
                                />
                            </div>

                            {/* Payment Method Selection */}
                            <div className="pt-6 border-t">
                                <h2 className="text-2xl font-bold text-nature-earth mb-4">Payment Method</h2>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-nature-green transition-colors">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={true}
                                            readOnly
                                            className="w-5 h-5 text-nature-green"
                                        />
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-800">Pay Online (Razorpay)</div>
                                            <div className="text-sm text-gray-500">UPI, Cards, Net Banking, Wallets</div>
                                        </div>
                                        <div className="text-green-600 font-bold">✓ Secure</div>
                                    </label>
                                    {/* COD Removed as per request */}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-nature-earth text-white py-4 rounded-lg font-bold text-lg hover:bg-nature-green transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : paymentMethod === 'online' ? 'Proceed to Payment' : 'Place Order'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-nature-earth mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{item.name} x {item.quantity}</span>
                                        <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-bold">₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-bold text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                    <span>Total</span>
                                    <span className="text-nature-earth">₹{cartTotal}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
