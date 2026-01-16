"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BACKEND_API } from '@/config';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProductsPage() {
    const { token } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);

    useEffect(() => {
        fetchProducts();
    }, [token]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${BACKEND_API}/api/products`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        setDeleting(id);
        try {
            const res = await fetch(`${BACKEND_API}/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert('Failed to delete product');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting product');
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return <div>Loading Products...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                <Link href="/admin/products/add" className="bg-nature-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-nature-earth transition-colors">
                    <Plus size={20} />
                    Add Product
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100/50">
                        <tr>
                            <th className="p-4 font-medium text-gray-500 w-16">Image</th>
                            <th className="p-4 font-medium text-gray-500">Name</th>
                            <th className="p-4 font-medium text-gray-500">Category</th>
                            <th className="p-4 font-medium text-gray-500">Price</th>
                            <th className="p-4 font-medium text-gray-500">Stock</th>
                            <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50/50">
                                <td className="p-4">
                                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                                        <Image
                                            src={product.image_url ? `${BACKEND_API}${product.image_url}` : '/images/logo.jpg'}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-800">
                                    {product.name}
                                    {product.is_preorder && (
                                        <span className="ml-2 px-2 py-0.5 text-[10px] bg-yellow-100 text-yellow-800 rounded-full uppercase font-bold tracking-wide border border-yellow-200">
                                            Pre-order
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-gray-600">
                                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full">{product.category}</span>
                                </td>
                                <td className="p-4 font-bold text-gray-800">₹{product.price}</td>
                                <td className="p-4 text-gray-600">{product.stock}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/admin/products/edit?id=${product.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Product"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            disabled={deleting === product.id}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No products found.</div>
                )}
            </div>
        </div>
    );
}
