import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { supabase } from './lib/supabase';
import { LoginPage } from './components/admin/LoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { FloatingCallButton } from './components/FloatingCallButton';
import { Analytics } from '@vercel/analytics/react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { HelmetProvider } from 'react-helmet-async';

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
      const navHeight = 80;
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

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation currentPage={activeSection} onNavigate={scrollToSection} />
        <main className="flex-1">
          <Outlet context={{ scrollToSection }} />
        </main>
        <Footer onNavigate={scrollToSection} />
        {!isAdminRoute && <FloatingCallButton />}
        <Analytics />
      </div>
    </HelmetProvider>
  );
}
