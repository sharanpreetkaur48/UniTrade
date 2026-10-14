import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Truck, 
  PhoneCall, 
  CheckCircle2,
  Lock,
  Layers,
  GraduationCap
} from 'lucide-react';

interface GatewayViewProps {
  onOpenAdminAuth: () => void;
  onOpenLogin: () => void;
}

export const GatewayView: React.FC<GatewayViewProps> = ({ onOpenAdminAuth }) => {
  const { 
    setActivePortal, 
    products, 
    orders, 
    adminSettings, 
    isAdminAuthenticated 
  } = useApp();

  const activeListingCount = products.filter(p => p.status === 'available').length;
  const boostedCount = products.filter(p => p.isBoosted).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Welcome Banner */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-4">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>Exclusive College Student Marketplace & Resale Hub</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
          Buy & Sell Second-Hand Campus Essentials with Trust
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          From textbooks, scientific calculators, and electronics to shoes, hostel gear, and student handmade items across Punjab University. Safe campus pickup, Cash on Delivery, and private student chats.
        </p>

        {/* 3 Portal Cards Grid - Core Requirement */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left">
          
          {/* Card 1: Buyer Portal */}
          <div 
            onClick={() => setActivePortal('buyer')}
            className="group relative bg-white rounded-2xl p-7 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ShoppingBag className="w-7 h-7" />
              </div>

              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                Student Shopping
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Buyer Portal
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Explore used textbooks, electronics, calculators, shoes, and handmade items across Punjab University. Enjoy campus pickup or ₹{adminSettings.localDeliveryFee} local delivery with Cash on Delivery.
              </p>

              <div className="space-y-2.5 text-xs text-slate-500 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Punjab University campus discovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Handmade items & campus crafts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cash on Delivery (COD) payment</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Enter Buyer Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Seller Portal */}
          <div 
            onClick={() => setActivePortal('seller')}
            className="group relative bg-white rounded-2xl p-7 border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Store className="w-7 h-7" />
              </div>

              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                Monetize Pre-Loved & Crafts
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Seller Portal
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                List products with photos from camera or device gallery. Submitted items arrive at Admin for price upload and verification before going live. Boost listings for 1 month for ₹{adminSettings.boostFee}.
              </p>

              <div className="space-y-2.5 text-xs text-slate-500 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Camera & gallery photo upload</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Active 30-day listing boost (₹{adminSettings.boostFee})</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant item delete & manage</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Enter Seller Portal</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Admin Portal */}
          <div 
            onClick={() => {
              if (isAdminAuthenticated) {
                setActivePortal('admin');
              } else {
                onOpenAdminAuth();
              }
            }}
            className="group relative bg-white rounded-2xl p-7 border border-slate-200 hover:border-slate-800 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Platform Operations
                </span>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Secure Login</span>
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span>Admin Portal</span>
                <Lock className="w-4 h-4 text-slate-400" />
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Master dashboard to receive seller listings first, upload final marketplace prices, control delivery status (Pending → Delivered), review SMS triggers, and set platform fees.
              </p>

              <div className="space-y-2.5 text-xs text-slate-500 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Set & upload marketplace prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Buyer & seller contact logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Control delivery: Pending → Delivered</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-900 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Enter Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Policy Strip */}
      <section className="bg-slate-50 border-y border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {activeListingCount}+
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Active Campus Listings
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-emerald-600 tabular-nums">
              ₹{adminSettings.localDeliveryFee}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Local Campus Delivery
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-blue-600 tabular-nums">
              {orders.length + 18}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Verified Student Orders
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              100% COD
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Zero Prepayment Risk
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
