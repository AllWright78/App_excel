export type Role = 'super_admin' | 'admin' | 'seller' | 'client';

export type LicenseType = 'monthly' | 'annual' | 'lifetime';

export type LicenseStatus = 'active' | 'expired' | 'suspended' | 'cancelled';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'ready' | 'delivered' | 'cancelled' | 'refunded';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded';

export type PaymentMethod = 'flooz' | 'tmoney' | 'card' | 'stripe' | 'cod' | 'bank_transfer';

export interface Transaction {
  id: string;
  transactionReference: string;
  orderId?: string;
  orderNumber?: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  provider: 'flooz' | 'tmoney' | 'stripe' | 'card' | 'bank_transfer' | 'cod';
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  paymentDetails: Record<string, any>;
  gatewayResponse: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type ProductStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'suspended';

export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
  avatar?: string;
  phone?: string;
  country?: string;
  address?: string;
  companyName?: string;
  company?: string;
  commissionRate?: number;
  sellerStatus?: SellerStatus;
  isArchived?: boolean;
  archivedAt?: string | null;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  productCount: number;
}

export interface LicenseOption {
  type: LicenseType;
  label: string;
  durationDays: number | null; // null for lifetime
  price: number; // in FCFA
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  categoryName: string;
  vendorId: string;
  vendorName: string;
  vendorVerified: boolean;
  logo: string;
  gallery: string[];
  features: string[];
  requirements: string[];
  compatibility: string;
  version: string;
  fileSize: string;
  fileFormat: string;
  updatedAt: string;
  salesCount: number;
  rating: number;
  reviewsCount: number;
  status: ProductStatus;
  licenseOptions: {
    monthly?: number;
    annual?: number;
    lifetime?: number;
  };
  defaultLicense: LicenseType;
  basePrice: number; // usually annual or default
  isFeatured?: boolean;
  demoVideoUrl?: string;
  demoVideoTitle?: string;
  demoVideos?: { url: string; title: string }[];
  sourceFileName?: string;
  sourceFileData?: string;
  faqs: { question: string; answer: string }[];
  documentation?: string;
}

export interface CartItem {
  product: Product;
  licenseType: LicenseType;
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productLogo: string;
  licenseType: LicenseType;
  price: number;
  quantity: number;
  licenseKey?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  transactionId: string;
  createdAt: string;
  deliveryNotes?: string;
}

export interface License {
  id: string;
  licenseKey: string;
  productId: string;
  productName: string;
  productSlug: string;
  productLogo: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderId: string;
  orderNumber: string;
  type: LicenseType;
  status: LicenseStatus;
  startDate: string;
  expiresAt: string | null; // null for lifetime
  activationsCount: number;
  maxActivations: number;
  version: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  replies: {
    id: string;
    senderName: string;
    senderRole: 'client' | 'support' | 'admin';
    message: string;
    createdAt: string;
  }[];
}

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
  productId?: string;
  productName?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  expiresAt: string;
  usageCount: number;
  maxUsage?: number;
  isActive: boolean;
}

export interface PayoutRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  method: PaymentMethod;
  paymentDetails: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestedAt: string;
  processedAt?: string;
}

export interface PlatformSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  currencySymbol: string;
  globalCommissionRate: number; // percentage, e.g. 15
  autoApproveProducts: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  floozEnabled: boolean;
  tmoneyEnabled: boolean;
  cardEnabled: boolean;
  cashEnabled: boolean;
}
