import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, LicenseType, Coupon } from '../types';
import { api } from '../services/api';

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
  // Initialize with the sample cart matching the user's mockup image if empty
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('app_excel_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [coupon, setCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('app_excel_cart_coupon');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('app_excel_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('app_excel_cart_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('app_excel_cart_coupon');
    }
  }, [coupon]);

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
