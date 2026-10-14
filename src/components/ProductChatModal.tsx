import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { MessageCircle, Send, X, ShieldCheck, User } from 'lucide-react';

export const ProductChatModal: React.FC = () => {
  const { 
    activeChatProduct, 
    setActiveChatProduct, 
    chatMessages, 
    sendChatMessage, 
    currentUser 
  } = useApp();

  const [messageText, setMessageText] = useState('');

  if (!activeChatProduct) return null;

  const relevantMessages = chatMessages.filter(m => m.productId === activeChatProduct.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const senderPhone = currentUser?.phone || '9900112233';
    const senderName = currentUser?.name || 'Campus Buyer';

    sendChatMessage(activeChatProduct.id, messageText.trim(), senderPhone, senderName);
    setMessageText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full h-[520px] flex flex-col justify-between shadow-2xl border border-slate-200 animate-fade-in overflow-hidden">
        
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={activeChatProduct.images?.[0] || '/src/assets/images/crochet_tulip_plushie_1791906942894.jpg'}
              alt={activeChatProduct.title}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">
                {activeChatProduct.title}
              </h3>
              <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                <span>Seller: {activeChatProduct.sellerName}</span>
                <span>·</span>
                <span className="text-emerald-400">₹{activeChatProduct.finalPrice}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveChatProduct(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Assurance Notice */}
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center gap-2 text-[11px] text-blue-800">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Private communication active. Phone numbers are hidden.</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {relevantMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600">No messages yet</p>
              <p className="text-[11px] mt-0.5">
                Ask the seller about edition, notes, or where to meet on campus!
              </p>
            </div>
          ) : (
            relevantMessages.map(msg => {
              const isMe = currentUser 
                ? msg.senderPhone === currentUser.phone 
                : msg.senderName.includes('Buyer');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                    {msg.senderName} · {msg.timestamp}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            required
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your campus inquiry..."
            className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
