import { useState } from 'react';
import { Menu, X, Phone, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import logoImage from 'figma:asset/5bccca66769f7f3963ad2d4645988beaa1bd0fd7.png';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('ru') ? 'uz' : 'ru';
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { id: 'home', label: t('nav.home', 'Bosh sahifa') },
    { id: 'about', label: t('nav.about', 'Kompaniya haqida') },
    { id: 'products', label: t('nav.products', 'Mahsulotlar') },
    { id: 'contact', label: t('nav.contact', 'Aloqa') },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center group"
            >
              <img src={logoImage} alt="Munfa" className="h-12 transition-transform group-hover:scale-105" />
            </button>
          </div>

          {/* Desktop Navigation Tracker */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-8 lg:gap-14 whitespace-nowrap px-4 w-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`transition-colors hover:text-[#FF5A7E] font-medium text-[15px] ${currentPage === item.id ? 'text-[#FF5A7E]' : 'text-gray-700'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Button & Mobile Menu */}
          <div className="flex items-center shrink-0 gap-4 md:gap-8">
            <div className="hidden md:flex items-center">
              <a href="tel:+998975017797">
                <Button className="bg-[#FF5A7E] hover:bg-[#FF5A7E]/90 flex items-center gap-2">
                  <Phone size={18} />
                  +998 97 501 77 97
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-3 md:gap-4 md:border-l md:border-gray-200 md:pl-8">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#FF5A7E] font-medium transition-colors"
                title="Change language"
              >
                <Globe size={18} />
                <span className="uppercase text-sm">{i18n.language.startsWith('ru') ? 'RU' : 'UZ'}</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-700 hover:text-[#FF5A7E] transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 transition-colors hover:bg-[#FF5A7E]/10 ${currentPage === item.id ? 'text-[#FF5A7E] bg-[#FF5A7E]/5' : 'text-gray-700'
                  }`}
              >
                {item.label}
              </button>
            ))}
            <div className="px-4 py-3 flex flex-col gap-3">

              <a href="tel:+998975017797">
                <Button className="bg-[#FF5A7E] hover:bg-[#FF5A7E]/90 flex items-center gap-2 w-full justify-center">
                  <Phone size={18} />
                  +998 97 501 77 97
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
