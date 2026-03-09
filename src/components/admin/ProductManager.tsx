import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Trash2, Upload, Edit2, X } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    title: string;
    description: string;
    image_url: string;
    category_id: string;
    categories?: { name: string };
}

export function ProductManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };

    const handleTitleChange = (val: string) => {
        setTitle(val);
        if (!editingProduct) {
            setSlug(generateSlug(val));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (showLoading = true) => {
        if (showLoading) setLoading(true);

        // Fetch Categories for the dropdown
        const { data: catData } = await supabase
            .from('categories')
            .select('id, name')
            .order('name');

        if (catData) {
            setCategories(catData);
            if (catData.length > 0 && !editingProduct) setCategoryId(catData[0].id);
        }

        // Fetch Products
        const { data: prodData, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .order('created_at', { ascending: false });

        if (!error && prodData) {
            setProducts(prodData);
        }

        if (showLoading) setLoading(false);
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !categoryId || !slug) {
            alert("Iltimos, barcha maydonlarni to'ldiring.");
            return;
        }

        setIsSubmitting(true);
        let imageUrl = editingProduct ? editingProduct.image_url : '';

        try {
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('munfa-media')
                    .upload(filePath, imageFile);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: publicUrlData } = supabase.storage
                    .from('munfa-media')
                    .getPublicUrl(filePath);

                imageUrl = publicUrlData.publicUrl;
            }

            const productData = {
                title,
                slug,
                description,
                category_id: categoryId,
                image_url: imageUrl
            };

            if (editingProduct) {
                const { error: updateError } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProduct.id);

                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('products')
                    .insert([productData]);

                if (insertError) throw insertError;
            }

            cancelEdit();
            fetchData(false);
        } catch (error: any) {
            console.error('Error saving product:', error);
            alert(`Mahsulotni saqlashda xato: ${error.message}. Ehtimol bazada 'slug' ustuni yo'q. SQL kodni run qiling.`);
        }

        setIsSubmitting(false);
    };

    const startEdit = (product: any) => {
        setEditingProduct(product);
        setTitle(product.title);
        setSlug(product.slug || generateSlug(product.title));
        setDescription(product.description);
        setCategoryId(product.category_id);
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        setTitle('');
        setSlug('');
        setDescription('');
        setImageFile(null);
        if (categories.length > 0) setCategoryId(categories[0].id);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Haqiqatan ham "${title}" mahsulotini o'chirmoqchimisiz?`)) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting product:', error);
                alert(`Mahsulotni o'chirishda xato: ${error.message}`);
            } else {
                await fetchData(false);
            }
        } catch (err: any) {
            console.error('Unexpected error:', err);
            alert("Kutilmagan xatolik yuz berdi: " + (err.message || "noma'lum xato"));
        }
    };

    return (
        <div className="space-y-8">
            {/* Product Form (Add/Edit) */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                        {editingProduct ? "Mahsulotni Tahrirlash" : "Yangi Mahsulot Qo'shish"}
                    </h2>
                    {editingProduct && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEdit}
                            className="text-gray-500"
                        >
                            <X size={16} className="mr-1" /> Bekor qilish
                        </Button>
                    )}
                </div>
                <form onSubmit={handleAddProduct} className="space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mahsulot Nomi</label>
                            <Input
                                value={title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Masalan: Qishki etik"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL uchun)</label>
                            <Input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="masalan: qishki-etik"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Turkum (Kategoriya)</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="" disabled>Kategoriyani tanlang</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mahsulot Ta'rifi (paragraf)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mahsulot haqida to'liq ma'lumot..."
                            className="flex min-h-[100px] w-full items-start rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mahsulot Rasmi</label>
                        <div className="flex flex-col gap-4">
                            {editingProduct && !imageFile && (
                                <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-md border border-dashed">
                                    <img src={editingProduct.image_url} alt="Current" className="w-16 h-16 object-cover rounded" />
                                    <span className="text-sm text-gray-500">Joriy rasm saqlanadi. O'zgartirish uchun yangisini tanlang.</span>
                                </div>
                            )}
                            <div className="flex items-center gap-4">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setImageFile(e.target.files[0]);
                                        }
                                    }}
                                    className="cursor-pointer"
                                />
                                {imageFile && <span className="text-sm text-green-600 block shrink-0">{imageFile.name} tanlandi</span>}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || categories.length === 0}
                            className="bg-[#FF5A7E] hover:bg-[#FF5A7E]/90 w-full md:w-auto px-8"
                        >
                            {isSubmitting ? (
                                <>Rasm yuklanib, saqlanmoqda...</>
                            ) : (
                                <><Upload size={18} className="mr-2" /> Mahsulotni Saqlash</>
                            )}
                        </Button>
                        {categories.length === 0 && (
                            <p className="text-sm text-red-500 mt-2">Iltimos, oldin 'Kategoriyalar' bo'limidan bitta kategoriya qo'shing.</p>
                        )}
                    </div>
                </form>
            </Card>

            {/* Products List */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Mahsulotlar Ro'yxati</h2>
                {products.length === 0 && !loading ? (
                    <p className="text-gray-500">Hozircha hech qanday mahsulot qo'shilmagan.</p>
                ) : (
                    <div className="overflow-x-auto">
                        {loading && products.length === 0 && <p className="text-gray-500 mb-4">Yuklanmoqda...</p>}
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3">Rasm</th>
                                    <th className="px-4 py-3">Nomi</th>
                                    <th className="px-4 py-3">Kategoriya</th>
                                    <th className="px-4 py-3">Tavsifi</th>
                                    <th className="px-4 py-3 text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            {product.image_url ? (
                                                <a href={product.image_url} target="_blank" rel="noopener noreferrer" className="block w-12 h-12 rounded overflow-hidden bg-gray-100 border">
                                                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                                                </a>
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center text-gray-400 text-xs text-center">Rasm yo'q</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{product.title}</td>
                                        <td className="px-4 py-3 text-gray-600 font-medium">
                                            <span className="bg-[#FF5A7E]/10 text-[#FF5A7E] px-2 py-1 rounded-full text-xs">
                                                {product.categories?.name || '---'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate" title={product.description}>
                                            {product.description}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => startEdit(product)}
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
                                                        handleDelete(product.id, product.title);
                                                    }}
                                                    title="O'chirish"
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
