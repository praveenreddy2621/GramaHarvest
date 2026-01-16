"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BACKEND_API } from '@/config';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, MapPin, Phone, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminOrderDetailsPage() {
    const { id } = useParams();
    const { token } = useAuth();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${BACKEND_API}/api/orders/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [token, id]);

    if (loading) return <div>Loading Order Details...</div>;
    if (!order) return <div>Order not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors">
                <ArrowLeft size={20} />
                Back to Orders
            </button>

            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        Order #{order.id}
                        <span className={`text-sm px-3 py-1 rounded-full uppercase tracking-wide ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                            }`}>
                            {order.status}
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-2">Placed on {new Date(order.created_at).toLocaleString()}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                        <MapPin size={20} className="text-gray-400" />
                        Shipping To / Parcel Address
                    </h2>
                    <div className="space-y-3 text-gray-700">
                        {order.shipping_name ? (
                            <>
                                <p className="font-bold text-xl">{order.shipping_name}</p>
                                <p>{order.street}</p>
                                <p>{order.city}, {order.state} {order.zip_code}</p>
                                <p className="font-bold text-gray-500 uppercase text-xs tracking-wider">{order.country || 'India'}</p>
                                <div className="pt-4 flex items-center gap-2 text-gray-600">
                                    <Phone size={16} />
                                    <span>{order.phone}</span>
                                </div>
                            </>
                        ) : (
                            <p className="text-red-500">No Address Linked (Data Issue)</p>
                        )}
                        <p className="text-sm text-gray-400 pt-2 border-t mt-4">User Email: {order.user_email}</p>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                        <Package size={20} className="text-gray-400" />
                        Order Items
                    </h2>
                    <div className="space-y-4">
                        {order.items && order.items.map((item: any) => (
                            <div key={item.id} className="flex gap-4 items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    {item.image_url && <Image src={`${BACKEND_API}${item.image_url}`} alt={item.product_name} fill className="object-cover" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{item.product_name}</p>
                                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                </div>
                                <div className="font-bold text-gray-800">₹{item.price * item.quantity}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-600">Total Amount</span>
                        <span className="text-2xl font-bold text-nature-green">₹{order.total_amount}</span>
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <CreditCard size={20} className="text-gray-400" />
                    Payment Info
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-500 text-sm block">Payment Method</span>
                        <span className="font-medium capitalize">{order.payment_method}</span>
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm block">Payment Status</span>
                        <span className={`font-bold capitalize ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {order.payment_status}
                        </span>
                    </div>
                    {order.payment_id && (
                        <div className="col-span-2">
                            <span className="text-gray-500 text-sm block">Transaction ID</span>
                            <span className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">{order.payment_id}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
