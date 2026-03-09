import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ArrowLeft, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function ProductDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(name, slug)')
                .eq('slug', slug)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
                navigate('/products');
            } else {
                setProduct(data);
            }
            setLoading(false);
        };

        if (slug) fetchProduct();
    }, [slug, navigate]);

    if (loading) return <div className="py-20 text-center">{t('common.loading', 'Yuklanmoqda...')}</div>;
    if (!product) return null;

    return (
        <div className="py-20 bg-gray-50">
            <Helmet>
                <title>{`${product.title} | Munfa Shoes`}</title>
                <meta name="description" content={product.description} />
            </Helmet>

            <div className="container mx-auto px-4">
                <Button
                    variant="ghost"
                    className="mb-8 hover:text-[#FF5A7E]"
                    onClick={() => navigate('/products')}
                >
                    <ArrowLeft className="mr-2" size={20} />
                    {t('products.back_to_catalog', 'Katalogga qaytish')}
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <Card className="overflow-hidden bg-white">
                        <div className="aspect-square relative flex items-center justify-center p-4">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.title}
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-gray-400">{t('products.no_image')}</div>
                            )}
                        </div>
                    </Card>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <Badge className="w-fit mb-4 bg-[#FF5A7E]">
                            {product.categories?.name}
                        </Badge>
                        <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="mt-auto space-y-6">
                            <Button
                                size="lg"
                                className="bg-[#FF5A7E] hover:bg-[#FF5A7E]/90 w-full md:w-auto px-12"
                                onClick={() => navigate('/contact', { state: { productName: product.title } })}
                            >
                                <Send className="mr-2" size={18} />
                                {t('products.btn_order', 'Buyurtma berish')}
                            </Button>

                            <div className="pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    {t('products.tag_label', 'Kategoriya')}: {product.categories?.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
