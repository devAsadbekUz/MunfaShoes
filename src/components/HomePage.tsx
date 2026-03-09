import { useState, useEffect } from 'react';
import { ArrowRight, Award, Users, Factory, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Card } from './ui/card';
import springCollection from 'figma:asset/b30f6ee2c7a1a02fb6acad59bfd7282f2be40a19.png';
import summerCollection from 'figma:asset/21b1d6cce1100780743fa6116ba46b9565d95d27.png';
import winterCollection from 'figma:asset/747bf37266ec0a2b4e1cd6609cca25d73e2c4c9a.png';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [heroBgUrl, setHeroBgUrl] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('hero_image_url')
        .eq('id', 1)
        .single();

      if (!error && data?.hero_image_url) {
        setHeroBgUrl(data.hero_image_url);
      }
    };
    fetchSettings();
  }, []);

  const features = [
    {
      icon: Award,
      title: t('home.feat_1_title', 'Yuqori sifat'),
      description: t('home.feat_1_desc', 'Xalqaro standartlarga javob beradigan sifatli mahsulotlar')
    },
    {
      icon: Factory,
      title: t('home.feat_2_title', 'Zamonaviy ishlab chiqarish'),
      description: t('home.feat_2_desc', 'Eng so\'nggi texnologiyalar bilan jihozlangan zavod')
    },
    {
      icon: Users,
      title: t('home.feat_3_title', 'Tajribali jamoa'),
      description: t('home.feat_3_desc', '5 yildan ortiq tajribaga ega mutaxassislar')
    },
    {
      icon: Sparkles,
      title: t('home.feat_4_title', 'Keng assortiment'),
      description: t('home.feat_4_desc', 'Har bir mavsum uchun yangi modellar va dizaynlar')
    }
  ];

  const productCategories = [
    {
      title: t('home.col_spring_title', "Bahorgi/Kuzgi to'plam"),
      image: springCollection,
      description: t('home.col_spring_desc', 'Yengil va rang-barang bahor modellari')
    },
    {
      title: t('home.col_summer_title', "Yozgi to'plam"),
      image: summerCollection,
      description: t('home.col_summer_desc', 'Nafas oluvchi yoz poyabzallari')
    },
    {
      title: t('home.col_winter_title', "Qishki to'plam"),
      image: winterCollection,
      description: t('home.col_winter_desc', 'Issiq va qulay qish modellari')
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image with Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: heroBgUrl ? `url(${heroBgUrl})` : 'none', backgroundColor: '#1a1a1a' }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl mb-6">
            {t('home.hero_title', 'Munfa - Sifat va Ishonch')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            {t('home.hero_subtitle', 'Yuqori sifatli va zamonaviy poyabzallar ishlab chiqaruvchisi')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#FF5A7E] hover:bg-[#FF5A7E]/90"
              onClick={() => onNavigate('products')}
            >
              {t('home.btn_products', 'Mahsulotlar bilan tanishing')}
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white border-white text-black hover:font-bold hover:bg-white"
              onClick={() => onNavigate('about')}
            >
              {t('home.btn_more', 'Batafsil')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">{t('home.features_title', 'Bizning afzalliklarimiz')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.features_subtitle', "Munfa kompaniyasi O'zbekistondagi etakchi poyabzal ishlab chiqaruvchilardan biri hisoblanadi")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#FF5A7E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-[#FF5A7E]" size={32} />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">{t('home.collections_title', "Mavsumiy to'plamlarimiz")}</h2>
            <p className="text-gray-600">
              {t('home.collections_subtitle', 'Har bir mavsum uchun maxsus poyabzallar')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productCategories.map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
                onClick={() => onNavigate('products')}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-200">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-[#FF5A7E] text-[#FF5A7E] hover:bg-[#FF5A7E] hover:text-white"
              onClick={() => onNavigate('products')}
            >
              {t('home.btn_all_products', "Barcha mahsulotlarni ko'rish")}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#FF5A7E] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-6">{t('home.cta_title', 'Ishonchli hamkor kerakmi?')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('home.cta_desc', "Biz bilan hamkorlik qilish va sifatli mahsulotlarimizdan bahramand bo'lish uchun bog'laning")}
          </p>
          <Button
            size="lg"
            className="bg-white text-[#FF5A7E] hover:bg-gray-100"
            onClick={() => onNavigate('contact')}
          >
            {t('home.btn_contact', "Biz bilan bog'lanish")}
          </Button>
        </div>
      </section>
    </div>
  );
}
