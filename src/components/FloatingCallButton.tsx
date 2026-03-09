import { Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './FloatingCallButton.css';

export function FloatingCallButton() {
  const { t } = useTranslation();

  return (
    <a
      href="tel:+998975017797"
      className="fab-container md:hidden hover:opacity-90 transition-opacity"
      aria-label={t('nav.contact', 'Aloqa')}
    >
      <div className="fab-button animate-floating">
        <Phone size={24} color="white" />
      </div>
    </a>
  );
}
