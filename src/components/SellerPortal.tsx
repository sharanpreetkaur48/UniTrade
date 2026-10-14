import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory, ProductCondition, Product } from '../types';
import { INITIAL_COLLEGES } from '../data/initialData';
import { 
  PlusCircle, 
  Sparkles, 
  Package, 
  Truck, 
  CheckCircle, 
  Trash2, 
  User, 
  Tag,
  DollarSign,
  Phone,
  MessageSquare,
  AlertCircle,
  Clock,
  ShieldCheck,
  X,
  Zap,
  Check,
  Camera,
  Image as ImageIcon,
  Star,
  RefreshCw
} from 'lucide-react';

export const SellerPortal: React.FC = () => {
  const { 
    products, 
    addProduct, 
    boostProduct, 
    updateProductStock, 
    deleteProduct,
    currentUser, 
    loginUser, 
    orders, 
    adminSettings,
    smsNotifications,
    markSmsAsRead
  } = useApp();

  // Local state for tabs
  const [activeTab, setActiveTab] = useState<'listings' | 'upload' | 'orders' | 'sms'>('listings');

  // Login form state if not logged in
  const [sellerNameInput, setSellerNameInput] = useState('');
  const [sellerPhoneInput, setSellerPhoneInput] = useState('');
  const [sellerCollegeInput] = useState(INITIAL_COLLEGES[0]);

  // Upload Product form state (Strictly Camera & Gallery ONLY, no links, no presets)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Handmade Items');
  const [condition, setCondition] = useState<ProductCondition>('Like New');
  const [suggestedPrice, setSuggestedPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageSource, setImageSource] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // File input refs for camera & gallery
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Boost Modal state
  const [selectedProductToBoost, setSelectedProductToBoost] = useState<Product | null>(null);
  const [boostSuccessMsg, setBoostSuccessMsg] = useState<string | null>(null);

  // Delete Modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  // Interactive SMS Rating state in Seller Portal
  const [ratedSmsIds, setRatedSmsIds] = useState<Record<string, number>>({});
  const [reviewNotice, setReviewNotice] = useState<string | null>(null);

  // Handle image capture via camera or selection from gallery
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, sourceLabel: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setImageSource(sourceLabel);
        setPhotoError(null);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so re-selecting same file works
    e.target.value = '';
  };

  const handleRateDelivery = (smsId: string, rating: number) => {
    setRatedSmsIds(prev => ({ ...prev, [smsId]: rating }));
    setReviewNotice(`Thank you! Your ${rating}-star feedback has been registered for this delivery.`);
    setTimeout(() => setReviewNotice(null), 3000);
  };

  // If user is not signed in with phone
  if (!currentUser) {
    const handlePhoneLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!sellerPhoneInput.trim() || !sellerNameInput.trim()) return;
      loginUser(sellerPhoneInput.trim(), sellerNameInput.trim(), sellerCollegeInput, 'seller');
    };

    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <User className="w-6 h-6" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900">
            Punjab University Seller Sign In
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Sign in with your student phone number only (no OTP needed). Start listing campus products right away.
          </p>

          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={sellerNameInput}
                onChange={(e) => setSellerNameInput(e.target.value)}
                placeholder="e.g. Arjun Sharma"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number (No OTP Required)
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                value={sellerPhoneInput}
                onChange={(e) => setSellerPhoneInput(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number (e.g. 9876543210)"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none tabular-nums"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used to receive delivery alerts and review requests. Kept private from public buyers.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Campus University
              </label>
              <input
                type="text"
                disabled
                value="Panjab University (PU) Campus"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-semibold cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
            >
              Continue to Seller Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter seller's own products
  const sellerProducts = products.filter(p => p.sellerPhone === currentUser.phone);
  
  // Orders containing seller's products
  const sellerOrders = orders.filter(ord => 
    ord.items.some(it => it.product.sellerPhone === currentUser.phone)
  );

  // Seller's OWN private SMS notifications ONLY
  const sellerSms = smsNotifications.filter(s => s.recipientPhone === currentUser.phone);
  const unreadSellerSms = sellerSms.filter(s => !s.isRead).length;

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || suggestedPrice === '' || Number(suggestedPrice) <= 0) return;

    // Strict Enforcement: Cannot submit without genuine camera or gallery photo
    if (!imageUrl) {
      setPhotoError('Photo is mandatory. Please capture an image with your camera or upload from your device gallery.');
      return;
    }

    const newProd = addProduct({
      title: title.trim(),
      description: description.trim() || 'Well-maintained student essential in prime condition.',
      category,
      price: Number(suggestedPrice),
      sellerSuggestedPrice: Number(suggestedPrice),
      condition,
      college: 'Punjab University',
      sellerPhone: currentUser.phone,
      sellerName: currentUser.name,
      imageUrl,
      images: [imageUrl],
      stock: Number(stock) || 1
    });

    setUploadSuccess(`"${newProd.title}" submitted to Admin for price verification & marketplace approval!`);
    setTitle('');
    setSuggestedPrice('');
    setDescription('');
    setImageUrl('');
    setImageSource('');
    setPhotoError(null);
    setStock(1);
    setTimeout(() => {
      setUploadSuccess(null);
      setActiveTab('listings');
    }, 2200);
  };

  const confirmActivateBoost = () => {
    if (!selectedProductToBoost) return;
    boostProduct(selectedProductToBoost.id);
    setBoostSuccessMsg(`Boost activated! "${selectedProductToBoost.title}" will stay pinned atop campus searches for 30 days.`);
    setSelectedProductToBoost(null);
    setTimeout(() => setBoostSuccessMsg(null), 3500);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    const deletedTitle = productToDelete.title;
    deleteProduct(productToDelete.id);
    setProductToDelete(null);
    setDeleteNotice(`"${deletedTitle}" has been permanently deleted from your listings and removed from the marketplace.`);
    setTimeout(() => setDeleteNotice(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hidden file inputs for Camera and Gallery Only */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleImageFileChange(e, 'Camera Photo')}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleImageFileChange(e, 'Gallery Photo')}
        className="hidden"
      />

      {/* Boost Success Toast */}
      {boostSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs border border-slate-700 animate-fade-in">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{boostSuccessMsg}</span>
        </div>
      )}

      {/* Delete Notice Toast */}
      {deleteNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs border border-red-700 animate-fade-in">
          <Trash2 className="w-4 h-4 text-red-200" />
          <span>{deleteNotice}</span>
        </div>
      )}

      {/* Review Submitted Notice */}
      {reviewNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs border border-emerald-700 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>{reviewNotice}</span>
        </div>
      )}

      {/* Top Seller Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Seller Dashboard
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">
              Panjab University (PU) Campus
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Phone ID: <span className="font-mono tabular-nums font-semibold">{currentUser.phone}</span> (Private & Protected)
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <div>
            <div className="text-xs text-slate-400">My Listings</div>
            <div className="text-xl font-bold text-slate-900 tabular-nums">
              {sellerProducts.length}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Active Boosts</div>
            <div className="text-xl font-bold text-blue-600 tabular-nums">
              {sellerProducts.filter(p => p.isBoosted).length}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Order Requests</div>
            <div className="text-xl font-bold text-emerald-600 tabular-nums">
              {sellerOrders.length}
            </div>
          </div>

          {/* Dedicated Seller SMS Alerts Trigger */}
          <button
            onClick={() => setActiveTab('sms')}
            className={`p-2.5 rounded-xl transition-all cursor-pointer relative flex items-center gap-1.5 ${
              activeTab === 'sms' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="My Phone SMS Notifications"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadSellerSms > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadSellerSms}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          My Listed Products & Stock ({sellerProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'upload'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Item (Camera / Gallery)</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Buyer Orders & Deliveries ({sellerOrders.length})</span>
        </button>

        {/* Dedicated Tab for Seller's Messages */}
        <button
          onClick={() => setActiveTab('sms')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'sms'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My SMS Alerts ({sellerSms.length})</span>
          {unreadSellerSms > 0 && (
            <span className="w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab 1: My Listed Products */}
      {activeTab === 'listings' && (
        <div>
          {sellerProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">
                You have no items listed yet
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Turn your textbooks, calculators, electronics, handmade crafts, and dorm goods into cash.
              </p>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Upload First Item (Camera / Gallery)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all"
                >
                  <div className="relative aspect-[16/9] bg-slate-100">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                      {product.approvalStatus === 'pending_admin' && (
                        <div className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Pending Admin Price</span>
                        </div>
                      )}
                      {product.approvalStatus === 'approved' && (
                        <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Live on Marketplace</span>
                        </div>
                      )}
                      {product.approvalStatus === 'rejected' && (
                        <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          Rejected
                        </div>
                      )}
                    </div>

                    {product.isBoosted && (
                      <div className="absolute top-2.5 right-2.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Boosted (Active)</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                        <span className="text-blue-600 font-semibold">{product.category}</span>
                        <span>·</span>
                        <span>Punjab University</span>
                        <span>·</span>
                        <span>{product.condition}</span>
                      </div>
                      
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                        {product.title}
                      </h3>

                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          {product.approvalStatus === 'approved' ? (
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">Admin Price:</span>
                              <div className="text-lg font-extrabold text-emerald-700 tabular-nums">
                                ₹{product.price.toLocaleString('en-IN')}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">Your Suggested:</span>
                              <div className="text-base font-bold text-slate-700 tabular-nums">
                                ₹{(product.sellerSuggestedPrice || product.price).toLocaleString('en-IN')}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Stock management */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span>Stock:</span>
                          <input
                            type="number"
                            min="0"
                            value={product.stock}
                            onChange={(e) => updateProductStock(product.id, parseInt(e.target.value) || 0)}
                            className="w-14 px-2 py-1 text-center font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 tabular-nums"
                          />
                        </div>
                      </div>

                      {product.approvalStatus === 'pending_admin' && (
                        <p className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                          Listing received! Admin is reviewing condition and setting final selling price.
                        </p>
                      )}

                      {product.isBoosted && (
                        <p className="mt-2 text-[11px] text-blue-700 bg-blue-50 p-2 rounded-lg border border-blue-100 flex items-center justify-between">
                          <span>Boost Active (Featured top rank)</span>
                          <span className="font-mono text-[10px]">Valid 30d</span>
                        </p>
                      )}
                    </div>

                    {/* Listing Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                      {!product.isBoosted ? (
                        <button
                          onClick={() => setSelectedProductToBoost(product)}
                          className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          title="Boost listing for 1 month"
                        >
                          <Zap className="w-3.5 h-3.5 text-blue-600" />
                          <span>Boost (₹{adminSettings.boostFee}/mo)</span>
                        </button>
                      ) : (
                        <div className="flex-1 py-2 px-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Boost Active</span>
                        </div>
                      )}

                      {/* Proper Functioning Delete Item Button */}
                      <button
                        onClick={() => setProductToDelete(product)}
                        className="py-2 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Delete this listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Upload New Product (Strictly Camera & Device Gallery ONLY) */}
      {activeTab === 'upload' && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Upload New Product (Punjab University)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authentic item photo from your device camera or gallery is strictly required. External links are prohibited.
              </p>
            </div>
            <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Zero Listing Fees
            </div>
          </div>

          {uploadSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* Workflow Explanation Banner */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 mb-5 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Admin Price Review Workflow:</strong> You suggest your expected price below. UniTrade Admin will review the product details and upload/set the approved final price before publishing to the Punjab University marketplace.
            </div>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Handmade Crochet Mug Coaster / Casio Calculator / Physics Book"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white cursor-pointer"
                >
                  <option value="Handmade Items">Handmade Items (Crochet, Crafts, Decor)</option>
                  <option value="Textbooks">Textbooks</option>
                  <option value="Calculators">Calculators</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Hostel Essentials">Hostel Essentials</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ProductCondition)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white cursor-pointer"
                >
                  <option value="Like New">Like New (Barely used, pristine)</option>
                  <option value="Good">Good (Minor wear, fully functional)</option>
                  <option value="Fair">Fair (Noticeable wear, budget price)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Suggested Price (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="10"
                    value={suggestedPrice}
                    onChange={(e) => setSuggestedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 299"
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none tabular-nums"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Admin will verify and set the final price.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Stock Units Available
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none tabular-nums"
                />
              </div>
            </div>

            {/* STRICT REQUIREMENT: Camera & Device Gallery Upload ONLY (NO URLS, NO SAMPLE PRESETS) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Item Photo (Camera & Device Gallery Only) *
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Direct Upload Required
                </span>
              </div>

              {photoError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{photoError}</span>
                </div>
              )}

              {/* The Only 2 Allowed Upload Methods */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-4 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 transition-all cursor-pointer flex items-center justify-center gap-3 shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Take Live Photo</div>
                    <div className="text-[11px] text-emerald-700">Open Device Camera</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="p-4 rounded-2xl border-2 border-dashed border-blue-400 bg-blue-50/70 hover:bg-blue-100 text-blue-900 transition-all cursor-pointer flex items-center justify-center gap-3 shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold">Upload from Gallery</div>
                    <div className="text-[11px] text-blue-700">Select Device Files/Photos</div>
                  </div>
                </button>
              </div>

              {/* Photo Preview Card or Empty State */}
              {imageUrl ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={imageUrl}
                      alt="Uploaded preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-300 shadow-sm shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Genuine Device Photo Attached</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Source: <span className="font-semibold text-slate-800">{imageSource || 'Device Storage'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-700 cursor-pointer shadow-sm"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setImageSource('');
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center text-xs text-slate-500">
                  No photo attached yet. Please use the <strong>Camera</strong> or <strong>Gallery</strong> button above to attach your item's picture.
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Description & Highlights
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe condition, semester/year used, materials (for handmade items), or pickup spot..."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Delivery Terms Confirmation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Punjab University Campus Delivery</span>
              </div>
              <p>
                Buyers can choose: <strong>Campus Spot Pickup (FREE)</strong>, <strong>PU Hostel Delivery (₹{adminSettings.localDeliveryFee})</strong>, or <strong>Regional up to 70 km (₹{adminSettings.regionalDeliveryFee})</strong>.
              </p>
              <p className="text-slate-500">
                You will receive private SMS notifications on your phone whenever someone orders or reviews your product.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer shadow-md"
            >
              Submit Item for Admin Review & Pricing
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Incoming Orders & Delivery Status */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {sellerOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">
                No orders yet for your items
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                When campus students buy your items via Cash on Delivery, order details and delivery progress will appear here.
              </p>
            </div>
          ) : (
            sellerOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-base">
                        #{order.id}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">
                        Placed {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 mt-1">
                      Buyer: <strong>{order.buyerName}</strong> (Punjab University) · Contact: <strong>{order.buyerPhone}</strong>
                    </div>
                  </div>

                  {/* Delivery Status Tag */}
                  <div>
                    {order.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Order Received · Preparing Handover</span>
                      </span>
                    )}
                    {order.status === 'out_for_delivery' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 text-xs font-semibold rounded-full border border-blue-200">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Out for Delivery / In-Transit</span>
                      </span>
                    )}
                    {order.status === 'delivered' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Delivered · SMS Review Dispatched</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Items from this seller in this order */}
                <div className="py-4 space-y-3">
                  {order.items
                    .filter(it => it.product.sellerPhone === currentUser.phone)
                    .map(it => (
                      <div key={it.product.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={it.product.imageUrl}
                            alt={it.product.title}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{it.product.title}</div>
                            <div className="text-slate-500">Qty: {it.quantity} · Condition: {it.product.condition}</div>
                          </div>
                        </div>

                        <div className="font-bold text-slate-900 tabular-nums">
                          ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Order Footer & Delivery Notes */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                  <div>
                    <span className="text-slate-500">Delivery Address: </span>
                    <span className="font-medium text-slate-800">{order.deliveryAddress}</span>
                    <span className="mx-2 text-slate-300">|</span>
                    <span className="text-slate-500">Mode: </span>
                    <span className="font-medium text-emerald-700">Cash on Delivery (₹{order.totalAmount})</span>
                  </div>

                  {order.status === 'delivered' && (
                    <button
                      onClick={() => setActiveTab('sms')}
                      className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>View Delivery Review SMS</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Seller's Private SMS Feed (Only for this seller) */}
      {activeTab === 'sms' && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                My Phone SMS Notifications
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Private SMS messages dispatched to your registered phone number: <span className="font-mono font-bold text-slate-800">{currentUser.phone}</span>
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {sellerSms.length} Messages
            </span>
          </div>

          {sellerSms.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p>No phone notifications for your account yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                You will receive SMS alerts when your products are approved, purchased, or delivered.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sellerSms.map(sms => {
                const isDeliveryReview = sms.message.toLowerCase().includes('review') || sms.message.toLowerCase().includes('delivered');
                const currentRating = ratedSmsIds[sms.id];

                return (
                  <div
                    key={sms.id}
                    onClick={() => markSmsAsRead(sms.id)}
                    className={`bg-slate-50 rounded-2xl p-4 border transition-all ${
                      !sms.isRead ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{sms.sender}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          To My Phone
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(sms.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed font-sans bg-white p-3 rounded-xl border border-slate-200/80">
                      {sms.message}
                    </p>

                    {/* Interactive Review Box for Delivery Alerts */}
                    {isDeliveryReview && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60 bg-emerald-50/70 -mx-4 -mb-4 p-3 rounded-b-2xl">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-emerald-950">
                            {currentRating ? 'Your Rating Submitted:' : 'Rate Campus Handover (1-5★):'}
                          </span>

                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRateDelivery(sms.id, star)}
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
              })}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal for Seller */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">
              Delete This Listing?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-1.5 mb-4">
              Are you sure you want to delete <span className="font-semibold text-slate-800">"{productToDelete.title}"</span>? This will permanently take it down from Punjab University marketplace.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 mb-5">
              <img
                src={productToDelete.imageUrl}
                alt={productToDelete.title}
                className="w-10 h-10 rounded-lg object-cover border border-slate-300 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">{productToDelete.title}</div>
                <div className="text-[11px] text-slate-500">Price: ₹{productToDelete.price} · {productToDelete.category}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Keep Listing
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boost Modal */}
      {selectedProductToBoost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Boost Your Listing (30 Days)
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductToBoost(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
              <img
                src={selectedProductToBoost.imageUrl}
                alt={selectedProductToBoost.title}
                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {selectedProductToBoost.title}
                </div>
                <div className="text-[11px] text-slate-500">
                  Price: ₹{selectedProductToBoost.price} · Punjab University
                </div>
              </div>
            </div>

            {/* Boost Perks */}
            <div className="space-y-2.5 text-xs text-slate-600 mb-5">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Rank #1 on Search:</strong> Pinned to the top of campus queries</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Featured Badge:</strong> Distinct visual badge highlighting your item</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>1 Month Validity:</strong> Stays boosted for 30 consecutive days</span>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl mb-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-800 font-semibold">Boost Package (30 Days):</span>
                <div className="text-[11px] text-blue-600">Platform promotional rate</div>
              </div>
              <span className="text-xl font-extrabold text-blue-700 tabular-nums">
                ₹{adminSettings.boostFee}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedProductToBoost(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmActivateBoost}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Activate (₹{adminSettings.boostFee})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
