"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BACKEND_API } from '@/config';
import Link from 'next/link';

export default function MyOrdersPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${BACKEND_API}/api/orders/myorders`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchOrders();
    }, [token]);

    if (loading) return <div>Loading your harvest history...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif font-bold text-nature-earth">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-dashed border-zinc-300 text-center">
                    <div className="text-4xl mb-4">🌾</div>
                    <h3 className="text-xl font-bold text-nature-earth mb-2">No past orders found</h3>
                    <p className="text-zinc-500 mb-6">Start your healthy journey today.</p>
                    <Link href="/harvest" className="inline-block bg-nature-green text-white px-6 py-2 rounded-full font-bold hover:bg-nature-earth transition-colors">
                        Browse Shop
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-nature-cream/30 p-4 border-b border-stone-100 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex gap-8">
                                    <div>
                                        <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Order Placed</div>
                                        <div className="text-sm font-medium text-nature-earth">{new Date(order.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Total</div>
                                        <div className="text-sm font-medium text-nature-earth">₹{order.total_amount}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Order ID</div>
                                        <div className="text-sm font-medium text-nature-earth">#{order.id}</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-right text-zinc-500 uppercase font-bold tracking-wider mb-1">Status</div>
                                    <span className={`inline-block px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wide
                                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                {/* Tracking Info */}
                                {order.tracking_number && (
                                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-blue-900">📦 Tracking Information</h4>
                                            {order.tracking_url && (
                                                <a
                                                    href={order.tracking_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline font-medium"
                                                >
                                                    Track Package →
                                                </a>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-blue-700 font-medium">Courier:</span>
                                                <span className="ml-2 text-blue-900">{order.courier_service}</span>
                                            </div>
                                            <div>
                                                <span className="text-blue-700 font-medium">Tracking #:</span>
                                                <span className="ml-2 text-blue-900 font-mono">{order.tracking_number}</span>
                                            </div>
                                            {order.estimated_delivery_date && (
                                                <div className="col-span-2">
                                                    <span className="text-blue-700 font-medium">Est. Delivery:</span>
                                                    <span className="ml-2 text-blue-900">{new Date(order.estimated_delivery_date).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {order.items && order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {/* In a real app we'd fetch product details/image by ID here or include in join query */}
                                                <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center text-2xl">
                                                    📦
                                                </div>
                                                <div>
                                                    <div className="font-bold text-nature-earth">Product ID: {item.product_id}</div>
                                                    <div className="text-sm text-zinc-500">Qty: {item.quantity} × ₹{item.price}</div>
                                                </div>
                                            </div>
                                            <div className="font-bold text-nature-earth">₹{item.quantity * item.price}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
