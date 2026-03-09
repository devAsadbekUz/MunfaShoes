import { ViteReactSSG } from 'vite-react-ssg';
import App from "./App.tsx";
import { LandingPage } from './components/LandingPage';
import { AboutPage } from './components/AboutPage';
import { ProductsPage } from './components/ProductsPage';
import { ContactPage } from './components/ContactPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import "./index.css";
import "./i18n";
import { useNavigate } from 'react-router-dom';

const ProductsPageWrapper = () => {
    const navigate = useNavigate();
    return <ProductsPage onNavigate={(path) => navigate('/' + path)} />;
};

const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: 'about', element: <AboutPage /> },
            { path: 'products', element: <ProductsPageWrapper /> },
            { path: 'products/:slug', element: <ProductDetailPage /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'admin', element: <div /> },
            { path: 'admin/*', element: <div /> },
            { path: '*', element: <LandingPage /> },
        ]
    }
];

export const createApp = ViteReactSSG(
    { routes },
    ({ router }) => {
        // Custom setup if needed
    }
);
