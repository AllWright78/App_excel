import {
  Product,
  Category,
  User,
  Order,
  License,
  Coupon,
  PlatformSettings,
  Ticket,
  MessageItem,
  PaymentMethod,
  PaymentStatus,
  LicenseType,
  PayoutRequest,
  Transaction
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_LICENSES,
  INITIAL_COUPONS,
  INITIAL_SETTINGS,
  INITIAL_TICKETS,
  INITIAL_MESSAGES,
  INITIAL_TRANSACTIONS
} from '../data/initialData';

// Local storage keys for persistent client simulation
const STORAGE_PREFIX = 'app_excel_';
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

// Initializing state
let products: Product[] = getStored('products', INITIAL_PRODUCTS);
let categories: Category[] = getStored('categories', INITIAL_CATEGORIES);
let users: User[] = getStored('users', INITIAL_USERS);

// Guarantee super admin exists with requested email and password
const SUPER_ADMIN_EMAILS = ['moumouniabdoulmalik29@gmail.com'];
const adminIdx = users.findIndex(u => u.role === 'super_admin' || SUPER_ADMIN_EMAILS.includes(u.email));
if (adminIdx >= 0) {
  users[adminIdx] = {
    ...users[adminIdx],
    id: 'user-admin',
    name: 'Moumouni Abdoul Malik',
    email: 'moumouniabdoulmalik29@gmail.com',
    role: 'super_admin',
    password: 'Abdoul123@',
    phone: '+228 90 12 34 56',
    country: 'Togo'
  };
  setStored('users', users);
} else {
  users.unshift({
    id: 'user-admin',
    name: 'Moumouni Abdoul Malik',
    email: 'moumouniabdoulmalik29@gmail.com',
    role: 'super_admin',
    password: 'Abdoul123@',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+228 90 12 34 56',
    country: 'Togo',
    address: 'Boulevard du 13 Janvier, Lomé, Togo',
    createdAt: '2025-01-01'
  });
  setStored('users', users);
}

let orders: Order[] = getStored('orders', INITIAL_ORDERS);
let licenses: License[] = getStored('licenses', INITIAL_LICENSES);
let coupons: Coupon[] = getStored('coupons', INITIAL_COUPONS);
let settings: PlatformSettings = getStored('settings', INITIAL_SETTINGS);
let tickets: Ticket[] = getStored('tickets', INITIAL_TICKETS);
let messages: MessageItem[] = getStored('messages', INITIAL_MESSAGES);
let transactions: Transaction[] = getStored('transactions', INITIAL_TRANSACTIONS);
let payouts: PayoutRequest[] = getStored('payouts', [
  {
    id: 'pay-1',
    sellerId: 'user-seller',
    sellerName: 'Tech Solutions SARL',
    amount: 1250000,
    method: 'tmoney',
    paymentDetails: '+228 91 88 77 66 (Togocom TMoney)',
    status: 'paid',
    requestedAt: '2025-05-01',
    processedAt: '2025-05-02'
  }
]);

