import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

export function ContactPage() {
  const { t } = useTranslation();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetchSettings();

    // Pre-fill message if coming from a product page
    if (location.state && (location.state as any).productName) {
      const pName = (location.state as any).productName;
      setFormData(prev => ({
        ...prev,
        message: `${t('contact.order_prefill', "Men quyidagi mahsulotga buyurtma bermoqchiman")}: ${pName}\n\n`
      }));
    }
  }, [location]);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (data) {
      setSettings(data);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert(t('contact.alert_success', "Xabaringiz yuborildi! Tez orada siz bilan bog'lanamiz."));
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.info_address', 'Manzil'),
      details: [settings.address_line1 || "J2VV+RF Buvaidy", settings.address_line2 || "Qo'qon, Farg'ona, O'zbekiston"]
    },
    {
      icon: Phone,
      title: t('contact.info_phone', 'Telefon'),
      details: [
        settings.phone_number || '+998 97 501 77 97',
        settings.phone_number_2 || '+998 97 210 33 03'
      ].filter(Boolean)
    },
    {
      icon: Mail,
      title: t('contact.info_email', 'Email'),
      details: [settings.email || 'munfa.shoes@gmail.com']
    },
    {
      icon: Clock,
      title: t('contact.info_hours', 'Ish vaqti'),
      details: [t('contact.info_hours_desc', 'Har kuni')]
    }
  ];

  return (
    <div>
      {/* Header */}
      <section className="relative text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1451933294639-386424071eb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXdpbmclMjBtYWNoaW5lJTIwcHJvZHVjdGlvbnxlbnwxfHx8fDE3NjE5MDY3MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5A7E]/60 to-[#FF7E9E]/60"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl mb-6">{t('contact.hero_title', "Biz bilan bog'laning")}</h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('contact.hero_subtitle', "Savollaringiz bormi? Biz bilan bog'laning va biz sizga yordam beramiz")}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[#FF5A7E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="text-[#FF5A7E]" size={28} />
                </div>
                <h3 className="mb-3">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">
                    {detail}
                  </p>
                ))}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl mb-6">{t('contact.form_title', 'Xabar yuboring')}</h2>
              {location.state && (location.state as any).productName && (
                <div className="bg-[#FF5A7E]/10 border border-[#FF5A7E] rounded-lg p-3 mb-6 text-[#FF5A7E] font-medium flex items-center gap-2">
                  <Send size={18} />
                  {t('contact.inquiring_about', 'So\'rov:')} {(location.state as any).productName}
                </div>
              )}
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      {t('contact.form_name', 'Ismingiz *')}
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contact.form_name_placeholder', "To'liq ismingizni kiriting")}
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      {t('contact.form_phone', 'Telefon raqam *')}
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+998 90 123 45 67"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      {t('contact.form_message', 'Xabar *')}
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('contact.form_message_placeholder', "Xabaringizni bu yerga yozing...")}
                      required
                      className="w-full min-h-32"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#FF5A7E] hover:bg-[#FF5A7E]/90"
                    size="lg"
                  >
                    <Send className="mr-2" size={18} />
                    {t('contact.btn_send', 'Xabar yuborish')}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Map & Additional Info */}
            <div>
              <h2 className="text-3xl mb-6">{t('contact.map_title', 'Bizning joylashuvimiz')}</h2>

              {/* Map Placeholder */}
              <Card className="mb-6 overflow-hidden h-80">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <iframe
                    src="https://maps.google.com/maps?q=J2VV%2BRF+Buvaidy,+Uzbekistan&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="Munfa location"
                  ></iframe>
                </div>
              </Card>

              {/* Additional Info */}
              <Card className="p-6 bg-[#FF5A7E] text-white">
                <h3 className="text-2xl mb-4">{t('contact.factory_title', 'Zavodimizga tashrif buyuring')}</h3>
                <p className="mb-4">
                  {t('contact.factory_desc', "Biz sizni zavodimizga taklif qilamiz! Ishlab chiqarish jarayoni bilan tanishib, mahsulotlarimizni o'z ko'zingiz bilan ko'ring.")}
                </p>
                <p className="text-sm">
                  {t('contact.factory_call', 'Oldindan kelishib olish uchun telefon qiling:')} <br />
                  <span className="">+998 97 501 77 97</span>
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">{t('contact.faq_title', "Ko'p so'raladigan savollar")}</h2>
            <p className="text-gray-600">
              {t('contact.faq_subtitle', "Eng ko'p beriladigan savollarga javoblar")}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium text-lg hover:no-underline">
                  {t('contact.faq_1_q', 'Buyurtma qanday beriladi?')}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {t('contact.faq_1_a', "Buyurtma berish uchun bizga telefon orqali murojaat qiling yoki ushbu sahifadagi forma orqali xabar yuboring. Bizning menejerlarimiz siz bilan bog'lanadi.")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium text-lg hover:no-underline">
                  {t('contact.faq_2_q', 'Yetkazib berish xizmati bormi?')}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {t('contact.faq_2_a', "Ha, biz O'zbekiston bo'ylab yetkazib berish xizmatini taklif qilamiz. Yetkazib berish narxi va muddati shahar va buyurtma hajmiga bog'liq.")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium text-lg hover:no-underline">
                  {t('contact.faq_3_q', 'Ulgurji savdo mavjudmi?')}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {t('contact.faq_3_a', "Ha, biz ulgurji savdo bilan shug'ullanamiz. Katta hajmli buyurtmalar uchun maxsus narxlar taklif etamiz. Batafsil ma'lumot uchun bizga aloqaga chiqing.")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium text-lg hover:no-underline">
                  {t('contact.faq_4_q', 'Kafolat beriladimi?')}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {t('contact.faq_4_a', "Barcha mahsulotlarimiz sifat kafolatiga ega. Agar mahsulotda ishlab chiqarish nuqsoni aniqlansa, biz uni almashtirish yoki pul qaytarish xizmatini taklif qilamiz.")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
