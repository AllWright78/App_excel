import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CartItem, Product, LicenseType, Coupon } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  coupon: Coupon | null;
  couponError: string | null;
  addToCart: (product: Product, licenseType?: LicenseType) => void;
  removeFromCart: (productId: string, licenseType: LicenseType) => void;
  updateQuantity: (productId: string, licenseType: LicenseType, quantity: number) => void;
  updateLicenseType: (productId: string, oldType: LicenseType, newType: LicenseType) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const loadedCartUserId = useRef<string | null | undefined>(undefined);

  const cartStorageKey = user ? `app_excel_cart_${user.id}` : null;
  const couponStorageKey = user ? `app_excel_cart_coupon_${user.id}` : null;

  useEffect(() => {
    if (loadedCartUserId.current === user?.id) return;

    if (!user) {
      setItems([]);
      setCoupon(null);
      setCouponError(null);
      loadedCartUserId.current = null;
      return;
    }

    const savedItems = cartStorageKey ? localStorage.getItem(cartStorageKey) : null;
    const savedCoupon = couponStorageKey ? localStorage.getItem(couponStorageKey) : null;
    try {
      setItems(savedItems ? JSON.parse(savedItems) as CartItem[] : []);
      setCoupon(savedCoupon ? JSON.parse(savedCoupon) as Coupon : null);
    } catch {
      setItems([]);
      setCoupon(null);
    }
    setCouponError(null);
    loadedCartUserId.current = user.id;
  }, [user, cartStorageKey, couponStorageKey]);

  useEffect(() => {
    if (!user || loadedCartUserId.current !== user.id || !cartStorageKey) return;
    localStorage.setItem(cartStorageKey, JSON.stringify(items));
  }, [items, user, cartStorageKey]);

  useEffect(() => {
    if (!user || loadedCartUserId.current !== user.id || !couponStorageKey) return;
    if (coupon) {
      localStorage.setItem(couponStorageKey, JSON.stringify(coupon));
    } else {
      localStorage.removeItem(couponStorageKey);
    }
  }, [coupon, user, couponStorageKey]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discount = Math.min(coupon.value, subtotal);
    }
  }

  const total = Math.max(0, subtotal - discount);

  const addToCart = (product: Product, licenseType?: LicenseType) => {
    const chosenType = licenseType || product.defaultLicense || 'annual';
    let price = product.basePrice;
    if (chosenType === 'monthly' && product.licenseOptions.monthly) price = product.licenseOptions.monthly;
    if (chosenType === 'annual' && product.licenseOptions.annual) price = product.licenseOptions.annual;
    if (chosenType === 'lifetime' && product.licenseOptions.lifetime) price = product.licenseOptions.lifetime;

    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.licenseType === chosenType);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.licenseType === chosenType
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, licenseType: chosenType, price, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, licenseType: LicenseType) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.licenseType === licenseType)));
  };

  const updateQuantity = (productId: string, licenseType: LicenseType, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, licenseType);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.product.id === productId && i.licenseType === licenseType
          ? { ...i, quantity }
          : i
      )
    );
  };

  const updateLicenseType = (productId: string, oldType: LicenseType, newType: LicenseType) => {
    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId && item.licenseType === oldType) {
          let newPrice = item.price;
          if (newType === 'monthly' && item.product.licenseOptions.monthly) newPrice = item.product.licenseOptions.monthly;
          if (newType === 'annual' && item.product.licenseOptions.annual) newPrice = item.product.licenseOptions.annual;
          if (newType === 'lifetime' && item.product.licenseOptions.lifetime) newPrice = item.product.licenseOptions.lifetime;
          return { ...item, licenseType: newType, price: newPrice };
        }
        return item;
      })
    );
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    const res = await api.validateCoupon(code, subtotal);
    if (res.valid && res.coupon) {
      setCoupon(res.coupon);
      return true;
    } else {
      setCouponError(res.message);
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        total,
        coupon,
        couponError,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateLicenseType,
        applyCoupon,
        removeCoupon,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
