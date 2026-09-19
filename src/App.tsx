import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/common/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ClientDashboardPage } from './pages/ClientDashboardPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LicenseVerifierPage } from './pages/LicenseVerifierPage';
import { StaticPages } from './pages/StaticPages';

import { Product, Category } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './data/initialData';

function ProtectedRoute({
  children,
  allowedRoles,
  navigate
}: {
  children: React.ReactNode;
  allowedRoles?: Array<'super_admin' | 'admin' | 'seller' | 'client'>;
  navigate: (route: string) => void;
}) {
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    if (!user) {
      openAuthModal('login', 'Connectez-vous pour accéder à votre espace.');
      navigate('home');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      navigate(user.role === 'client' ? 'dashboard' : 'home');
    }
  }, [allowedRoles, navigate, openAuthModal, user]);

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(INITIAL_PRODUCTS[0]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  const navigate = (route: string, param?: string) => {
    if (param && route === 'applications') {
      setActiveCategoryFilter(param);
    }
    setCurrentRoute(route);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentRoute('product-detail');
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setCurrentRoute('applications');
  };

  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
            
            {/* Main Navigation Header */}
            <Header
              currentRoute={currentRoute}
              navigate={navigate}
              onSearchSubmit={handleSearchSubmit}
            />

            {/* Main Application Router */}
            <main className="flex-1">
              {currentRoute === 'home' && (
                <HomePage
                  navigate={navigate}
                  onSelectProduct={handleSelectProduct}
                />
              )}

              {currentRoute === 'applications' && (
                <MarketplacePage
                  initialCategory={activeCategoryFilter}
                  initialQuery={searchQuery}
                  navigate={navigate}
                  onSelectProduct={handleSelectProduct}
                />
              )}

              {currentRoute === 'product-detail' && (
                <ProductDetailPage
                  product={selectedProduct}
                  navigate={navigate}
                  onOpenChatWithVendor={(vendorId, vendorName, prod) => {
                    navigate('dashboard');
                  }}
                />
              )}

              {currentRoute === 'cart' && (
                <CartPage navigate={navigate} />
              )}

              {currentRoute === 'checkout' && (
                <CheckoutPage navigate={navigate} />
              )}

              {currentRoute === 'dashboard' && (
                <ProtectedRoute navigate={navigate}>
                  <ClientDashboardPage navigate={navigate} />
                </ProtectedRoute>
              )}

              {currentRoute === 'seller-dashboard' && (
                <ProtectedRoute allowedRoles={['seller', 'super_admin']} navigate={navigate}>
                  <SellerDashboardPage navigate={navigate} />
                </ProtectedRoute>
              )}

              {currentRoute === 'admin' && (
                <ProtectedRoute allowedRoles={['admin', 'super_admin']} navigate={navigate}>
                  <AdminDashboardPage navigate={navigate} />
                </ProtectedRoute>
              )}

              {currentRoute === 'license-verifier' && (
                <LicenseVerifierPage />
              )}

              {[
                'categories',
                'subscriptions',
                'sellers',
                'become-seller',
                'about',
                'contact',
                'terms',
                'privacy',
                'refund',
                'license-policy',
                'support'
              ].includes(currentRoute) && (
                <StaticPages
                  type={currentRoute as any}
                  navigate={navigate}
                  categories={categories}
                />
              )}
            </main>

            {/* Toast Notifications Overlay */}
            <ToastContainer />
            <AuthModal />

            {/* Global Footer */}
            <Footer navigate={navigate} />

          </div>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
