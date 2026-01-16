"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BACKEND_API } from '@/config';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function WaitlistPage() {
    const { token } = useAuth();
    const [waitlist, setWaitlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        const fetchWaitlist = async () => {
            try {
                const res = await fetch(`${BACKEND_API}/api/products/waitlist/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setWaitlist(data);
                } else {
                    console.error('Failed to fetch waitlist');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWaitlist();
    }, [token]);

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="mb-6">
                <Link href="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-4">
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Pre-order Waitlist</h1>
                <p className="text-gray-500 mt-2">View users who have subscribed to out-of-stock or pre-order products.</p>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading waitlist...</div>
            ) : waitlist.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-lg">No one is currently on the waitlist.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Customer Email</th>
                                    <th className="px-6 py-4">Subscribed At</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {waitlist.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                            {item.image_url && (
                                                <img src={`${BACKEND_API}${item.image_url}`} alt={item.product_name} className="w-10 h-10 object-contain rounded bg-gray-100" />
                                            )}
                                            {item.product_name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{item.email}</td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Waiting
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
