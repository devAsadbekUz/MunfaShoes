import { ViteReactSSG } from 'vite-react-ssg';
import { lazy, Suspense } from 'react';
const App = lazy(() => import("./App.tsx"));
const LandingPage = lazy(() => import("./components/LandingPage").then(module => ({ default: module.LandingPage })));
const AboutPage = lazy(() => import("./components/AboutPage").then(module => ({ default: module.AboutPage })));
const ProductsPage = lazy(() => import("./components/ProductsPage").then(module => ({ default: module.ProductsPage })));
const ContactPage = lazy(() => import("./components/ContactPage").then(module => ({ default: module.ContactPage })));
const ProductDetailPage = lazy(() => import("./components/ProductDetailPage").then(module => ({ default: module.ProductDetailPage })));
import "./index.css";
import "./i18n";
const routes = [
    {
        path: '/',
        element: <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yuklanmoqda...</div>}><App /></Suspense>,
        children: [
            { index: true, element: <LandingPage /> },
            { path: 'about', element: <AboutPage /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'products/:slug', element: <ProductDetailPage /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'admin', element: <div /> },
            { path: 'admin/*', element: <div /> },
            { path: '*', element: <LandingPage /> },
        ]
    }
];

const createRoot = ViteReactSSG(
    { routes },
    () => {
        // Custom setup if needed
    }
);

export { createRoot };
export default createRoot;
