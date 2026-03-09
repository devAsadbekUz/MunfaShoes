import { Target, Eye, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import munfaLogo from 'figma:asset/f0ebf8d20bf5f3db95d59fcf13eeddad0ba11daa.png';
import teamPhoto from 'figma:asset/100dd77cdd787542e890347715e0b23874011579.png';

export function AboutPage() {
  const { t } = useTranslation();

  const stats = [
    { number: '5+', label: t('about.stat_years', 'Yillik tajriba') },
    { number: t('about.stat_uzbekistan', "O'zbekiston"), label: t('about.stat_clients', "bo'ylab mijozlar") },
    { number: '50+', label: t('about.stat_products', 'Mahsulot turlari') }
  ];

  return (
    <div>
      {/* Header */}
      <section className="relative text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578988247876-ce2647da8195?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWN0b3J5JTIwdGVhbSUyMHdvcmtlcnN8ZW58MXx8fHwxNzYxODk0NTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5A7E]/60 to-[#FF7E9E]/60"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl mb-6">{t('about.hero_title', 'Kompaniya haqida')}</h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('about.hero_subtitle', 'Munfa - Sifatli va zamonaviy poyabzallar ishlab chiqaruvchi yetakchi kompaniya')}
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl mb-6">{t('about.history_title', 'Bizning tariximiz')}</h2>
              <p className="text-gray-600 mb-4">
                {t('about.history_p1', "Munfa Shoes 2019-yilda tashkil etilgan bo'lib, bugungi kunda barcha uchun zamonaviy va sifatli poyabzallar ishlab chiqarishga ixtisoslashgan.")}
              </p>
              <p className="text-gray-600 mb-4">
                {t('about.history_p2', "Brendning asosiy maqsadi — har bir mijozning tabiati, didi va faolligiga mos, chiroyli va qulay oyoq kiyimlarni bozorga tadbiq qilishdir. Munfa Shoes o'z mahsulotlarida Xitoy darajasidagi sifatni va O'zbekiston dizayn uslubini uyg'unlashtiradi.")}
              </p>
              <p className="text-gray-600">
                {t('about.history_p3', "Bugun biz barqaror ishlab chiqarish jarayoni, e'tiborli ustalar va sifatli materiallarga tayanib, har bir mahsulotimizni mehr bilan tayyorlaymiz. Har bir juft Munfa poyabzali — bu nafaqat uslub, balki ishonchli qadamlardir.")}
              </p>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-12">
              <img
                src={munfaLogo}
                alt="Munfa Kids Logo"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl text-[#FF5A7E] mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-[#FF5A7E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-[#FF5A7E]" size={32} />
              </div>
              <h3 className="text-2xl mb-4">{t('about.mission_title', 'Maqsadimiz')}</h3>
              <p className="text-gray-600">
                {t('about.mission_desc', 'Har bir mijozga sifatli, qulay va zamonaviy poyabzallarni taqdim etish, mahalliy ishlab chiqarishni rivojlantirish.')}
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-[#FF5A7E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="text-[#FF5A7E]" size={32} />
              </div>
              <h3 className="text-2xl mb-4">{t('about.vision_title', 'Qarashimiz')}</h3>
              <p className="text-gray-600">
                {t('about.vision_desc', "O'rta Osiyodagi poyabzallar bo'yicha eng yaxshi va ishonchli brend bo'lish, xalqaro bozorlarga chiqish.")}
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-[#FF5A7E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-[#FF5A7E]" size={32} />
              </div>
              <h3 className="text-2xl mb-4">{t('about.values_title', 'Qadriyatlarimiz')}</h3>
              <p className="text-gray-600">
                {t('about.values_desc', "Sifat, halollik, innovatsiya va mijozlarga e'tibor - bizning asosiy qadriyatlarimiz.")}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">{t('about.team_title', 'Bizning jamoamiz')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.team_subtitle', "Munfa kompaniyasida 40 dan ortiq malakali mutaxassis ishlaydi")}
            </p>
          </div>

          <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
            <img
              src={teamPhoto}
              alt="Munfa jamoasi"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl mb-2">{t('about.team_banner_title', "Tajribali va g'ayratli jamoa")}</h3>
              <p className="text-lg">
                {t('about.team_banner_desc', "Har bir xodimimiz o'z ishida professional va kompaniyamizning muvaffaqiyatiga hissa qo'shadi")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
