import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { GatewayView } from './components/GatewayView';
import { BuyerPortal } from './components/BuyerPortal';
import { SellerPortal } from './components/SellerPortal';
import { AdminPortal } from './components/AdminPortal';
import { CampusGigsSection } from './components/CampusGigsSection';
import { CartDrawer } from './components/CartDrawer';
import { SimulatedSMSModal } from './components/SimulatedSMSModal';
import { ProductChatModal } from './components/ProductChatModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { UserLoginModal } from './components/UserLoginModal';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activePortal, isAdminAuthenticated, setActivePortal } = useApp();
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setActivePortal('admin');
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar */}
      <Navbar 
        onOpenAdminAuth={handleOpenAdmin} 
        onOpenLogin={() => setIsLoginOpen(true)} 
      />

      {/* Main Portal View */}
      <main className="flex-1">
        {activePortal === 'gateway' && (
          <GatewayView 
            onOpenAdminAuth={handleOpenAdmin} 
            onOpenLogin={() => setIsLoginOpen(true)} 
          />
        )}

        {activePortal === 'buyer' && <BuyerPortal />}

        {activePortal === 'seller' && <SellerPortal />}

        {activePortal === 'admin' && (
          isAdminAuthenticated ? (
            <AdminPortal />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Admin Authentication Required
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Please enter the security password to manage platform orders, stock inventory, and delivery controls.
              </p>
              <button
                onClick={() => setIsAdminAuthOpen(true)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Enter Admin Security PIN
              </button>
            </div>
          )
        )}

        {activePortal === 'gigs' && <CampusGigsSection />}
      </main>

      {/* Modals & Slide-out Drawers */}
      <CartDrawer />
      <SimulatedSMSModal />
      <ProductChatModal />
      <AdminAuthModal 
        isOpen={isAdminAuthOpen} 
        onClose={() => setIsAdminAuthOpen(false)} 
      />
      <UserLoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />

      {/* Footer with Gigs Hyperlink Corner Banner */}
      <Footer onOpenAdminAuth={handleOpenAdmin} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
