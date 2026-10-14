import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  DeliveryType, 
  ServiceGig, 
  AdminSettings, 
  SMSNotification, 
  ChatMessage,
  ActivePortal,
  ProductApprovalStatus
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_GIGS, 
  INITIAL_SETTINGS, 
  INITIAL_ORDERS,
  UNIVERSITY_INFO
} from '../data/initialData';

export interface UserSession {
  phone: string;
  name: string;
  college: string;
  hostelOrDept?: string;
  role: 'buyer' | 'seller';
}

interface AppContextType {
  activePortal: ActivePortal;
  setActivePortal: (portal: ActivePortal) => void;
  currentUser: UserSession | null;
  loginUser: (phone: string, name: string, college: string, role: 'buyer' | 'seller') => void;
  logoutUser: () => void;
  universityInfo: {
    name: string;
    shortName: string;
    hostels: string[];
  };
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'isBoosted' | 'status' | 'approvalStatus'>) => Product;
  adminApproveProduct: (productId: string, finalPrice: number, adminNotes?: string) => void;
  adminRejectProduct: (productId: string, reason?: string) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  boostProduct: (productId: string) => boolean;
  updateProductStock: (productId: string, stock: number) => void;
  deleteProduct: (productId: string) => void;
  adminRemoveProduct: (productId: string, reason?: string) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (details: {
    buyerPhone: string;
    buyerName: string;
    college?: string;
    deliveryAddress?: string;
    hostelAddress?: string;
    deliveryType: DeliveryType;
  }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  smsNotifications: SMSNotification[];
  markSmsAsRead: (id: string) => void;
  adminSettings: AdminSettings;
  updateAdminSettings: (newSettings: Partial<AdminSettings>) => void;
  serviceGigs: ServiceGig[];
  addServiceGig: (gig: Omit<ServiceGig, 'id' | 'rating' | 'completedGigs'>) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (productId: string, text: string, senderPhone: string, senderName: string) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (val: boolean) => void;
  selectedCollege: string;
  setSelectedCollege: (college: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSmsModalOpen: boolean;
  setIsSmsModalOpen: (open: boolean) => void;
  activeChatProduct: Product | null;
  setActiveChatProduct: (prod: Product | null) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePortal, setActivePortal] = useState<ActivePortal>('gateway');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('unitrade_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('unitrade_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const filtered = parsed
          .filter(p => !p.college || p.college === 'Punjab University' || p.college === 'Panjab University')
          .map(p => ({
            ...p,
            college: 'Punjab University',
            approvalStatus: p.approvalStatus || 'approved',
            sellerSuggestedPrice: p.sellerSuggestedPrice || p.price,
            images: p.images || [p.imageUrl],
            finalPrice: p.finalPrice || p.price
          }));
        if (filtered.length > 0) return filtered;
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('unitrade_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('unitrade_orders');
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        const filtered = parsed
          .filter(o => !o.college || o.college === 'Punjab University' || o.college === 'Panjab University')
          .map(o => ({
            ...o,
            college: 'Punjab University'
          }));
        if (filtered.length > 0) return filtered;
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    try {
      const saved = localStorage.getItem('unitrade_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [serviceGigs, setServiceGigs] = useState<ServiceGig[]>(() => {
    try {
      const saved = localStorage.getItem('unitrade_gigs');
      return saved ? JSON.parse(saved) : INITIAL_GIGS;
    } catch {
      return INITIAL_GIGS;
    }
  });

  const [smsNotifications, setSmsNotifications] = useState<SMSNotification[]>(() => {
    try {
      const saved = localStorage.getItem('unitrade_sms');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'sms-welcome',
          recipientPhone: '9876543210',
          recipientRole: 'seller',
          sender: 'UniTrade-HQ',
          message: 'Welcome to UniTrade Campus Hub! List your used textbooks, electronics, calculators, and handmade dorm crafts.',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          isRead: true
        },
        {
          id: 'sms-init-delivery',
          recipientPhone: '9811223344',
          recipientRole: 'seller',
          sender: 'UniTrade-Delivery',
          message: 'UniTrade Alert: Order #ORD-7714 for Handmade Macrame Coaster Set has been DELIVERED to Sneha Gupta. How was your experience? Reply with your rating (1-5★).',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          isRead: false,
          orderId: 'ORD-7714'
        }
      ];
    } catch {
      return [];
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('unitrade_chats');
      return saved ? JSON.parse(saved) : [
        {
          id: 'chat-1',
          productId: 'prod-1',
          senderPhone: '9900112233',
          senderName: 'Rahul (Buyer)',
          text: 'Hi! Is the solution manual included with this physics book?',
          timestamp: 'Yesterday, 4:15 PM'
        },
        {
          id: 'chat-2',
          productId: 'prod-1',
          sellerPhone: '9876543210',
          senderPhone: '9876543210',
          senderName: 'Arjun (Seller)',
          text: 'Yes! Tutorial sheet printouts with solved numericals are tucked in the back.',
          timestamp: 'Yesterday, 4:22 PM'
        }
      ];
    } catch {
      return [];
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [selectedCollege, setSelectedCollege] = useState<string>('All Campuses');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState<boolean>(false);
  const [activeChatProduct, setActiveChatProduct] = useState<Product | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('unitrade_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('unitrade_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('unitrade_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('unitrade_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  useEffect(() => {
    localStorage.setItem('unitrade_gigs', JSON.stringify(serviceGigs));
  }, [serviceGigs]);

  useEffect(() => {
    localStorage.setItem('unitrade_sms', JSON.stringify(smsNotifications));
  }, [smsNotifications]);

  useEffect(() => {
    localStorage.setItem('unitrade_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('unitrade_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('unitrade_user');
    }
  }, [currentUser]);

  const loginUser = (phone: string, name: string, college: string, role: 'buyer' | 'seller') => {
    const user: UserSession = { phone, name, college, hostelOrDept: college, role };
    setCurrentUser(user);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'isBoosted' | 'status' | 'approvalStatus'>) => {
    const suggestedPrice = productData.sellerSuggestedPrice || productData.price;
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      sellerSuggestedPrice: suggestedPrice,
      price: suggestedPrice,
      isBoosted: false,
      status: 'available',
      approvalStatus: 'pending_admin',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProduct, ...prev]);

    // Send confirmation SMS to seller explaining that product goes to admin for price review & approval
    const sellerSms: SMSNotification = {
      id: `sms-${Date.now()}`,
      recipientPhone: productData.sellerPhone,
      recipientRole: 'seller',
      sender: 'UniTrade-AdminReview',
      message: `Listing Submitted: "${newProduct.title.slice(0, 25)}..." has been received. UniTrade Admin will verify and set the final marketplace selling price before publishing.`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setSmsNotifications(prev => [sellerSms, ...prev]);

    return newProduct;
  };

  const adminApproveProduct = (productId: string, finalPrice: number, adminNotes?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          price: finalPrice,
          approvalStatus: 'approved' as const,
          adminNotes: adminNotes || p.adminNotes
        };
      }
      return p;
    }));

    const prod = products.find(p => p.id === productId);
    if (prod) {
      const approvalSms: SMSNotification = {
        id: `sms-appr-${Date.now()}`,
        recipientPhone: prod.sellerPhone,
        recipientRole: 'seller',
        sender: 'UniTrade-Admin',
        message: `Listing Approved! Admin has approved your item "${prod.title.slice(0, 25)}..." with verified price ₹${finalPrice}. It is now ACTIVE and live for buyers on ${prod.college} marketplace!`,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setSmsNotifications(prev => [approvalSms, ...prev]);
    }
  };

  const adminRejectProduct = (productId: string, reason?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          approvalStatus: 'rejected' as const,
          adminNotes: reason || 'Listing rejected by admin.'
        };
      }
      return p;
    }));

    const prod = products.find(p => p.id === productId);
    if (prod) {
      const rejectSms: SMSNotification = {
        id: `sms-rej-${Date.now()}`,
        recipientPhone: prod.sellerPhone,
        recipientRole: 'seller',
        sender: 'UniTrade-Admin',
        message: `Admin Notice: Your listing "${prod.title.slice(0, 25)}..." could not be approved. Reason: ${reason || 'Does not match campus criteria'}. You can update and resubmit anytime.`,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setSmsNotifications(prev => [rejectSms, ...prev]);
    }
  };

  const updateProductPrice = (productId: string, newPrice: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: newPrice } : p));
  };

  const boostProduct = (productId: string): boolean => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    const expiryStr = expiry.toISOString().split('T')[0];

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          isBoosted: true,
          boostedUntil: expiryStr
        };
      }
      return p;
    }));

    // Add confirmation notification
    const product = products.find(p => p.id === productId);
    if (product) {
      const newSms: SMSNotification = {
        id: `sms-${Date.now()}`,
        recipientPhone: product.sellerPhone,
        recipientRole: 'seller',
        sender: 'UniTrade-Boost',
        message: `Boost Activated! Your listing "${product.title.slice(0, 30)}..." is boosted for 30 days (Fee: ₹${adminSettings.boostFee}). It is now prioritized atop all campus search results with a featured badge.`,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setSmsNotifications(prev => [newSms, ...prev]);
    }
    return true;
  };

  const updateProductStock = (productId: string, stock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stock,
          status: stock <= 0 ? 'sold' : 'available'
        };
      }
      return p;
    }));
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.product.id !== productId));

    if (prod) {
      const delSms: SMSNotification = {
        id: `sms-del-${Date.now()}`,
        recipientPhone: prod.sellerPhone,
        recipientRole: 'seller',
        sender: 'UniTrade-Inventory',
        message: `Listing Deleted: "${prod.title.slice(0, 25)}..." has been permanently removed from your seller listings and unlisted from Punjab University marketplace.`,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setSmsNotifications(prev => [delSms, ...prev]);
    }
  };

  const adminRemoveProduct = (productId: string, reason?: string) => {
    const prod = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.product.id !== productId));

    if (prod) {
      const adminDelSms: SMSNotification = {
        id: `sms-adm-del-${Date.now()}`,
        recipientPhone: prod.sellerPhone,
        recipientRole: 'seller',
        sender: 'UniTrade-Admin',
        message: `Admin Notice: Your listing "${prod.title.slice(0, 25)}..." has been removed by campus administration. Reason: ${reason || 'Item removed per campus standards / seller request'}.`,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      setSmsNotifications(prev => [adminDelSms, ...prev]);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (details: {
    buyerPhone: string;
    buyerName: string;
    college?: string;
    deliveryAddress?: string;
    hostelAddress?: string;
    deliveryType: DeliveryType;
  }) => {
    if (cart.length === 0) return null;

    let deliveryFee = 0;
    if (details.deliveryType === 'local') {
      deliveryFee = adminSettings.localDeliveryFee;
    } else if (details.deliveryType === 'regional_70km') {
      deliveryFee = adminSettings.regionalDeliveryFee;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const totalAmount = subtotal + deliveryFee;

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const address = details.deliveryAddress || details.hostelAddress || 'Campus Room';
    const college = details.college || 'Punjab University';

    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      buyerPhone: details.buyerPhone,
      buyerName: details.buyerName,
      college,
      deliveryAddress: address,
      hostelAddress: address,
      deliveryType: details.deliveryType,
      deliveryFee,
      subtotal,
      totalAmount,
      paymentMode: 'Cash on Delivery',
      status: 'pending',
      sellerNotifiedForReview: false,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Send instant SMS to buyer
    const buyerSms: SMSNotification = {
      id: `sms-b-${Date.now()}`,
      recipientPhone: details.buyerPhone,
      recipientRole: 'buyer',
      sender: 'UniTrade-Order',
      message: `Order #${orderId} Confirmed! Total payable upon delivery via Cash on Delivery: ₹${totalAmount}. Campus delivery team is dispatching soon.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      orderId
    };

    // Send notifications to all unique sellers of the products
    const sellerPhones = Array.from(new Set(cart.map(c => c.product.sellerPhone)));
    const sellerSmsList: SMSNotification[] = sellerPhones.map((phone, index) => ({
      id: `sms-s-${Date.now()}-${index}`,
      recipientPhone: phone,
      recipientRole: 'seller',
      sender: 'UniTrade-Sales',
      message: `Campus Buyer Alert: An order #${orderId} was placed for your listed item by student ${details.buyerName} (${details.college}). Prepare the product for campus delivery/handover.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      orderId
    }));

    setSmsNotifications(prev => [buyerSms, ...sellerSmsList, ...prev]);

    // Update stock
    cart.forEach(cartItem => {
      updateProductStock(cartItem.product.id, Math.max(0, cartItem.product.stock - cartItem.quantity));
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const wasDelivered = order.status === 'delivered';
      const isNowDelivered = newStatus === 'delivered';

      // Send SMS review trigger to seller if transitioning to 'delivered'
      if (!wasDelivered && isNowDelivered && !order.sellerNotifiedForReview) {
        const uniqueSellers = Array.from(new Set(order.items.map(i => ({
          phone: i.product.sellerPhone,
          name: i.product.sellerName,
          title: i.product.title
        }))));

        const reviewNotifications: SMSNotification[] = uniqueSellers.map((s, idx) => ({
          id: `sms-rev-${Date.now()}-${idx}`,
          recipientPhone: s.phone,
          recipientRole: 'seller',
          sender: 'UniTrade-Delivery',
          message: `Delivery Complete! Order #${order.id} for "${s.title.slice(0, 30)}..." has been handed over to ${order.buyerName}. Please rate your delivery service & leave a quick student review to unlock instant payout!`,
          timestamp: new Date().toISOString(),
          isRead: false,
          orderId: order.id
        }));

        setSmsNotifications(prevSms => [...reviewNotifications, ...prevSms]);

        return {
          ...order,
          status: newStatus,
          sellerNotifiedForReview: true
        };
      }

      return {
        ...order,
        status: newStatus
      };
    }));
  };

  const markSmsAsRead = (id: string) => {
    setSmsNotifications(prev => prev.map(sms => sms.id === id ? { ...sms, isRead: true } : sms));
  };

  const updateAdminSettings = (newSettings: Partial<AdminSettings>) => {
    setAdminSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addServiceGig = (gig: Omit<ServiceGig, 'id' | 'rating' | 'completedGigs'>) => {
    const newGig: ServiceGig = {
      ...gig,
      id: `gig-${Date.now()}`,
      rating: 5.0,
      completedGigs: 1
    };
    setServiceGigs(prev => [newGig, ...prev]);
  };

  const sendChatMessage = (productId: string, text: string, senderPhone: string, senderName: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      productId,
      senderPhone,
      senderName,
      text,
      timestamp: 'Just now'
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const resetAllData = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setServiceGigs(INITIAL_GIGS);
    setAdminSettings(INITIAL_SETTINGS);
    setCart([]);
    setCurrentUser(null);
    setIsAdminAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{
        activePortal,
        setActivePortal,
        currentUser,
        loginUser,
        logoutUser,
        universityInfo: UNIVERSITY_INFO,
        products,
        addProduct,
        adminApproveProduct,
        adminRejectProduct,
        updateProductPrice,
        boostProduct,
        updateProductStock,
        deleteProduct,
        adminRemoveProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        placeOrder,
        updateOrderStatus,
        smsNotifications,
        markSmsAsRead,
        adminSettings,
        updateAdminSettings,
        serviceGigs,
        addServiceGig,
        chatMessages,
        sendChatMessage,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        selectedCollege,
        setSelectedCollege,
        isCartOpen,
        setIsCartOpen,
        isSmsModalOpen,
        setIsSmsModalOpen,
        activeChatProduct,
        setActiveChatProduct,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
