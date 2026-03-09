import { HomePage } from './HomePage';
import { AboutPage } from './AboutPage';
import { ProductsPage } from './ProductsPage';
import { ContactPage } from './ContactPage';
import { useOutletContext } from 'react-router-dom';

export function LandingPage() {
    const { scrollToSection } = useOutletContext<{ scrollToSection: (id: string) => void }>();

    return (
        <>
            <div id="home"><HomePage onNavigate={scrollToSection} /></div>
            <div id="about"><AboutPage /></div>
            <div id="products"><ProductsPage onNavigate={scrollToSection} /></div>
            <div id="contact"><ContactPage /></div>
        </>
    );
}
