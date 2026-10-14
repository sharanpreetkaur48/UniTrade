import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, X, CheckCircle, GraduationCap } from 'lucide-react';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginUser, universityInfo } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hostelOrDept, setHostelOrDept] = useState(universityInfo.hostels[0]);
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    loginUser(phone.trim(), name.trim(), hostelOrDept, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              U
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Student Sign In
              </h3>
              <p className="text-[10px] text-blue-700 font-bold">
                Panjab University (PU) Campus Verified
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3 mb-5">
          Sign in using your mobile phone number only (zero OTP friction). Kept private from public listings.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Priya Joshi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Phone (No OTP)
            </label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none font-mono tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Campus Hostel / Department
            </label>
            <select
              value={hostelOrDept}
              onChange={(e) => setHostelOrDept(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none bg-white cursor-pointer"
            >
              {universityInfo.hostels.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Profile Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`py-2 text-xs font-bold rounded-2xl border transition-colors cursor-pointer ${
                  role === 'buyer'
                    ? 'border-violet-600 bg-violet-50 text-violet-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Campus Buyer
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`py-2 text-xs font-bold rounded-2xl border transition-colors cursor-pointer ${
                  role === 'seller'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Artisan / Seller
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer shadow-md mt-2"
          >
            Enter UniTrade (Punjab University)
          </button>
        </form>
      </div>
    </div>
  );
};
