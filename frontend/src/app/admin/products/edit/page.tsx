"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BACKEND_API } from '@/config';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function EditProductPage() {
    const { token } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [imagePreview, setImagePreview] = useState('');
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        stock: '',
        isPreorder: false
    });

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`${BACKEND_API}/api/products/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setForm({
                    name: data.name,
                    description: data.description,
                    price: data.price.toString(),
                    category: data.category,
                    imageUrl: data.image_url || '',
                    stock: data.stock.toString(),
                    isPreorder: data.is_preorder || false
                });
                if (data.image_url) {
                    setImagePreview(`${BACKEND_API}${data.image_url}`);
                }
            }
        } catch (err) {
            console.error(err);
            alert('Error fetching product');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setForm({ ...form, [name]: val });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`${BACKEND_API}/api/products/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setForm({ ...form, imageUrl: data.imageUrl });
            } else {
                alert('Failed to upload image');
                setImagePreview('');
            }
        } catch (err) {
            console.error(err);
            alert('Error uploading image');
            setImagePreview('');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${BACKEND_API}/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                router.push('/admin/products');
            } else {
                alert('Failed to update product');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating product');
        } finally {
            setLoading(false);
        }
    };

    const removeImage = () => {
        setImagePreview('');
        setForm({ ...form, imageUrl: '' });
    };

    if (fetching) {
        return <div className="text-center py-20">Loading product...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-4">
                    <ArrowLeft size={16} />
                    Back to Products
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>

                    {imagePreview ? (
                        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                            <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-nature-green transition-colors bg-gray-50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-12 h-12 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP (MAX. 5MB)</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                        </label>
                    )}

                    {uploading && (
                        <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-nature-green outline-none"
                        placeholder="e.g. Buffalo Ghee 500ml"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-nature-green outline-none"
                        placeholder="Product details..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-nature-green outline-none"
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-nature-green outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-nature-green outline-none"
                    >
                        <option value="">Select Category</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Grains">Grains</option>
                        <option value="Spices">Spices</option>
                        <option value="Pickles">Pickles</option>
                        <option value="Oils">Oils</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <input
                        type="checkbox"
                        id="isPreorder"
                        name="isPreorder"
                        checked={form.isPreorder}
                        onChange={handleChange}
                        className="w-5 h-5 text-nature-green rounded focus:ring-nature-green border-gray-300"
                    />
                    <div>
                        <label htmlFor="isPreorder" className="font-bold text-gray-800 cursor-pointer select-none">Mark as Pre-order / Coming Soon</label>
                        <p className="text-xs text-gray-500">Customers can subscribe to waitlist instead of adding to cart.</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full bg-nature-green text-white py-3 rounded-lg font-bold hover:bg-nature-earth transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    <Save size={20} />
                    {loading ? 'Updating...' : 'Update Product'}
                </button>

            </form>
        </div>
    );
}
