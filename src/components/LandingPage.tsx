import { lazy, Suspense } from 'react';
import { HomePage } from './HomePage';
import { useOutletContext } from 'react-router-dom';

const AboutPage = lazy(() => import('./AboutPage').then(module => ({ default: module.AboutPage })));
const ProductsPage = lazy(() => import('./ProductsPage').then(module => ({ default: module.ProductsPage })));
const ContactPage = lazy(() => import('./ContactPage').then(module => ({ default: module.ContactPage })));

export function LandingPage() {
    const { scrollToSection } = useOutletContext<{ scrollToSection: (id: string) => void }>();

    return (
        <>
            <div id="home"><HomePage onNavigate={scrollToSection} /></div>
            <Suspense fallback={<div className="h-40" />}>
                <div id="about"><AboutPage /></div>
                <div id="products"><ProductsPage onNavigate={scrollToSection} /></div>
                <div id="contact"><ContactPage /></div>
            </Suspense>
        </>
    );
}
