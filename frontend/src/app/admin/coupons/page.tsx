"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BACKEND_API } from '@/config';
import { Plus, Edit, Trash2, X, Tag } from 'lucide-react';

export default function AdminCouponsPage() {
    const { token } = useAuth();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<any>(null);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        usageLimit: '',
        validUntil: '',
        userType: 'all',
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, [token]);

    const fetchCoupons = async () => {
        try {
            const res = await fetch(`${BACKEND_API}/api/coupons`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (coupon: any = null) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                code: coupon.code,
                description: coupon.description || '',
                discountType: coupon.discount_type,
                discountValue: coupon.discount_value,
                minOrderAmount: coupon.min_order_amount || '',
                maxDiscountAmount: coupon.max_discount_amount || '',
                usageLimit: coupon.usage_limit || '',
                validUntil: coupon.valid_until ? coupon.valid_until.split('T')[0] : '',
                userType: coupon.user_type || 'all',
                isActive: coupon.is_active
            });
        } else {
            setEditingCoupon(null);
            setFormData({
                code: '',
                description: '',
                discountType: 'percentage',
                discountValue: '',
                minOrderAmount: '',
                maxDiscountAmount: '',
                usageLimit: '',
                validUntil: '',
                userType: 'all',
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            code: formData.code.toUpperCase(),
            description: formData.description,
            discountType: formData.discountType,
            discountValue: parseFloat(formData.discountValue),
            minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
            maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
            usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
            validUntil: formData.validUntil || null,
            userType: formData.userType,
            isActive: formData.isActive
        };

        try {
            const url = editingCoupon
                ? `${BACKEND_API}/api/coupons/${editingCoupon.id}`
                : `${BACKEND_API}/api/coupons`;

            const res = await fetch(url, {
                method: editingCoupon ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowModal(false);
                fetchCoupons();
                alert(editingCoupon ? 'Coupon updated!' : 'Coupon created!');
            } else {
                const data = await res.json();
                alert(data.message || 'Error saving coupon');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving coupon');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const res = await fetch(`${BACKEND_API}/api/coupons/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                fetchCoupons();
                alert('Coupon deleted successfully');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting coupon');
        }
    };

    if (loading) return <div>Loading Coupons...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Coupons</h1>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus size={20} /> Add Coupon
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100/50">
                        <tr>
                            <th className="p-4 font-medium text-gray-500">Code</th>
                            <th className="p-4 font-medium text-gray-500">Description</th>
                            <th className="p-4 font-medium text-gray-500">Discount</th>
                            <th className="p-4 font-medium text-gray-500">Min Order</th>
                            <th className="p-4 font-medium text-gray-500">Usage</th>
                            <th className="p-4 font-medium text-gray-500">Valid Until</th>
                            <th className="p-4 font-medium text-gray-500">Status</th>
                            <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-gray-50/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Tag size={16} className="text-green-600" />
                                        <span className="font-bold text-gray-800">{coupon.code}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{coupon.description}</td>
                                <td className="p-4">
                                    <span className="font-bold text-green-600">
                                        {coupon.discount_type === 'percentage'
                                            ? `${coupon.discount_value}%`
                                            : `₹${coupon.discount_value}`}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">₹{coupon.min_order_amount}</td>
                                <td className="p-4 text-sm text-gray-600">
                                    {coupon.used_count} / {coupon.usage_limit || '∞'}
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {coupon.valid_until
                                        ? new Date(coupon.valid_until).toLocaleDateString()
                                        : 'No expiry'}
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${coupon.is_active
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {coupon.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            onClick={() => openModal(coupon)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Coupon Code *</label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        required
                                        placeholder="WELCOME15"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none uppercase"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Discount Type *</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Special discount for new users"
                                    rows={2}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                        required
                                        placeholder={formData.discountType === 'percentage' ? '15' : '100'}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Min Order Amount (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                        placeholder="500"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">
                                        Max Discount (₹) {formData.discountType === 'percentage' && '- Optional'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.maxDiscountAmount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                                        placeholder="200"
                                        disabled={formData.discountType === 'fixed'}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Usage Limit</label>
                                    <input
                                        type="number"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                        placeholder="Leave empty for unlimited"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Valid Until</label>
                                    <input
                                        type="date"
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">User Type *</label>
                                    <select
                                        value={formData.userType}
                                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                                    >
                                        <option value="all">All Users</option>
                                        <option value="first_time">First-Time Users Only</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                    />
                                    <span className="text-sm font-bold text-gray-700">Active</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
