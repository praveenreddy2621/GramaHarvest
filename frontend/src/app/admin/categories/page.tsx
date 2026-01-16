"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { BACKEND_API } from '@/config';

interface Category {
    id: number;
    name: string;
    description: string;
}

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [form, setForm] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${BACKEND_API}/api/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const url = editingCategory
                ? `${BACKEND_API}/api/categories/${editingCategory.id}`
                : `${BACKEND_API}/api/categories`;

            const res = await fetch(url, {
                method: editingCategory ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                alert(editingCategory ? 'Category updated!' : 'Category created!');
                setShowModal(false);
                setForm({ name: '', description: '' });
                setEditingCategory(null);
                fetchCategories();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to save category');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving category');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`${BACKEND_API}/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                alert('Category deleted!');
                fetchCategories();
            } else {
                alert('Failed to delete category');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting category');
        }
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setForm({
            name: category.name,
            description: category.description || ''
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setForm({ name: '', description: '' });
        setShowModal(true);
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-nature-earth">Categories</h1>
                <button
                    onClick={openCreateModal}
                    className="bg-nature-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-nature-earth transition-colors flex items-center gap-2"
                >
                    <Plus size={20} /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-xl font-bold text-nature-earth mb-2">{category.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{category.description || 'No description'}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => openEditModal(category)}
                                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit size={16} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-2xl font-bold text-nature-earth mb-6">
                            {editingCategory ? 'Edit Category' : 'Add Category'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-nature-green outline-none"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-nature-green outline-none"
                                    rows={3}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-nature-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-nature-earth transition-colors"
                                >
                                    {editingCategory ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
