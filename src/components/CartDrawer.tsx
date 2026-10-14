import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryType, Order } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  CheckCircle, 
  ShieldCheck, 
  Building,
  GraduationCap
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    placeOrder, 
    adminSettings, 
    currentUser,
    setIsSmsModalOpen,
    universityInfo 
  } = useApp();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('local');
  const [buyerName, setBuyerName] = useState(currentUser?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '');
  const [hostelAddress, setHostelAddress] = useState(currentUser?.hostelOrDept || universityInfo.hostels[0]);
  const [roomNumber, setRoomNumber] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  // Subtotal calculated with the final prices
  const subtotal = cart.reduce((sum, item) => sum + ((item.product.finalPrice ?? item.product.price) * item.quantity), 0);
  
  let deliveryFee = 0;
  if (deliveryType === 'local') deliveryFee = adminSettings.localDeliveryFee;
  if (deliveryType === 'regional_70km') deliveryFee = adminSettings.regionalDeliveryFee;

  const totalAmount = subtotal + deliveryFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    const fullAddress = `${hostelAddress}${roomNumber ? `, Room/Floor: ${roomNumber}` : ''}`;

    setIsSubmitting(true);
    try {
      const order = await placeOrder({
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim(),
        hostelAddress: fullAddress,
        deliveryType
      });

      if (order) {
        setConfirmedOrder(order);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-black text-slate-900">
              Campus Cart
            </h2>
            <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={() => {
              setIsCartOpen(false);
              setConfirmedOrder(null);
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Confirmation Screen */}
        {confirmedOrder ? (
          <div className="p-6 flex-1 flex flex-col justify-center text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Cash on Delivery Confirmed
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 mb-2">
              Order #{confirmedOrder.id} Placed!
            </h3>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed max-w-sm mx-auto">
              Your order has been notified to the student artisan/seller. Pay <strong>₹{confirmedOrder.totalAmount} in cash</strong> only when the product reaches your hands.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left mb-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Buyer:</span>
                <span className="font-bold text-slate-900">{confirmedOrder.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="font-mono text-slate-900">{confirmedOrder.buyerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hostel Drop:</span>
                <span className="font-medium text-slate-800 text-right max-w-[180px] truncate">{confirmedOrder.hostelAddress}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900">Total Payable (COD):</span>
                <span className="font-black text-emerald-700 text-sm tabular-nums">₹{confirmedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Buyer's Private Phone SMS Confirmation */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left mb-6 shadow-sm">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span className="text-xs font-bold text-emerald-950">SMS Sent to Your Phone</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                  {confirmedOrder.buyerPhone}
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-sans bg-white p-3 rounded-xl border border-emerald-100 shadow-inner">
                "Order #{confirmedOrder.id} Confirmed! Total payable upon delivery via Cash on Delivery: ₹{confirmedOrder.totalAmount}. Campus delivery team is dispatching soon to {confirmedOrder.deliveryAddress || confirmedOrder.hostelAddress}."
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-emerald-700">
                <span>Sender: UniTrade-COD</span>
                <span className="font-semibold text-emerald-800">Delivered to your phone</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setConfirmedOrder(null);
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer shadow-md"
              >
                Done · Continue Shopping
              </button>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="p-8 flex-1 flex flex-col justify-center text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              Your cart is empty
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Find handcrafted crochet flowers, resin art, and study essentials.
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="px-5 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-2xl hover:bg-violet-700 transition-colors mx-auto cursor-pointer"
            >
              Browse Campus Marketplace
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Cart Items List with Final Prices */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Selected Items</span>
                <button
                  onClick={clearCart}
                  className="text-slate-400 hover:text-red-600 text-[11px] cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {cart.map(item => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs"
                >
                  <img
                    src={item.product.images?.[0] || '/src/assets/images/crochet_tulip_plushie_1791906942894.jpg'}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">
                      {item.product.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {item.product.hostelOrDept} · {item.product.condition}
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 mt-1 tabular-nums">
                      ₹{(item.product.finalPrice ?? item.product.price).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 bg-white rounded-xl">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-slate-500 hover:bg-slate-100 rounded-l cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-black tabular-nums text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-slate-500 hover:bg-slate-100 rounded-r cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select Campus Handover Method
              </label>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <label 
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                    deliveryType === 'pickup' 
                      ? 'border-violet-600 bg-violet-50/50' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryType === 'pickup'}
                      onChange={() => setDeliveryType('pickup')}
                      className="text-violet-600 focus:ring-violet-500"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Campus Spot Pickup</div>
                      <div className="text-[11px] text-slate-500">Meet seller at OAT or hostel lounge</div>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-600">FREE</span>
                </label>

                <label 
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                    deliveryType === 'local' 
                      ? 'border-violet-600 bg-violet-50/50' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryType === 'local'}
                      onChange={() => setDeliveryType('local')}
                      className="text-violet-600 focus:ring-violet-500"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Hostel Gate Drop</div>
                      <div className="text-[11px] text-slate-500">Delivered directly to your hostel gate</div>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">₹{adminSettings.localDeliveryFee}</span>
                </label>

                <label 
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                    deliveryType === 'regional_70km' 
                      ? 'border-violet-600 bg-violet-50/50' 
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryType === 'regional_70km'}
                      onChange={() => setDeliveryType('regional_70km')}
                      className="text-violet-600 focus:ring-violet-500"
                    />
                    <div>
                      <div className="font-bold text-slate-900">Regional Courier (≤ 70 km)</div>
                      <div className="text-[11px] text-slate-500">Inter-NCR student delivery</div>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">₹{adminSettings.regionalDeliveryFee}</span>
                </label>
              </div>
            </div>

            {/* Buyer Checkout Form */}
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Student Delivery Details (COD)
              </label>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="Phone Number (10 digits - No OTP)"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none font-mono tabular-nums"
                />
              </div>

              <div>
                <select
                  value={hostelAddress}
                  onChange={(e) => setHostelAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none bg-white cursor-pointer"
                >
                  {universityInfo.hostels.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Room No. / Floor (e.g. Room B-312)"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>

              {/* COD Badge */}
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl text-xs flex items-center justify-between border border-emerald-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">Cash on Delivery (COD)</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md shadow-xs">
                  Pay at Handover
                </span>
              </div>
            </form>
          </div>
        )}

        {/* Drawer Sticky Footer with Subtotal & Buy Button */}
        {!confirmedOrder && cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900 tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Payable (COD):</span>
                <span className="text-base text-violet-700 font-black tabular-nums">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Processing Order...' : 'Confirm Cash on Delivery Order'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
