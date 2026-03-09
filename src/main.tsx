import { ViteSSG } from 'vite-ssg';
import App from "./App.tsx";
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ProductsPage } from './components/ProductsPage';
import { ContactPage } from './components/ContactPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import "./index.css";
import "./i18n";

const routes = [
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage },
    { path: '/products', component: ProductsPage },
    { path: '/products/:slug', component: ProductDetailPage },
    { path: '/contact', component: ContactPage },
];

export const createApp = ViteSSG(
    App,
    { routes },
    () => {
        // Custom setup if needed
    }
);
