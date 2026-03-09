import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ArrowLeft, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Skeleton } from './ui/skeleton';
import { motion } from 'framer-motion';

export function ProductDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [product, setProduct] = useState<any>(null);
    const [telegramUrl, setTelegramUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // 1. Fetch Product
            const { data: prodData, error: prodError } = await supabase
                .from('products')
                .select('*, categories(name, slug)')
                .eq('slug', slug)
                .single();

            if (prodError) {
                console.error('Error fetching product:', prodError);
                navigate('/products');
                return;
            } else {
                setProduct(prodData);
            }

            // 2. Fetch Settings for Telegram URL
            const { data: settingsData } = await supabase
                .from('site_settings')
                .select('telegram_url')
                .eq('id', 1)
                .single();

            if (settingsData?.telegram_url) {
                setTelegramUrl(settingsData.telegram_url);
            }

            setLoading(false);
        };

        if (slug) fetchData();
    }, [slug, navigate]);

    const handleOrder = () => {
        if (!product) return;

        const message = encodeURIComponent(`Assalomu alaykum! Men "${product.title}" mahsulotini buyurtma qilmoqchi edim.`);
        let tMeUrl = telegramUrl || 'https://t.me/MunfaShoes';

        // Ensure it starts with https://t.me/
        if (!tMeUrl.startsWith('http')) {
            // If it's just a username like @MunfaShoes or MunfaShoes
            const username = tMeUrl.replace('@', '');
            tMeUrl = `https://t.me/${username}`;
        }

        window.open(`${tMeUrl}?text=${message}`, '_blank');
    };

    if (loading) {
        return (
            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <Skeleton className="aspect-square w-full rounded-xl" />
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-10 w-3/4" />
                            <Skeleton className="h-32 w-full" />
                            <div className="pt-10">
                                <Skeleton className="h-12 w-40" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (!product) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="py-20 bg-gray-50"
        >
            <Helmet>
                <title>{`${product.title} | Munfa Shoes`}</title>
                <meta name="description" content={product.description} />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button
                        variant="ghost"
                        className="mb-8 hover:text-[#FF5A7E]"
                        onClick={() => navigate('/products')}
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        {t('products.back_to_catalog', 'Katalogga qaytish')}
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="overflow-hidden bg-white shadow-lg border-none">
                            <div className="aspect-square relative flex items-center justify-center p-4">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.title}
                                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="text-gray-400">{t('products.no_image')}</div>
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col"
                    >
                        <Badge className="w-fit mb-4 bg-[#FF5A7E] hover:bg-[#FF5A7E]">
                            {product.categories?.name}
                        </Badge>
                        <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.title}</h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="mt-auto space-y-6" id="product-actions-container">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    size="lg"
                                    className="bg-[#FF5A7E] hover:bg-[#FF5A7E]/90 w-full md:w-auto px-12 shadow-md"
                                    onClick={handleOrder}
                                >
                                    <Send className="mr-2" size={18} />
                                    {t('products.btn_order', 'Buyurtma berish')}
                                </Button>
                            </motion.div>

                            <div className="pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    {t('products.tag_label', 'Kategoriya')}: <span className="font-medium text-gray-700">{product.categories?.name}</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
