import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { ProductsPage } from './components/ProductsPage';
import { ContactPage } from './components/ContactPage';
import { supabase } from './lib/supabase';
import { LoginPage } from './components/admin/LoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { FloatingCallButton } from './components/FloatingCallButton';
import { Analytics } from '@vercel/analytics/react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ProductDetailPage } from './components/ProductDetailPage';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [session, setSession] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'about', 'products', 'contact'];

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // height of the sticky navigation
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  if (isAdminRoute) {
    if (!session) {
      return <LoginPage onLoginSuccess={() => navigate('/admin')} />;
    }
    return (
      <AdminLayout onLogout={() => navigate('/admin')}>
        <div />
      </AdminLayout>
    );
  }

  const LandingPage = () => (
    <>
      <div id="home"><HomePage onNavigate={scrollToSection} /></div>
      <div id="about"><AboutPage /></div>
      <div id="products"><ProductsPage onNavigate={scrollToSection} /></div>
      <div id="contact"><ContactPage /></div>
    </>
  );

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation currentPage={activeSection} onNavigate={scrollToSection} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage onNavigate={scrollToSection} />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Catch-all or other routes can be added here */}
          </Routes>
        </main>
        <Footer onNavigate={scrollToSection} />
        {!isAdminRoute && <FloatingCallButton />}
        <Analytics />
      </div>
    </HelmetProvider>
  );
}