export const api = {
  // --- Formatters ---
  formatCurrency(amount: number): string {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  },

  // --- Products ---
  async getProducts(params?: {
    category?: string;
    search?: string;
    licenseType?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    includeUnpublished?: boolean;
  }): Promise<{ products: Product[]; total: number }> {
    products = getStored('products', products);
    let result = params?.includeUnpublished
      ? [...products]
      : [...products].filter(p => p.status === 'approved');

    if (params?.category && params.category !== 'all') {
      result = result.filter(p => p.categoryId === params.category || p.categoryName.toLowerCase() === params.category?.toLowerCase());
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q)
      );
    }

    if (params?.licenseType && params.licenseType !== 'all') {
      result = result.filter(p => p.licenseOptions[params.licenseType as LicenseType] !== undefined);
    }

    if (params?.minPrice !== undefined && params.minPrice > 0) {
      result = result.filter(p => p.basePrice >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined && params.maxPrice > 0) {
      result = result.filter(p => p.basePrice <= params.maxPrice!);
    }

    if (params?.sort) {
      if (params.sort === 'popular') result.sort((a, b) => b.salesCount - a.salesCount);
      if (params.sort === 'price_asc') result.sort((a, b) => a.basePrice - b.basePrice);
      if (params.sort === 'price_desc') result.sort((a, b) => b.basePrice - a.basePrice);
      if (params.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
      if (params.sort === 'newest') result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return { products: result, total: result.length };
  },

  async getProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
    products = getStored('products', products);
    const p = products.find(prod => prod.id === idOrSlug || prod.slug === idOrSlug);
    return p || null;
  },

  async createProduct(data: Partial<Product>, vendor?: User): Promise<Product> {
    const slug = data.name ? data.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') : 'app-' + Date.now();
    const effectiveVendor = vendor || users.find(u => u.role === 'seller' || u.role === 'super_admin') || users[0];
    const newProduct: Product = {
      id: 'prod-' + Date.now(),
      slug,
      name: data.name || 'Nouvelle Application',
      shortDescription: data.shortDescription || '',
      description: data.description || '',
      categoryId: data.categoryId || 'cat-excel',
      categoryName: categories.find(c => c.id === data.categoryId)?.name || 'Excel',
      vendorId: effectiveVendor?.id || 'vendor-1',
      vendorName: effectiveVendor?.companyName || effectiveVendor?.name || 'GESTE APP Studio',
      vendorVerified: true,
      logo: data.logo || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
      gallery: data.gallery && data.gallery.length > 0 ? data.gallery : [data.logo || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'],
      features: data.features || ['Facile d’utilisation', 'Feuilles Excel automatisées', 'Support technique inclus'],
      requirements: data.requirements || ['Excel 2016 ou plus récent'],
      compatibility: data.compatibility || 'Windows, Mac',
      version: data.version || '1.0.0',
      fileSize: data.fileSize || '4.0 MB',
      fileFormat: data.fileFormat || '.xlsm',
      updatedAt: new Date().toLocaleDateString('fr-FR'),
      salesCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      status: data.status || (settings.autoApproveProducts ? 'approved' : 'pending_review'),
      licenseOptions: data.licenseOptions || { annual: 45000 },
      defaultLicense: data.defaultLicense || 'annual',
      basePrice: data.basePrice || 45000,
      demoVideoUrl: data.demoVideoUrl || '',
      demoVideoTitle: data.demoVideoTitle || (data.name ? `Démonstration : ${data.name}` : 'Démonstration vidéo'),
      demoVideos: data.demoVideos || (data.demoVideoUrl ? [{
        url: data.demoVideoUrl,
        title: data.demoVideoTitle || (data.name ? `Démonstration : ${data.name}` : 'Démonstration vidéo')
      }] : []),
      sourceFileName: data.sourceFileName || 'Application_Excel.xlsm',
      sourceFileData: data.sourceFileData,
      faqs: data.faqs || []
    };

    products.unshift(newProduct);
    setStored('products', products);
    return newProduct;
  },

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    return categories;
  },

  // --- Coupons ---
  async validateCoupon(code: string, currentTotal: number): Promise<{ valid: boolean; discount: number; message: string; coupon?: Coupon }> {
    const c = coupons.find(item => item.code.toUpperCase() === code.trim().toUpperCase() && item.isActive);
    if (!c) {
      return { valid: false, discount: 0, message: 'Code promo invalide ou expiré.' };
    }
    if (c.minSpend && currentTotal < c.minSpend) {
      return { valid: false, discount: 0, message: `Montant minimum requis de ${c.minSpend.toLocaleString('fr-FR')} FCFA pour ce code.` };
    }

    let discount = 0;
    if (c.type === 'percentage') {
      discount = Math.round((currentTotal * c.value) / 100);
    } else {
      discount = Math.min(c.value, currentTotal);
    }

    return { valid: true, discount, message: `Code ${c.code} appliqué (-${discount.toLocaleString('fr-FR')} FCFA) !`, coupon: c };
  },

  // --- Orders & Payment Processing ---
  async checkout(params: {
    user: User;
    items: { product: Product; licenseType: LicenseType; price: number; quantity: number }[];
    paymentMethod: PaymentMethod;
    couponCode?: string;
    deliveryNotes?: string;
    orderNumber?: string;
    transactionId?: string;
    paymentStatus?: PaymentStatus;
  }): Promise<{ success: boolean; order: Order; newLicenses: License[] }> {
    const subtotal = params.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let discount = 0;

    if (params.couponCode) {
      const check = await this.validateCoupon(params.couponCode, subtotal);
      if (check.valid) discount = check.discount;
    }

    const totalAmount = Math.max(0, subtotal - discount);
    const orderNumber = params.orderNumber || `CMD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const txPrefix = params.paymentMethod === 'flooz' ? 'FLZ-TG-' : params.paymentMethod === 'tmoney' ? 'TMN-TG-' : 'STR-';
    const effectiveTransactionId = params.transactionId || `${txPrefix}${Date.now().toString().slice(-7)}`;

    // Generate licenses for items
    const newLicenses: License[] = [];
    const orderItems = params.items.map((item, idx) => {
      // Key format: EXCEL-[SLUG-3]-[RANDOM-4]-2025-[RANDOM-3]
      const slugKey = item.product.slug.slice(0, 3).toUpperCase();
      const rand1 = Math.floor(1000 + Math.random() * 9000);
      const rand2 = Math.random().toString(36).substring(2, 5).toUpperCase();
      const licenseKey = `EXCEL-${slugKey}-${rand1}-2025-${rand2}`;

      let expiresAt: string | null = null;
      const today = new Date();
      if (item.licenseType === 'monthly') {
        const d = new Date(today);
        d.setDate(d.getDate() + 30);
        expiresAt = d.toISOString().split('T')[0];
      } else if (item.licenseType === 'annual') {
        const d = new Date(today);
        d.setDate(d.getDate() + 365);
        expiresAt = d.toISOString().split('T')[0];
      } // lifetime remains null

      const newLic: License = {
        id: `lic-${Date.now()}-${idx}`,
        licenseKey,
        productId: item.product.id,
        productName: item.product.name,
        productSlug: item.product.slug,
        productLogo: item.product.logo,
        userId: params.user.id,
        userName: params.user.name,
        userEmail: params.user.email,
        orderId: `ord-${Date.now()}`,
        orderNumber,
        type: item.licenseType,
        status: 'active',
        startDate: today.toISOString().split('T')[0],
        expiresAt,
        activationsCount: 1,
        maxActivations: item.licenseType === 'lifetime' ? 5 : 3,
        version: item.product.version
      };

      newLicenses.push(newLic);

      // Increment product sales count
      const prodIndex = products.findIndex(p => p.id === item.product.id);
      if (prodIndex >= 0) {
        products[prodIndex].salesCount += item.quantity;
      }

      return {
        id: `ord-item-${Date.now()}-${idx}`,
        productId: item.product.id,
        productName: item.product.name,
        productLogo: item.product.logo,
        licenseType: item.licenseType,
        price: item.price,
        quantity: item.quantity,
        licenseKey
      };
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: params.user.id,
      userName: params.user.name,
      userEmail: params.user.email,
      userPhone: params.user.phone || '+228 90 00 00 00',
      items: orderItems,
      totalAmount,
      subtotal,
      discountAmount: discount,
      couponCode: params.couponCode,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentStatus || 'success',
      orderStatus: 'delivered',
      transactionId: effectiveTransactionId,
      createdAt: new Date().toLocaleDateString('fr-FR'),
      deliveryNotes: params.deliveryNotes || 'Licence et liens sécurisés générés automatiquement.'
    };

    orders.unshift(newOrder);
    licenses.unshift(...newLicenses);

    setStored('orders', orders);
    setStored('licenses', licenses);
    setStored('products', products);

    return { success: true, order: newOrder, newLicenses };
  },

  async createOrder(params: {
    user: User;
    items: { product: Product; licenseType: LicenseType; price: number; quantity: number }[];
    paymentMethod: PaymentMethod;
    couponCode?: string;
    transactionId: string;
    transactionReference?: string;
    paymentStatus: PaymentStatus;
    deliveryNotes?: string;
    orderNumber?: string;
  }): Promise<{ success: boolean; order: Order; newLicenses: License[] }> {
    if (API_BASE_URL) {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`La commande n’a pas pu être confirmée dans la base de données (${response.status}).`);
      }

      return (await response.json()) as { success: boolean; order: Order; newLicenses: License[] };
    }

    return this.checkout({
      user: params.user,
      items: params.items,
      paymentMethod: params.paymentMethod,
      couponCode: params.couponCode,
      transactionId: params.transactionId,
      paymentStatus: params.paymentStatus,
      deliveryNotes: params.deliveryNotes,
      orderNumber: params.orderNumber
    });
  },

  // --- Transactions & Payment Gateway Audit Log (MySQL Simulation) ---
  async recordTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    if (API_BASE_URL) {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`La transaction n’a pas pu être enregistrée dans la base de données (${response.status}).`);
      }

      return (await response.json()) as Transaction;
    }

    const timestamp = new Date().toLocaleString('fr-FR');
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    transactions.unshift(newTx);
    setStored('transactions', transactions);
    return newTx;
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    if (API_BASE_URL) {
      const response = await fetch(`${API_BASE_URL}/transactions/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`La transaction n’a pas pu être mise à jour dans la base de données (${response.status}).`);
      }

      return (await response.json()) as Transaction;
    }

    const index = transactions.findIndex(t => t.id === id || t.transactionReference === id);
    if (index === -1) throw new Error('Transaction introuvable');

    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toLocaleString('fr-FR')
    };

    setStored('transactions', transactions);
    return transactions[index];
  },

  async getAllTransactions(): Promise<Transaction[]> {
    return transactions;
  },

  async getTransactionsByUser(userId: string): Promise<Transaction[]> {
    return transactions.filter(t => t.userId === userId);
  },

  async getTransactionById(id: string): Promise<Transaction | null> {
    return transactions.find(t => t.id === id || t.transactionReference === id) || null;
  },

  // --- Licenses & Verification Engine (Section 36) ---
  async getLicensesByUser(userId: string): Promise<License[]> {
    return licenses.filter(lic => lic.userId === userId);
  },

  async getAllLicenses(): Promise<License[]> {
    return licenses;
  },

  /**
   * API spec Section 36:
   * POST /api/license/verify
   * Request body: { licenseKey: string, productSlug?: string, machineFingerprint?: string }
   */
  async verifyLicenseKey(licenseKey: string, productSlug?: string): Promise<{
    valid: boolean;
    status: 'active' | 'expired' | 'suspended' | 'not_found';
    message: string;
    productName?: string;
    licenseType?: LicenseType;
    expiresAt?: string | null;
    activations?: { current: number; max: number };
  }> {
    const lic = licenses.find(l => l.licenseKey.trim().toUpperCase() === licenseKey.trim().toUpperCase());

    if (!lic) {
      return {
        valid: false,
        status: 'not_found',
        message: 'Clé de licence introuvable dans la base de données GESTE APP.'
      };
    }

    if (productSlug && lic.productSlug !== productSlug && lic.productId !== productSlug) {
      return {
        valid: false,
        status: 'suspended',
        message: `Cette licence appartient au produit "${lic.productName}" et non à l'application demandée.`
      };
    }

    if (lic.status === 'suspended') {
      return {
        valid: false,
        status: 'suspended',
        message: 'Cette licence a été temporairement suspendue par l’administrateur.',
        productName: lic.productName
      };
    }

    if (lic.expiresAt) {
      const exp = new Date(lic.expiresAt);
      const now = new Date();
      if (now > exp) {
        return {
          valid: false,
          status: 'expired',
          message: `Licence expirée depuis le ${lic.expiresAt}. Veuillez la renouveler sur GESTE APP.`,
          productName: lic.productName,
          expiresAt: lic.expiresAt
        };
      }
    }

    return {
      valid: true,
      status: 'active',
      message: 'Licence valide et active.',
      productName: lic.productName,
      licenseType: lic.type,
      expiresAt: lic.expiresAt,
      activations: {
        current: lic.activationsCount,
        max: lic.maxActivations
      }
    };
  },

  async renewLicense(licenseId: string, extensionDays: number = 365): Promise<License> {
    const licIndex = licenses.findIndex(l => l.id === licenseId);
    if (licIndex === -1) throw new Error('Licence introuvable');

    const lic = licenses[licIndex];
    const baseDate = lic.expiresAt && new Date(lic.expiresAt) > new Date() ? new Date(lic.expiresAt) : new Date();
    baseDate.setDate(baseDate.getDate() + extensionDays);

    lic.expiresAt = baseDate.toISOString().split('T')[0];
    lic.status = 'active';

    licenses[licIndex] = lic;
    setStored('licenses', licenses);
    return lic;
  },

  // --- Orders ---
  async getOrdersByUser(userId: string): Promise<Order[]> {
    return orders.filter(o => o.userId === userId);
  },

  async getAllOrders(): Promise<Order[]> {
    return orders;
  },

  // --- Seller Dashboard Data (Section 15) ---
  async getSellerStats(sellerId: string) {
    const sellerProducts = products.filter(p => p.vendorId === sellerId);
    const totalSalesCount = sellerProducts.reduce((acc, p) => acc + p.salesCount, 0);
    const totalGross = sellerProducts.reduce((acc, p) => acc + p.salesCount * p.basePrice, 0);
    const commissionRate = settings.globalCommissionRate / 100;
    const commissionAmount = Math.round(totalGross * commissionRate);
    const netEarnings = totalGross - commissionAmount;

    return {
      totalSales: totalSalesCount || 125,
      totalRevenue: totalGross || 3250000,
      totalCommissions: commissionAmount || 275000,
      netRevenue: netEarnings || 2975000,
      productsCount: sellerProducts.length || 12,
      products: sellerProducts,
      recentSales: [
        { date: '10 Mai', sales: 12 },
        { date: '11 Mai', sales: 19 },
        { date: '12 Mai', sales: 14 },
        { date: '13 Mai', sales: 25 },
        { date: '14 Mai', sales: 22 },
        { date: '15 Mai', sales: 32 },
        { date: '16 Mai', sales: 28 },
      ]
    };
  },

  async requestSellerPayout(sellerId: string, sellerName: string, amount: number, method: PaymentMethod, details: string): Promise<PayoutRequest> {
    const newPayout: PayoutRequest = {
      id: `pay-${Date.now()}`,
      sellerId,
      sellerName,
      amount,
      method,
      paymentDetails: details,
      status: 'pending',
      requestedAt: new Date().toLocaleDateString('fr-FR')
    };
    payouts.unshift(newPayout);
    setStored('payouts', payouts);
    return newPayout;
  },

  async getSellerPayouts(sellerId: string): Promise<PayoutRequest[]> {
    return payouts.filter(p => p.sellerId === sellerId);
  },

  // --- Admin Dashboard Data (Section 17 & 18) ---
  async getAdminStats() {
    const totalRevenue = 142500000;
    const commissions = 12800000;
    const vendorPayouts = 8250000;
    const activeClientsCount = users.filter(u => u.role === 'client').length + 1245;
    const vendorsCount = users.filter(u => u.role === 'seller').length + 235;

    return {
      totalRevenue,
      commissions,
      vendorPayouts,
      usersCount: activeClientsCount,
      vendorsCount,
      totalProducts: products.length,
      activeLicenses: licenses.filter(l => l.status === 'active').length + 840,
      salesByMonth: [
        { month: 'Jan', sales: 3500000 },
        { month: 'Fév', sales: 5200000 },
        { month: 'Mar', sales: 7800000 },
        { month: 'Avr', sales: 8900000 },
        { month: 'Mai', sales: 11400000 },
        { month: 'Juin', sales: 13200000 },
        { month: 'Juil', sales: 15600000 },
        { month: 'Août', sales: 14800000 },
        { month: 'Sept', sales: 18200000 },
        { month: 'Oct', sales: 19500000 },
        { month: 'Nov', sales: 21800000 },
        { month: 'Déc', sales: 24500000 }
      ],
      categoriesDistribution: [
        { name: 'Excel', value: 32, color: '#10b981' },
        { name: 'Gestion', value: 22, color: '#047857' },
        { name: 'Comptabilité', value: 15, color: '#3b82f6' },
        { name: 'Éducation', value: 10, color: '#f59e0b' },
        { name: 'Commerce', value: 8, color: '#ec4899' },
        { name: 'Autres', value: 13, color: '#6b7280' }
      ]
    };
  },

  async getAllUsers(): Promise<User[]> {
    return users;
  },

  async toggleUserSuspension(userId: string): Promise<User> {
    const u = users.find(user => user.id === userId);
    if (!u) throw new Error('Utilisateur non trouvé');
    u.sellerStatus = u.sellerStatus === 'suspended' ? 'approved' : 'suspended';
    setStored('users', users);
    return u;
  },

  async archiveUser(userId: string, isArchived = true): Promise<User> {
    const target = users.find(user => user.id === userId);
    if (!target) throw new Error('Utilisateur non trouvé');
    if (target.role === 'super_admin') {
      throw new Error('Impossible d’archiver le compte Super Administrateur principal.');
    }

    target.isArchived = isArchived;
    target.archivedAt = isArchived ? new Date().toISOString() : null;
    setStored('users', users);
    return target;
  },

  async createUser(userData: {
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'seller' | 'client' | 'vendeur';
    password?: string;
    phone?: string;
    companyName?: string;
    company?: string;
    country?: string;
    address?: string;
    commissionRate?: number;
  }): Promise<User> {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error(`Un compte avec l'adresse email ${userData.email} existe déjà.`);
    }

    const normalizedRole = userData.role === 'vendeur' ? 'seller' : userData.role;
    const company = userData.companyName || userData.company || (normalizedRole === 'seller' ? `${userData.name} EURL` : undefined);

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      role: normalizedRole as any,
      password: userData.password || 'MotDePasse2025!',
      phone: userData.phone || '+228 90 00 00 00',
      companyName: company,
      country: userData.country || 'Togo',
      address: userData.address || 'Lomé, Togo',
      sellerStatus: normalizedRole === 'seller' ? 'approved' : undefined,
      isArchived: false,
      archivedAt: null,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    setStored('users', users);
    return newUser;
  },

  async deleteUser(userId: string): Promise<boolean> {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'super_admin') {
      throw new Error('Impossible de supprimer le compte Super Administrateur principal.');
    }
    users = users.filter(u => u.id !== userId);
    setStored('users', users);
    return true;
  },

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('Utilisateur non trouvé');

    const normalizedData = { ...data } as Partial<User>;
    if ((normalizedData.role as any) === 'vendeur') {
      normalizedData.role = 'seller';
    }

    users[idx] = {
      ...users[idx],
      ...normalizedData,
      isArchived: normalizedData.isArchived ?? users[idx].isArchived ?? false,
      archivedAt: normalizedData.archivedAt ?? users[idx].archivedAt ?? null
    };
    setStored('users', users);
    return users[idx];
  },

  async approveProduct(productId: string): Promise<Product> {
    const p = products.find(prod => prod.id === productId);
    if (!p) throw new Error('Produit introuvable');
    p.status = 'approved';
    setStored('products', products);
    return p;
  },

  async rejectProduct(productId: string): Promise<Product> {
    const p = products.find(prod => prod.id === productId);
    if (!p) throw new Error('Produit introuvable');
    p.status = 'rejected';
    setStored('products', products);
    return p;
  },

  async deleteProduct(productId: string): Promise<boolean> {
    products = getStored('products', products);
    const productExists = products.some(product => product.id === productId);
    if (!productExists) {
      throw new Error('Produit introuvable');
    }

    products = products.filter(product => product.id !== productId);
    setStored('products', products);
    return true;
  },

  async updateSettings(newSettings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    settings = { ...settings, ...newSettings };
    setStored('settings', settings);
    return settings;
  },

  async getSettings(): Promise<PlatformSettings> {
    return settings;
  },

  // --- Support Tickets ---
  async getTickets(): Promise<Ticket[]> {
    return tickets;
  },

  async createTicket(ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'replies'>): Promise<Ticket> {
    const newTicket: Ticket = {
      ...ticket,
      id: `t-${Date.now()}`,
      ticketNumber: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleString('fr-FR'),
      updatedAt: new Date().toLocaleString('fr-FR'),
      replies: []
    };
    tickets.unshift(newTicket);
    setStored('tickets', tickets);
    return newTicket;
  },

  async replyTicket(ticketId: string, reply: { senderName: string; senderRole: 'client' | 'support' | 'admin'; message: string }): Promise<Ticket> {
    const t = tickets.find(ticket => ticket.id === ticketId);
    if (!t) throw new Error('Ticket introuvable');
    t.replies.push({
      id: `r-${Date.now()}`,
      ...reply,
      createdAt: new Date().toLocaleString('fr-FR')
    });
    t.updatedAt = new Date().toLocaleString('fr-FR');
    setStored('tickets', tickets);
    return t;
  },

  // --- Messaging ---
  async getMessages(userId: string): Promise<MessageItem[]> {
    return messages.filter(m => m.senderId === userId || m.receiverId === userId);
  },

  async sendMessage(sender: User, receiverId: string, receiverName: string, content: string, productId?: string, productName?: string): Promise<MessageItem> {
    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      senderId: sender.id,
      senderName: sender.name,
      receiverId,
      receiverName,
      content,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      productId,
      productName
    };
    messages.push(newMsg);
    setStored('messages', messages);
    return newMsg;
  },

  // --- Downloads (Protected Links Section 12) ---
  createSecureDownloadUrl(licenseKey: string, productId: string): string {
    // Generate secure timed token simulation
    const token = btoa(`${licenseKey}:${productId}:${Date.now() + 3600000}`);
    return `#/download?token=${encodeURIComponent(token)}&key=${encodeURIComponent(licenseKey)}`;
  }
};
