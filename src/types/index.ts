export type ProductCategory = 
  | 'Textbooks' 
  | 'Calculators' 
  | 'Electronics' 
  | 'Shoes' 
  | 'Hostel Essentials'
  | 'Handmade Items';

export type ProductCondition = 'Like New' | 'Good' | 'Fair';

export type ProductApprovalStatus = 'pending_admin' | 'approved' | 'rejected';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  finalPrice?: number;
  sellerSuggestedPrice: number;
  condition: ProductCondition;
  college: string;
  hostelOrDept?: string;
  sellerPhone: string;
  sellerName: string;
  imageUrl: string;
  images?: string[];
  isBoosted: boolean;
  boostedUntil?: string;
  stock: number;
  status: 'available' | 'sold';
  approvalStatus: ProductApprovalStatus;
  adminNotes?: string;
  createdAt: string;
}

export type DeliveryType = 'pickup' | 'local' | 'regional_70km';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  buyerPhone: string;
  buyerName: string;
  college: string;
  deliveryAddress: string;
  hostelAddress?: string;
  deliveryType: DeliveryType;
  deliveryFee: number;
  subtotal: number;
  totalAmount: number;
  paymentMode: 'Cash on Delivery';
  status: OrderStatus;
  sellerNotifiedForReview: boolean;
  createdAt: string;
}

export type GigCategory = 'presentation' | 'graphic_design' | 'tutoring' | 'mentoring_chat' | 'craft_workshop' | 'other';

export interface ServiceGig {
  id: string;
  providerName: string;
  providerPhone: string;
  college: string;
  hostelOrDept?: string;
  title: string;
  category: GigCategory;
  price: number;
  priceUnit: string;
  description: string;
  rating: number;
  completedGigs: number;
}

export interface AdminSettings {
  boostFee: number;
  localDeliveryFee: number;
  regionalDeliveryFee: number;
}

export interface SMSNotification {
  id: string;
  recipientPhone: string;
  recipientRole: 'seller' | 'buyer';
  sender: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  orderId?: string;
}

export interface ChatMessage {
  id: string;
  productId: string;
  senderPhone: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export type ActivePortal = 'gateway' | 'buyer' | 'seller' | 'admin' | 'gigs';
