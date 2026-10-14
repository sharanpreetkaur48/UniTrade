import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Phone, X, Check, Star, CheckCheck, Bell } from 'lucide-react';

export const SimulatedSMSModal: React.FC = () => {
  const { 
    isSmsModalOpen, 
    setIsSmsModalOpen, 
    smsNotifications, 
    markSmsAsRead,
    currentUser,
    isAdminAuthenticated 
  } = useApp();

  const [filterRole, setFilterRole] = useState<'all' | 'seller' | 'buyer'>('all');
  const [ratedSmsIds, setRatedSmsIds] = useState<Record<string, number>>({});
  const [reviewSubmittedNotice, setReviewSubmittedNotice] = useState<string | null>(null);

  if (!isSmsModalOpen) return null;

  const filteredMessages = smsNotifications.filter(sms => {
    // If not admin, strictly show ONLY messages sent to currentUser's phone
    if (!isAdminAuthenticated) {
      if (!currentUser?.phone) return false;
      return sms.recipientPhone === currentUser.phone;
    }
    if (filterRole === 'all') return true;
    return sms.recipientRole === filterRole;
  });

  const handleRate = (smsId: string, rating: number) => {
    setRatedSmsIds(prev => ({ ...prev, [smsId]: rating }));
    setReviewSubmittedNotice(`Thank you! Your ${rating}-star review has been registered for this delivery.`);
    setTimeout(() => setReviewSubmittedNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col justify-between shadow-2xl border border-slate-200 animate-fade-in overflow-hidden">
        
        {/* Header styled like a smartphone messaging app */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Campus SMS Feed
                </h3>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulated phone messages & automated delivery review requests
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSmsModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Filter:</span>
            <button
              onClick={() => setFilterRole('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterRole === 'all'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({smsNotifications.length})
            </button>
            <button
              onClick={() => setFilterRole('seller')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterRole === 'seller'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Seller Messages
            </button>
            <button
              onClick={() => setFilterRole('buyer')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterRole === 'buyer'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Buyer Messages
            </button>
          </div>

          {currentUser && (
            <div className="text-[11px] text-slate-500 font-mono">
              My Phone: {currentUser.phone}
            </div>
          )}
        </div>

        {/* Notice */}
        {reviewSubmittedNotice && (
          <div className="mx-5 mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{reviewSubmittedNotice}</span>
          </div>
        )}

        {/* Message Bubble Feed */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 bg-slate-100/50">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No phone notifications in this filter.
            </div>
          ) : (
            filteredMessages.map(sms => {
              const isDeliveryReview = sms.message.toLowerCase().includes('review') || sms.message.toLowerCase().includes('delivered');
              const currentRating = ratedSmsIds[sms.id];

              return (
                <div
                  key={sms.id}
                  onClick={() => markSmsAsRead(sms.id)}
                  className={`bg-white rounded-2xl p-4 border transition-all shadow-sm ${
                    !sms.isRead ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{sms.sender}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        To: {sms.recipientPhone} ({sms.recipientRole})
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(sms.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {sms.message}
                  </p>

                  {/* Interactive Review Box for Delivery Complete Alerts */}
                  {isDeliveryReview && (
                    <div className="mt-3 pt-3 border-t border-slate-100 bg-emerald-50/60 -mx-4 -mb-4 p-3 rounded-b-2xl">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-emerald-900">
                          {currentRating ? 'Review Submitted:' : 'Quick Star Rating:'}
                        </span>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              onClick={() => handleRate(sms.id, star)}
                              className="p-1 hover:scale-110 transition-transform cursor-pointer"
                              title={`${star} Stars`}
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  (currentRating || 0) >= star
                                    ? 'text-amber-500 fill-amber-500'
                                    : 'text-slate-300 hover:text-amber-400'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-400">
            Automated SMS triggers connect buyers and sellers without exposing public contact cards.
          </p>
        </div>
      </div>
    </div>
  );
};
