import { Instagram, Send, Phone, Mail, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import logoImage from 'figma:asset/5bccca66769f7f3963ad2d4645988beaa1bd0fd7.png';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetchSettings();
  }, []);

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

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1">
            <button onClick={() => onNavigate('home')} className="border-0 bg-transparent p-0 cursor-pointer">
              <img src={logoImage} alt="Munfa" className="h-12 mb-4" />
            </button>
            <p className="text-gray-400 text-sm">
              {t('footer.desc', "Qo'qon shahrida joylashgan sifatli poyabzallar ishlab chiqaruvchi kompaniya.")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4">{t('footer.links_title', 'Tezkor havolalar')}</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#FF5A7E] transition-colors border-0 bg-transparent p-0 text-left font-normal cursor-pointer">{t('nav.home', 'Bosh sahifa')}</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-[#FF5A7E] transition-colors border-0 bg-transparent p-0 text-left font-normal cursor-pointer">{t('nav.about', 'Kompaniya haqida')}</button></li>
              <li><button onClick={() => onNavigate('products')} className="hover:text-[#FF5A7E] transition-colors border-0 bg-transparent p-0 text-left font-normal cursor-pointer">{t('nav.products', 'Mahsulotlar')}</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-[#FF5A7E] transition-colors border-0 bg-transparent p-0 text-left font-normal cursor-pointer">{t('nav.contact', 'Aloqa')}</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4">{t('footer.contact_title', 'Aloqa')}</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-[#FF5A7E]" />
                <span>
                  {settings.address_line1 || "J2VV+RF Buvaidy"}
                  {settings.address_line2 ? `, ${settings.address_line2}` : ", Qo'qon, Farg'ona"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0 text-[#FF5A7E]" />
                <span>{settings.phone_number || "+998 97 501 77 97"}</span>
              </li>
              {settings.phone_number_2 && (
                <li className="flex items-center gap-2">
                  <Phone size={16} className="flex-shrink-0 text-[#FF5A7E]" />
                  <span>{settings.phone_number_2}</span>
                </li>
              )}
              {!settings.phone_number_2 && (
                <li className="flex items-center gap-2">
                  <Phone size={16} className="flex-shrink-0 text-[#FF5A7E]" />
                  <span>+998 97 210 33 03</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0 text-[#FF5A7E]" />
                <span>{settings.email || "munfa.shoes@gmail.com"}</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-4">{t('footer.social_title', 'Ijtimoiy tarmoqlar')}</h3>
            <div className="flex gap-3">
              <a
                href={settings.instagram_url || "https://www.instagram.com/munfa_uz/"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF5A7E] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={settings.telegram_url || "https://t.me/munfa_uz"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF5A7E] transition-colors"
                aria-label="Telegram"
              >
                <Send size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>{t('footer.copyright', '© 2025 Munfa. Barcha huquqlar himoyalangan.')}</p>
        </div>
      </div>
    </footer>
  );
}
