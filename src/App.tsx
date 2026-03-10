import { useState, useEffect, Suspense } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { supabase } from './lib/supabase';
import { LoginPage } from './components/admin/LoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { FloatingCallButton } from './components/FloatingCallButton';
import { Analytics } from '@vercel/analytics/react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from './components/ui/skeleton';

export default function App() {
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
        <Navigation />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={
                <div className="container mx-auto px-4 py-20 space-y-8">
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-64 w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                  </div>
                </div>
              }>
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        {!isAdminRoute && <FloatingCallButton />}
        <Analytics />
      </div>
    </HelmetProvider>
  );
}
