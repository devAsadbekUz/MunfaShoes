import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Trash2, Edit2, Check, X } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
}

export function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
        } else {
            setCategories(data || []);
        }
        if (showLoading) setLoading(false);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsAdding(true);
        const slug = generateSlug(newCategoryName);

        const { error } = await supabase
            .from('categories')
            .insert([{ name: newCategoryName, slug }]);

        if (error) {
            console.error('Error adding category:', error);
            alert('Kategoriya qoshishda xatolik yuz berdi. Balki bu nom/slug allaqachon mavjuddir.');
        } else {
            setNewCategoryName('');
            fetchCategories(false);
        }
        setIsAdding(false);
    };

    const handleUpdateCategory = async (id: string) => {
        if (!editingName.trim()) return;

        setIsUpdating(true);
        const slug = generateSlug(editingName);

        const { error } = await supabase
            .from('categories')
            .update({ name: editingName, slug })
            .eq('id', id);

        if (error) {
            console.error('Error updating category:', error);
            alert(`Kategoriyani yangilashda xato: ${error.message}`);
        } else {
            setEditingId(null);
            fetchCategories(false);
        }
        setIsUpdating(false);
    };

    const startEditing = (category: Category) => {
        setEditingId(category.id);
        setEditingName(category.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingName('');
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Haqiqatan ham "${name}" kategoriyasini o'chirmoqchimisiz? Diqqat: Ushbu kategoriyaga tegishli BARCHA mahsulotlar ham o'chib ketadi!`)) return;

        try {
            // 1. Delete associated products first
            const { error: productsError } = await supabase
                .from('products')
                .delete()
                .eq('category_id', id);

            if (productsError) {
                console.error('Error deleting products:', productsError);
                alert(`Mahsulotlarni o'chirishda xato: ${productsError.message}`);
                return;
            }

            // 2. Delete the category itself
            const { error: categoryError } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (categoryError) {
                console.error('Error deleting category:', categoryError);
                alert(`Kategoriyani o'chirishda xato: ${categoryError.message}`);
            } else {
                await fetchCategories(false);
            }
        } catch (err: any) {
            console.error('Unexpected error:', err);
            alert("Kutilmagan xatolik yuz berdi: " + (err.message || "noma'lum xato"));
        }
    };

    return (
        <div className="space-y-8">
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Yangi Kategoriya Qo'shish</h2>
                <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kategoriya Nomi (Masalan: Qishki to'plam)
                        </label>
                        <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Kategoriya nomini kiriting"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isAdding || !newCategoryName.trim()}
                        className="bg-[#FF5A7E] hover:bg-[#FF5A7E]/90"
                    >
                        {isAdding ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                    </Button>
                </form>
            </Card>

            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Mavjud Kategoriyalar</h2>
                {categories.length === 0 && !loading ? (
                    <p className="text-gray-500">Hozircha hech qanday kategoriya yo'q.</p>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {loading && categories.length === 0 && <p className="text-gray-500 py-4">Yuklanmoqda...</p>}
                        {categories.map((category) => (
                            <div key={category.id} className="py-4 flex justify-between items-center">
                                {editingId === category.id ? (
                                    <div className="flex-1 flex gap-2 items-center">
                                        <Input
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            className="max-w-xs"
                                            autoFocus
                                        />
                                        <Button
                                            size="icon"
                                            className="bg-green-500 hover:bg-green-600 h-9 w-9"
                                            onClick={() => handleUpdateCategory(category.id)}
                                            disabled={isUpdating || !editingName.trim()}
                                        >
                                            <Check size={18} />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-9 w-9 text-gray-500"
                                            onClick={cancelEditing}
                                            disabled={isUpdating}
                                        >
                                            <X size={18} />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{category.name}</h3>
                                            <p className="text-sm text-gray-400">slug: {category.slug}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => startEditing(category)}
                                                title="Tahrirlash"
                                            >
                                                <Edit2 size={18} />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDelete(category.id, category.name);
                                                }}
                                                title="O'chirish"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
