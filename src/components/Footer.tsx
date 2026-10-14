import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdminAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminAuth }) => {
  const { setActivePortal, isAdminAuthenticated } = useApp();

  return (
    <footer className="mt-16 bg-slate-900 text-white border-t border-slate-800">
      
      {/* The Specific Requirement: Campus Gigs Hyperlink Corner / Banner at end of website */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-white">
              <span className="font-bold text-white">Experienced student?</span> Offer services like making presentations & PPTs, graphic design, exam tutoring, or just peer talking with your custom price.
            </p>
          </div>

          {/* Hyperlink-type action button in corner */}
          <button
            onClick={() => setActivePortal('gigs')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer group"
          >
            <span>Explore Campus Gigs & Services</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                UniTrade
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Empowering students across Punjab University to buy and sell second-hand textbooks, scientific calculators, electronics, shoes, hostel essentials, and handmade crafts at honest prices.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3">
              Marketplace Portals
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setActivePortal('gateway')} className="hover:text-white transition-colors cursor-pointer">
                  Portal Hub Gateway
                </button>
              </li>
              <li>
                <button onClick={() => setActivePortal('buyer')} className="hover:text-white transition-colors cursor-pointer">
                  Buyer Marketplace (Punjab University)
                </button>
              </li>
              <li>
                <button onClick={() => setActivePortal('seller')} className="hover:text-white transition-colors cursor-pointer">
                  Seller Portal (Add Items & Boost)
                </button>
              </li>
              <li>
                <button onClick={() => setActivePortal('gigs')} className="hover:text-white transition-colors cursor-pointer">
                  Student Freelance & Gigs
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3">
              Delivery & Protection
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Cash on Delivery (COD)</span>
              </li>
              <li>Campus Spot Pickup (FREE)</li>
              <li>Local Campus Delivery (₹10)</li>
              <li>Regional up to 70 km (₹50)</li>
              <li>Private Student Chat & Inquiries</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3">
              Administration
            </h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Authorized operations dashboard for tracking orders, managing delivery conditions, and price controls.
            </p>
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  setActivePortal('admin');
                } else {
                  onOpenAdminAuth();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} UniTrade Campus Resale Technologies. Built exclusively for college communities.
          </div>
          <div className="flex items-center gap-4">
            <span>Student Resale Protocol</span>
            <span>·</span>
            <span>Zero Public Phone Exposure</span>
            <span>·</span>
            <span>COD Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
