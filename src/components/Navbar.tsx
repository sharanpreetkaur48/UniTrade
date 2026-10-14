import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  MessageSquare, 
  ShieldCheck, 
  User, 
  LogOut, 
  Sparkles, 
  Store, 
  Compass,
  ArrowRightLeft,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  onOpenAdminAuth: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdminAuth, onOpenLogin }) => {
  const { 
    activePortal, 
    setActivePortal, 
    cart, 
    setIsCartOpen, 
    smsNotifications, 
    setIsSmsModalOpen, 
    currentUser, 
    logoutUser,
    isAdminAuthenticated,
    universityInfo
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadSmsCount = smsNotifications.filter(s => !s.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 md:gap-8">
        
        {/* Zone 1: PitchVerse Wordmark & Single University Indicator */}
        <button
          onClick={() => setActivePortal('gateway')}
          className="flex items-center gap-2.5 group text-left cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
            U
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                UniTrade
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Punjab University
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
              Panjab University (PU) Campus Resale Hub
            </p>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean text with hover underlines) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActivePortal('gateway')}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              activePortal === 'gateway' ? 'text-violet-600 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Portal Hub
          </button>
          
          <button
            onClick={() => setActivePortal('buyer')}
            className={`whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              activePortal === 'buyer' ? 'text-violet-600 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Buyer Marketplace</span>
          </button>

          <button
            onClick={() => setActivePortal('seller')}
            className={`whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              activePortal === 'seller' ? 'text-emerald-600 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Seller Portal</span>
          </button>

          <button
            onClick={() => {
              if (isAdminAuthenticated) {
                setActivePortal('admin');
              } else {
                onOpenAdminAuth();
              }
            }}
            className={`whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer ${
              activePortal === 'admin' ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Admin Console</span>
          </button>

          <button
            onClick={() => setActivePortal('gigs')}
            className={`whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              activePortal === 'gigs' ? 'text-violet-600 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Student Gigs</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Status / Login */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  {currentUser.hostelOrDept}
                </p>
              </div>
              <button
                onClick={logoutUser}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Sign In</span>
            </button>
          )}

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            aria-label="Toggle menu"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          <button
            onClick={() => { setActivePortal('gateway'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-xs font-bold rounded-lg hover:bg-slate-100 text-slate-800"
          >
            Portal Hub
          </button>
          <button
            onClick={() => { setActivePortal('buyer'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-xs font-bold rounded-lg hover:bg-slate-100 text-slate-800"
          >
            Buyer Marketplace (Crochet & Crafts)
          </button>
          <button
            onClick={() => { setActivePortal('seller'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-xs font-bold rounded-lg hover:bg-slate-100 text-slate-800"
          >
            Seller Portal (Real Photo Upload)
          </button>
          <button
            onClick={() => { 
              if (isAdminAuthenticated) {
                setActivePortal('admin');
              } else {
                onOpenAdminAuth();
              }
              setMobileMenuOpen(false); 
            }}
            className="w-full text-left py-2 px-3 text-xs font-bold rounded-lg hover:bg-slate-100 text-slate-800 flex items-center justify-between"
          >
            <span>Admin Console</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </button>
          <button
            onClick={() => { setActivePortal('gigs'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 text-xs font-bold rounded-lg hover:bg-slate-100 text-slate-800"
          >
            Student Gigs & Services
          </button>
        </div>
      )}
    </header>
  );
};
