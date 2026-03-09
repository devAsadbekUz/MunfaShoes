import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import springProduct1 from 'figma:asset/49efa0a760b211066c5d3b55ab5623c4bdc68546.png';

interface ProductsPageProps {
  onNavigate: (page: string) => void;
}

export function ProductsPage({ onNavigate }: ProductsPageProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [categories, setCategories] = useState<{ id: string; label: string }[]>([
    { id: 'all', label: t('products.filter_all', 'Barchasi') }
  ]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      // Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (catError) {
        console.error('Error fetching categories:', catError);
      } else if (catData) {
        const mappedCategories = catData.map((c: any) => ({
          id: c.slug,
          label: c.name
        }));
        setCategories([{ id: 'all', label: t('products.filter_all', 'Barchasi') }, ...mappedCategories]);
      }

      // Fetch Products
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*, categories(slug)')
        .order('created_at', { ascending: false });

      if (prodError) {
        console.error('Error fetching products:', prodError);
      } else if (prodData) {
        setProducts(prodData.map((p: any) => ({
          ...p,
          categorySlug: p.categories?.slug || 'all'
        })));
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.categorySlug === selectedCategory);


  return (
    <div>
      {/* Header */}
      <section className="relative text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${springProduct1})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5A7E]/60 to-[#FF7E9E]/60"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl mb-6">{t('products.hero_title', "Mavsumiy to'plamlar")}</h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('products.hero_subtitle', "Barcha uchun har bir mavsum uchun maxsus ishlab chiqarilgan sifatli poyabzallar")}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={selectedCategory === category.id ? "bg-[#FF5A7E] hover:bg-[#FF5A7E]/90" : "hover:border-[#FF5A7E] hover:text-[#FF5A7E]"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link to={`/products/${product.slug}`} key={product.id}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow h-full cursor-pointer">
                  <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-gray-400">{t('products.no_image', "Rasm yo'q")}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2 bg-[#FF5A7E]">
                      {categories.find(c => c.id === product.categorySlug)?.label || t('products.filter_all', 'Barchasi')}
                    </Badge>
                    <h3 className="text-xl mb-2 font-medium">{product.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{product.description}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-6">{t('products.cta_title', 'Buyurtma bermoqchimisiz?')}</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('products.cta_desc', "Bizning mahsulotlarimiz haqida batafsil ma'lumot olish va buyurtma berish uchun biz bilan bog'laning")}
          </p>
          <Button
            size="lg"
            className="bg-[#FF5A7E] hover:bg-[#FF5A7E]/90"
            onClick={() => onNavigate('contact')}
          >
            {t('products.btn_contact', "Bog'lanish")}
          </Button>
        </div>
      </section>
    </div>
  );
}
