import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory, ProductCondition } from '../types';
import { INITIAL_COLLEGES } from '../data/initialData';
import { 
  Search, 
  Filter, 
  MapPin, 
  ShoppingBag, 
  MessageCircle, 
  Sparkles, 
  Truck, 
  Info,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const BuyerPortal: React.FC = () => {
  const { 
    products, 
    addToCart, 
    selectedCollege, 
    setSelectedCollege, 
    adminSettings,
    setActiveChatProduct,
    setIsCartOpen 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | 'All'>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high'>('recommended');
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Textbooks',
    'Calculators',
    'Electronics',
    'Shoes',
    'Hostel Essentials',
    'Handmade Items'
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Must be approved by admin to appear on the campus marketplace
      if (product.approvalStatus !== 'approved') return false;

      // Stock check
      if (product.status !== 'available' || product.stock <= 0) return false;

      // College filter
      if (selectedCollege !== 'All Campuses' && product.college !== selectedCollege) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Condition filter
      if (selectedCondition !== 'All' && product.condition !== selectedCondition) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesCollege = product.college.toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesCat || matchesCollege;
      }

      return true;
    }).sort((a, b) => {
      // Prioritize boosted listings if recommended
      if (sortBy === 'recommended') {
        if (a.isBoosted && !b.isBoosted) return -1;
        if (!a.isBoosted && b.isBoosted) return 1;
        return 0;
      }
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      return 0;
    });
  }, [products, selectedCollege, selectedCategory, selectedCondition, searchQuery, sortBy]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAddedToast(`Added "${product.title.slice(0, 24)}..." to cart`);
    setTimeout(() => setAddedToast(null), 2500);
  };

  const handleOpenChat = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveChatProduct(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm animate-fade-in border border-slate-700">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>{addedToast}</span>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="ml-2 underline text-blue-400 text-xs font-semibold cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Header & College Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Student Second-Hand Marketplace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Verified campus goods from fellow students. Save up to 70% compared to retail.
          </p>
        </div>

        {/* Campus Discovery Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 self-start md:self-auto">
          <MapPin className="w-4 h-4 text-blue-600 ml-2" />
          <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Campus:
          </span>
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-transparent py-1 pr-3 focus:outline-none cursor-pointer"
          >
            <option value="All Campuses">Panjab University (PU) Campus (All Hostels)</option>
            {INITIAL_COLLEGES.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Bar & Secondary Controls */}
      <div className="mt-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search textbooks, scientific calculators, headphones, kettle, shoes..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Condition */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Featured & Boosted</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
            <span>Condition:</span>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value as any)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Conditions</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs (Zero-pill, clean segmented control buttons) */}
      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className="mt-8">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No items match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try switching your campus filter or clearing the category search.
            </p>
            <button
              onClick={() => {
                setSelectedCollege('All Campuses');
                setSelectedCategory('All');
                setSelectedCondition('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedProductDetails(product)}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
              >
                {/* Product Image Slot */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback gracefully to subtle gradient container with category icon
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  
                  {/* Subtle Boosted Tag (Unboxed text with background) */}
                  {product.isBoosted && (
                    <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Boosted</span>
                    </div>
                  )}

                  {/* Condition Tag */}
                  <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur text-white text-[10px] font-medium px-2 py-0.5 rounded">
                    {product.condition}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed Metadata with · separator */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-1.5 truncate">
                      <span className="font-medium text-slate-700">{product.college}</span>
                      <span aria-hidden="true">·</span>
                      <span>{product.category}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Price:</span>
                      <div className="text-lg font-bold text-slate-900 tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleOpenChat(product, e)}
                        className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Private Inquiry / Chat with Senior"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl animate-fade-in">
            <div className="relative">
              <img
                src={selectedProductDetails.imageUrl}
                alt={selectedProductDetails.title}
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-80 object-cover"
              />
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {selectedProductDetails.isBoosted && (
                <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Boosted Campus Listing</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="font-semibold text-blue-600">{selectedProductDetails.college}</span>
                <span aria-hidden="true">·</span>
                <span>Category: {selectedProductDetails.category}</span>
                <span aria-hidden="true">·</span>
                <span>Condition: {selectedProductDetails.condition}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {selectedProductDetails.title}
              </h2>

              <div className="text-2xl font-extrabold text-slate-900 tabular-nums mb-4">
                ₹{selectedProductDetails.price.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-500 ml-2">
                  (Cash on Delivery eligible)
                </span>
              </div>

              <div className="border-t border-b border-slate-100 py-4 my-4">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Seller Description
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedProductDetails.description}
                </p>
              </div>

              {/* Delivery & Pickup Breakdown */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Delivery & Handover Options</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="font-semibold text-slate-800">Campus Pickup</div>
                    <div className="text-emerald-600 font-bold mt-0.5">FREE</div>
                    <div className="text-slate-500 text-[11px] mt-1">Direct spot meet at hostel or canteen</div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="font-semibold text-slate-800">Local Delivery</div>
                    <div className="text-slate-900 font-bold mt-0.5">₹{adminSettings.localDeliveryFee}</div>
                    <div className="text-slate-500 text-[11px] mt-1">Campus gates & neighboring hostels</div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="font-semibold text-slate-800">Regional (≤ 70 km)</div>
                    <div className="text-slate-900 font-bold mt-0.5">₹{adminSettings.regionalDeliveryFee}</div>
                    <div className="text-slate-500 text-[11px] mt-1">Cross-city college delivery network</div>
                  </div>
                </div>
              </div>

              {/* Seller Privacy Note */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 rounded-xl text-xs mb-6">
                <Info className="w-4 h-4 shrink-0 text-blue-600" />
                <span>
                  <strong>Privacy Protected:</strong> Seller contact numbers are protected and not displayed publicly. Chat privately below to ask questions!
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveChatProduct(selectedProductDetails);
                    setSelectedProductDetails(null);
                  }}
                  className="flex-1 py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span>Inquire / Chat with Seller</span>
                </button>

                <button
                  onClick={(e) => {
                    handleAddToCart(selectedProductDetails, e);
                    setSelectedProductDetails(null);
                  }}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
