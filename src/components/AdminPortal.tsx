import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus, Product } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  Truck, 
  Sliders, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  RefreshCw,
  LogOut,
  Clock,
  Check,
  XCircle,
  FileCheck,
  Trash2,
  Lock,
  MessageSquare,
  X
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    products, 
    orders, 
    updateOrderStatus, 
    adminSettings, 
    updateAdminSettings, 
    adminApproveProduct,
    adminRejectProduct,
    adminRemoveProduct,
    updateProductPrice,
    setIsAdminAuthenticated,
    setActivePortal,
    updateProductStock,
    resetAllData,
    smsNotifications
  } = useApp();

  const [activeTab, setActiveTab] = useState<'approvals' | 'orders' | 'users' | 'inventory' | 'pricing' | 'complaints' | 'sms'>('approvals');
  const [smsRoleFilter, setSmsRoleFilter] = useState<'all' | 'seller' | 'buyer'>('all');
  const [smsSearch, setSmsSearch] = useState('');

  // Price adjustment states for pending products
  const [adminPriceInputs, setAdminPriceInputs] = useState<Record<string, number>>({});
  const [adminNotesInputs, setAdminNotesInputs] = useState<Record<string, string>>({});
  const [approvalActionNotice, setApprovalActionNotice] = useState<string | null>(null);

  // Admin Remove Listing Modal state
  const [productToRemove, setProductToRemove] = useState<Product | null>(null);
  const [removalReason, setRemovalReason] = useState<string>('');

  // Form states for fee settings
  const [boostFeeInput, setBoostFeeInput] = useState<number>(adminSettings.boostFee);
  const [localFeeInput, setLocalFeeInput] = useState<number>(adminSettings.localDeliveryFee);
  const [regionalFeeInput, setRegionalFeeInput] = useState<number>(adminSettings.regionalDeliveryFee);
  const [priceSaveNotice, setPriceSaveNotice] = useState<string | null>(null);

  // Complaints mock feed (Strictly Punjab University)
  const [complaints] = useState([
    {
      id: 'cmp-1',
      studentName: 'Harpreet Singh',
      studentPhone: '9899112233',
      college: 'Punjab University',
      issue: 'Delay in PU Sector 14 hostel room pickup for handmade macrame order',
      status: 'Resolved',
      date: '2026-10-12'
    },
    {
      id: 'cmp-2',
      studentName: 'Navjot Kaur',
      studentPhone: '9877223344',
      college: 'Punjab University',
      issue: 'Price verification verified by admin for physics textbook',
      status: 'Verified',
      date: '2026-10-13'
    }
  ]);

  // Aggregate user records (Punjab University only)
  const userMap = new Map<string, { phone: string; name: string; college: string; role: string; count: number }>();
  products.forEach(p => {
    userMap.set(p.sellerPhone, {
      phone: p.sellerPhone,
      name: p.sellerName,
      college: 'Punjab University',
      role: 'Seller',
      count: products.filter(x => x.sellerPhone === p.sellerPhone).length
    });
  });
  orders.forEach(o => {
    userMap.set(o.buyerPhone, {
      phone: o.buyerPhone,
      name: o.buyerName,
      college: 'Punjab University',
      role: 'Buyer',
      count: orders.filter(x => x.buyerPhone === o.buyerPhone).length
    });
  });
  const uniqueUsers = Array.from(userMap.values());

  const pendingApprovalProducts = products.filter(p => p.approvalStatus === 'pending_admin');

  const handleApprove = (productId: string, defaultSuggestedPrice: number) => {
    const finalPrice = adminPriceInputs[productId] ?? defaultSuggestedPrice;
    const notes = adminNotesInputs[productId] || 'Verified and approved by admin';
    adminApproveProduct(productId, Number(finalPrice), notes);
    setApprovalActionNotice(`Listing approved! Price uploaded as ₹${finalPrice} and item published to the Punjab University marketplace.`);
    setTimeout(() => setApprovalActionNotice(null), 3500);
  };

  const handleConfirmRemove = () => {
    if (!productToRemove) return;
    const title = productToRemove.title;
    adminRemoveProduct(productToRemove.id, removalReason.trim() || 'Removed per campus policy / seller request');
    setApprovalActionNotice(`Listing "${title}" has been permanently removed from the platform. Seller notified via SMS.`);
    setProductToRemove(null);
    setRemovalReason('');
    setTimeout(() => setApprovalActionNotice(null), 3500);
  };

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings({
      boostFee: Number(boostFeeInput),
      localDeliveryFee: Number(localFeeInput),
      regionalDeliveryFee: Number(regionalFeeInput)
    });
    setPriceSaveNotice('Pricing and delivery fee configurations updated successfully!');
    setTimeout(() => setPriceSaveNotice(null), 3000);
  };

  const handleDeliveryStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Admin Top Header - PASSWORD PIN HIDDEN */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Operations Active</span>
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Panjab University (PU) Campus Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            UniTrade Campus Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Review incoming seller listings, set final campus prices, remove unauthorized listings, manage order logistics, and control delivery status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Reset all demo data to default state?')) {
                resetAllData();
              }
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset platform demo data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={() => {
              setIsAdminAuthenticated(false);
              setActivePortal('gateway');
            }}
            className="px-3.5 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 relative overflow-hidden">
          <div className="text-xs font-medium text-slate-400">Pending Price Approvals</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {pendingApprovalProducts.length} items
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Seller items awaiting admin pricing
          </div>
          {pendingApprovalProducts.length > 0 && (
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-500 rounded-full" />
          )}
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="text-xs font-medium text-slate-400">Live Campus Listings</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {products.filter(p => p.approvalStatus === 'approved').length} active
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            {products.filter(p => p.isBoosted).length} boosted listings
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="text-xs font-medium text-slate-400">Campus Orders</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {orders.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {orders.filter(o => o.status === 'delivered').length} delivered · {orders.filter(o => o.status !== 'delivered').length} in transit
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="text-xs font-medium text-slate-400">Active PU Students</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {uniqueUsers.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Panjab University Only
          </div>
        </div>
      </div>

      {/* Action Notice */}
      {approvalActionNotice && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{approvalActionNotice}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-3 mb-6 scrollbar-none">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'approvals'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Price Setting & Product Approvals</span>
          {pendingApprovalProducts.length > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'approvals' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'
            }`}>
              {pendingApprovalProducts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Orders & Delivery Controller ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Directory ({uniqueUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventory & Remove Listings ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pricing'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Boost Fee & Delivery Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'complaints'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Disputes & Feedback ({complaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sms')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sms'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Campus SMS Feed ({smsNotifications.length})</span>
        </button>
      </div>

      {/* Tab: Pending Product Approvals & Price Uploading */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <FileCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Seller Product Review & Pricing Workflow:</strong> When sellers submit items, they arrive here first. Admin can review the listing, upload/adjust the final selling price, approve it for Punjab University marketplace, or permanently remove/reject it.
            </div>
          </div>

          {pendingApprovalProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                All seller listings are reviewed!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                There are no pending submissions awaiting price configuration.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingApprovalProducts.map(product => {
                const currentPriceVal = adminPriceInputs[product.id] !== undefined
                  ? adminPriceInputs[product.id]
                  : product.sellerSuggestedPrice || product.price;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-sm flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            Pending Admin Review
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs font-semibold text-slate-700">Punjab University</span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs text-blue-600 font-medium">{product.category}</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900">
                          {product.title}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-xl">
                          {product.description}
                        </p>

                        <div className="mt-2 flex items-center gap-4 text-xs text-slate-600">
                          <div>Seller: <strong>{product.sellerName}</strong> ({product.sellerPhone})</div>
                          <div>Condition: <strong>{product.condition}</strong></div>
                          <div>Stock: <strong>{product.stock} units</strong></div>
                        </div>
                      </div>
                    </div>

                    {/* Price upload controller & Remove button */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-full lg:w-80 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Seller Suggested:</span>
                        <span className="font-bold text-slate-700 tabular-nums">
                          ₹{product.sellerSuggestedPrice || product.price}
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                          Upload / Set Approved Final Price (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="10"
                            value={currentPriceVal}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setAdminPriceInputs(prev => ({ ...prev, [product.id]: val }));
                            }}
                            className="w-full pl-7 pr-3 py-1.5 text-sm font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none tabular-nums bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleApprove(product.id, currentPriceVal)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Upload</span>
                        </button>

                        <button
                          onClick={() => setProductToRemove(product)}
                          className="py-2 px-3 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                          title="Remove listing permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 1: Orders & Delivery Controller */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Delivery Condition Automation:</strong> When you change an order's status to <strong>"Delivered"</strong>, UniTrade immediately dispatches an automated SMS to the seller's phone requesting a delivery review and service rating.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Buyer Info</th>
                    <th className="py-3 px-4">Seller Info</th>
                    <th className="py-3 px-4">Items & Mode</th>
                    <th className="py-3 px-4">Delivery Type & Fee</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Control Delivery Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900">{order.id}</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900">{order.buyerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{order.buyerPhone}</div>
                        <div className="text-[11px] text-slate-500">Punjab University</div>
                        <div className="text-[10px] text-slate-400 max-w-[150px] truncate">
                          {order.deliveryAddress}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {order.items.map(it => (
                          <div key={it.product.id} className="mb-1">
                            <div className="font-semibold text-slate-900">{it.product.sellerName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{it.product.sellerPhone}</div>
                            <div className="text-[10px] text-slate-400">Punjab University</div>
                          </div>
                        ))}
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {order.items.map(it => (
                            <div key={it.product.id} className="max-w-[180px] truncate">
                              <span className="font-medium text-slate-800">{it.product.title}</span>
                              <span className="text-slate-400"> (x{it.quantity})</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                          Cash on Delivery
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-medium capitalize text-slate-800">
                          {order.deliveryType === 'pickup' && 'Campus Spot Pickup'}
                          {order.deliveryType === 'local' && 'PU Hostel Gate'}
                          {order.deliveryType === 'regional_70km' && 'Regional (≤70 km)'}
                        </div>
                        <div className="text-slate-500 tabular-nums">
                          Fee: ₹{order.deliveryFee}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-sm tabular-nums">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <select
                            value={order.status}
                            onChange={(e) => handleDeliveryStatusChange(order.id, e.target.value as OrderStatus)}
                            className={`px-2.5 py-1.5 rounded-lg font-semibold text-xs border focus:outline-none cursor-pointer ${
                              order.status === 'delivered'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : order.status === 'out_for_delivery'
                                ? 'bg-blue-50 border-blue-300 text-blue-800'
                                : 'bg-amber-50 border-amber-300 text-amber-800'
                            }`}
                          >
                            <option value="pending">⏳ Pending Dispatch</option>
                            <option value="out_for_delivery">🚚 Out for Delivery</option>
                            <option value="delivered">✅ Delivered & Notify</option>
                          </select>

                          {order.sellerNotifiedForReview && (
                            <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                              <CheckCircle className="w-3 h-3" />
                              <span>SMS Review Sent to Seller</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Student Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Verified Punjab University Students
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Full buyer and seller directory across Panjab University (PU) hostels & departments.
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-500">
              {uniqueUsers.length} PU Students Active
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Campus University</th>
                  <th className="py-3 px-4">Primary Activity</th>
                  <th className="py-3 px-4">Listings / Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {uniqueUsers.map(user => (
                  <tr key={user.phone} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {user.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-blue-700 font-medium">
                      {user.phone}
                    </td>
                    <td className="py-3.5 px-4">
                      Punjab University
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        user.role === 'Seller' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 tabular-nums">
                      {user.count} items
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Inventory & Remove Listings (Admin Proper Functioning) */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Live Campus Inventory & Listing Removal
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Check stock present, seller details, adjust prices, or permanently remove listings.
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Total Units: {products.reduce((s, p) => s + p.stock, 0)}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Item & Category</th>
                  <th className="py-3 px-4">Seller Contact</th>
                  <th className="py-3 px-4">Live Price (Admin Editable)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status & Boost</th>
                  <th className="py-3 px-4">Admin Removal Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 max-w-[200px] truncate">
                            {prod.title}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {prod.category} · {prod.condition}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{prod.sellerName}</div>
                      <div className="font-mono text-slate-500 text-[11px]">{prod.sellerPhone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          value={prod.price}
                          onChange={(e) => updateProductPrice(prod.id, Number(e.target.value) || 0)}
                          className="w-20 px-2 py-1 font-bold text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 tabular-nums"
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={prod.stock}
                          onChange={(e) => updateProductStock(prod.id, Number(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-center font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 tabular-nums"
                        />
                        <span className="text-[11px] text-slate-400">units</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold w-fit ${
                          prod.approvalStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : prod.approvalStatus === 'pending_admin'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {prod.approvalStatus === 'approved' ? 'Live on Market' : prod.approvalStatus === 'pending_admin' ? 'Needs Approval' : 'Rejected'}
                        </span>

                        {prod.isBoosted && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-bold">
                            <Sparkles className="w-3 h-3" />
                            <span>Boosted</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setProductToRemove(prod)}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Remove listing from platform"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Listing</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Fee & Boost Price Configuration */}
      {activeTab === 'pricing' && (
        <div className="max-w-xl bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Fee & Delivery Rate Controls
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Adjust platform monetization fees and delivery tiers in real time for Punjab University.
            </p>
          </div>

          {priceSaveNotice && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{priceSaveNotice}</span>
            </div>
          )}

          <form onSubmit={handleSavePrices} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Seller Listing Boost Price (1 Month / 30 Days)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  value={boostFeeInput}
                  onChange={(e) => setBoostFeeInput(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none tabular-nums"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Currently configured to ₹{adminSettings.boostFee}. Sellers pay this fee to keep products pinned atop campus searches.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Local PU Hostel Delivery Fee
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  value={localFeeInput}
                  onChange={(e) => setLocalFeeInput(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none tabular-nums"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Charged to buyers for local hostel and campus gate drop-offs (default ₹10).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Regional Delivery Fee (In range of 70 km)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  value={regionalFeeInput}
                  onChange={(e) => setRegionalFeeInput(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none tabular-nums"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Charged for courier or campus delivery across Chandigarh and surrounding clusters within 70 km (default ₹50).
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer shadow-md"
            >
              Update Platform Pricing
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: Complaints & Disputes */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-base font-bold text-slate-900">
              Student Complaints & Feedback Tickets
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review issues raised by students regarding campus handover or product verification.
            </p>
          </div>

          <div className="space-y-4">
            {complaints.map(cmp => (
              <div key={cmp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs">{cmp.studentName}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500">{cmp.college}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-[11px] text-slate-500">{cmp.studentPhone}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 font-medium">{cmp.issue}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {cmp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Campus SMS Broadcast Feed (Admin Console Exclusive) */}
      {activeTab === 'sms' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Campus SMS Broadcast & Delivery Feed
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  Admin Exclusive Stream
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring automated transactional SMS alerts dispatched to Punjab University buyers and sellers.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSmsRoleFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  smsRoleFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({smsNotifications.length})
              </button>
              <button
                type="button"
                onClick={() => setSmsRoleFilter('seller')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  smsRoleFilter === 'seller'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Seller Alerts
              </button>
              <button
                type="button"
                onClick={() => setSmsRoleFilter('buyer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  smsRoleFilter === 'buyer'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Buyer Alerts
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search SMS by phone number, sender, or message keyword..."
              value={smsSearch}
              onChange={(e) => setSmsSearch(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          {/* SMS Feed list */}
          <div className="space-y-3">
            {smsNotifications
              .filter(sms => {
                if (smsRoleFilter !== 'all' && sms.recipientRole !== smsRoleFilter) return false;
                if (smsSearch.trim()) {
                  const q = smsSearch.toLowerCase();
                  return (
                    sms.recipientPhone.toLowerCase().includes(q) ||
                    sms.sender.toLowerCase().includes(q) ||
                    sms.message.toLowerCase().includes(q)
                  );
                }
                return true;
              })
              .map(sms => (
                <div
                  key={sms.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2 hover:bg-white transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{sms.sender}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono text-slate-700 font-semibold">{sms.recipientPhone}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sms.recipientRole === 'seller'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {sms.recipientRole === 'seller' ? 'Seller Notification' : 'Buyer Confirmation'}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(sms.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200/80">
                    {sms.message}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Admin Remove Listing Modal (Proper functioning of remove listing item to admin) */}
      {productToRemove && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Admin: Remove Listing
                </h3>
              </div>
              <button
                onClick={() => setProductToRemove(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to permanently remove this listing from the platform? An automated SMS notice will be sent to the seller.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 mb-4">
              <img
                src={productToRemove.imageUrl}
                alt={productToRemove.title}
                className="w-12 h-12 rounded-lg object-cover border border-slate-300 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">{productToRemove.title}</div>
                <div className="text-[11px] text-slate-500">
                  Seller: <span className="font-semibold text-slate-700">{productToRemove.sellerName}</span> ({productToRemove.sellerPhone})
                </div>
                <div className="text-[11px] text-slate-500">
                  Price: ₹{productToRemove.price} · Punjab University
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Reason for Removal (Sent to Seller)
              </label>
              <input
                type="text"
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
                placeholder="e.g. Inappropriate item, policy mismatch, or duplicate listing"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setProductToRemove(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm & Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
