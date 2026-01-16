"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BACKEND_API } from '@/config';
import { X, Truck, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [trackingForm, setTrackingForm] = useState({
        courierService: '',
        trackingNumber: '',
        trackingUrl: '',
        estimatedDeliveryDate: ''
    });
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const fetchOrders = async () => {
        // ... (existing code, ensure it fetches all orders)
        try {
            const res = await fetch(`${BACKEND_API}/api/orders`, {
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

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const matchStatus = filterStatus === 'all' || order.status === filterStatus;
        const searchLower = searchQuery.toLowerCase();
        const matchSearch =
            order.id.toString().includes(searchLower) ||
            (order.user_name && order.user_name.toLowerCase().includes(searchLower)) ||
            (order.user_email && order.user_email.toLowerCase().includes(searchLower));
        return matchStatus && matchSearch;
    });

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        // ... existing
        try {
            const res = await fetch(`${BACKEND_API}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchOrders(); // Refresh
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating status');
        }
    };

    const openTrackingModal = (order: any) => {
        setSelectedOrder(order);
        setTrackingForm({
            courierService: order.courier_service || '',
            trackingNumber: order.tracking_number || '',
            trackingUrl: order.tracking_url || '',
            estimatedDeliveryDate: order.estimated_delivery_date || ''
        });
        setShowTrackingModal(true);
    };

    const handleTrackingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${BACKEND_API}/api/orders/${selectedOrder.id}/tracking`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(trackingForm)
            });

            if (res.ok) {
                setShowTrackingModal(false);
                fetchOrders();
                alert('Tracking info updated successfully!');
            } else {
                alert('Failed to update tracking info');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating tracking info');
        }
    };

    if (loading) return <div>Loading Orders...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Orders</h1>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by ID, Name, Customer Email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                    {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all whitespace-nowrap ${filterStatus === status ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100/50">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Order ID</th>
                            <th className="p-4 font-medium text-gray-500">Customer</th>
                            <th className="p-4 font-medium text-gray-500">Total</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                            <th className="p-4 font-medium text-gray-500">Tracking</th>
                            <th className="p-4 font-medium text-gray-500">Date</th>
                            <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-500">No orders found.</td></tr>
                        ) : filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50">
                                <td className="p-4 font-medium text-gray-800">#{order.id}</td>
                                <td className="p-4">
                                    <div className="font-medium text-gray-800">{order.user_name}</div>
                                    <div className="text-sm text-gray-500">{order.user_email}</div>
                                </td>
                                <td className="p-4 font-bold text-gray-800">₹{order.total_amount}</td>
                                <td className="p-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase cursor-pointer border-2 ${order.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                                            }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    {order.tracking_number ? (
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-700">{order.courier_service}</div>
                                            <div className="text-gray-500">{order.tracking_number}</div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Not added</span>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => openTrackingModal(order)}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                        >
                                            <Truck size={14} />
                                            {order.tracking_number ? 'Update' : 'Add'} Tracking
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tracking Modal */}
            {showTrackingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Add Tracking Info</h2>
                            <button onClick={() => setShowTrackingModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleTrackingSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Courier Service</label>
                                <select
                                    value={trackingForm.courierService}
                                    onChange={(e) => setTrackingForm({ ...trackingForm, courierService: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select Courier</option>
                                    <option value="DTDC">DTDC</option>
                                    <option value="India Post">India Post</option>
                                    <option value="BlueDart">BlueDart</option>
                                    <option value="Delhivery">Delhivery</option>
                                    <option value="Ecom Express">Ecom Express</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tracking Number / AWB</label>
                                <input
                                    type="text"
                                    value={trackingForm.trackingNumber}
                                    onChange={(e) => setTrackingForm({ ...trackingForm, trackingNumber: e.target.value })}
                                    required
                                    placeholder="Enter tracking number"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tracking URL (Optional)</label>
                                <input
                                    type="url"
                                    value={trackingForm.trackingUrl}
                                    onChange={(e) => setTrackingForm({ ...trackingForm, trackingUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Estimated Delivery Date</label>
                                <input
                                    type="date"
                                    value={trackingForm.estimatedDeliveryDate}
                                    onChange={(e) => setTrackingForm({ ...trackingForm, estimatedDeliveryDate: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowTrackingModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Save Tracking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
