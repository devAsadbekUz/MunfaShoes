import { lazy, Suspense } from 'react';
import { HomePage } from './HomePage';

const AboutPage = lazy(() => import('./AboutPage').then(module => ({ default: module.AboutPage })));
const ProductsPage = lazy(() => import('./ProductsPage').then(module => ({ default: module.ProductsPage })));
const ContactPage = lazy(() => import('./ContactPage').then(module => ({ default: module.ContactPage })));

export function LandingPage() {
    return (
        <>
            <div id="home"><HomePage /></div>
            <Suspense fallback={<div className="h-40" />}>
                <div id="about"><AboutPage /></div>
                <div id="products"><ProductsPage /></div>
                <div id="contact"><ContactPage /></div>
            </Suspense>
        </>
    );
}
