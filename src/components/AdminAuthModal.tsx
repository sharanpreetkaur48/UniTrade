import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, ShieldCheck, X, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose }) => {
  const { setIsAdminAuthenticated, setActivePortal } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === '1234') {
      setIsAdminAuthenticated(true);
      setActivePortal('admin');
      setError(false);
      setPassword('');
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Admin Access Gate
            </h3>
          </div>
          <button
            onClick={() => {
              setError(false);
              setPassword('');
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3 mb-5">
          Enter the administrator PIN to access platform order logistics, delivery status controls, and price configurations.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Incorrect security PIN. Please try again.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Password PIN
            </label>
            <input
              type="password"
              autoFocus
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
              placeholder="••••"
              className="w-full px-3.5 py-2.5 text-center text-lg font-mono tracking-widest border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify & Unlock Admin Portal</span>
          </button>
        </form>
      </div>
    </div>
  );
};
