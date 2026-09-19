import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LicenseType, Product } from '../types';
import { VideoDemoModal } from '../components/common/VideoDemoModal';
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  Tag,
  CheckCircle2,
  X,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Play,
  UserPlus
} from 'lucide-react';

interface CartPageProps {
  navigate: (route: string, param?: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const { user, openAuthModal } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    total,
    coupon,
    couponError,
    removeFromCart,
    updateQuantity,
    updateLicenseType,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCart();

  const [selectedProductForVideo, setSelectedProductForVideo] = useState<Product | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    const success = await applyCoupon(couponInput.trim());
    if (success) {
      setCouponInput('');
    }
    setCouponLoading(false);
  };

  const getLicenseLabel = (type: LicenseType) => {
    switch (type) {
      case 'monthly': return 'Mensuelle (30 jours)';
      case 'annual': return 'Annuelle (365 jours)';
      case 'lifetime': return 'Achat unique (à vie)';
      default: return type;
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Votre panier est actuellement vide</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Explorez notre marketplace pour ajouter des applications Excel, des logiciels de gestion ou des tableaux de bord automatisés.
        </p>
        <button
          onClick={() => navigate('applications')}
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all"
        >
          Découvrir les applications
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header (Matches Mockup) */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Mon panier ({itemCount} {itemCount > 1 ? 'articles' : 'article'})
        </h1>
        <p className="text-sm text-slate-500">
          Vérifiez vos articles avant de procéder au paiement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 shadow-xs overflow-hidden">
            {items.map(item => (
              <div
                key={`${item.product.id}-${item.licenseType}`}
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Logo / Icon */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <FileSpreadsheet className="w-7 h-7 text-emerald-100" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      {item.product.name}
                    </h3>
                    
                    {/* License selector dropdown directly in cart */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Licence :</span>
                      <select
                        value={item.licenseType}
                        onChange={e => updateLicenseType(item.product.id, item.licenseType, e.target.value as LicenseType)}
                        className="bg-slate-50 border border-slate-200 text-xs font-semibold text-emerald-700 rounded-lg px-2 py-1 focus:outline-hidden"
                      >
                        {item.product.licenseOptions.monthly && (
                          <option value="monthly">
                            Mensuelle (30 jours) - {api.formatCurrency(item.product.licenseOptions.monthly)}
                          </option>
                        )}
                        {item.product.licenseOptions.annual && (
                          <option value="annual">
                            Annuelle (365 jours) - {api.formatCurrency(item.product.licenseOptions.annual)}
                          </option>
                        )}
                        {item.product.licenseOptions.lifetime && (
                          <option value="lifetime">
                            Achat unique (à vie) - {api.formatCurrency(item.product.licenseOptions.lifetime)}
                          </option>
                        )}
                      </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <p className="text-[11px] text-slate-400">
                        Développeur: {item.product.vendorName} · Clé livrée après validation
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProductForVideo(item.product);
                          setVideoModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-200 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                        <span>Voir vidéo démo</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pricing, Quantity & Removal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.licenseType, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.licenseType, item.quantity + 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Unit & Total Price */}
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-black text-slate-900 block">
                      {api.formatCurrency(item.price * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[10px] text-slate-400">
                        {api.formatCurrency(item.price)} / unité
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id, item.licenseType)}
                    className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Supprimer du panier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => navigate('applications')}
              className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continuer mes achats</span>
            </button>

            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline"
            >
              Vider le panier
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary (4 cols - Matches Mockup) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xl space-y-6 sticky top-24">
            
            <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
              Résumé de la commande
            </h3>

            {/* Subtotal */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Sous-total ({itemCount} articles)</span>
                <span className="font-bold text-slate-900">{api.formatCurrency(subtotal)}</span>
              </div>

              {/* Coupon Applied Badge */}
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Code <strong>{coupon.code}</strong> ({coupon.type === 'percentage' ? `-${coupon.value}%` : `-${api.formatCurrency(coupon.value)}`})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Supprimer le code promo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}

              {/* Discount line */}
              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-medium">
                  <span>Réduction</span>
                  <span className="font-bold">-{api.formatCurrency(discount)}</span>
                </div>
              )}

              {/* Total Line */}
              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <div>
                  <span className="text-base font-extrabold text-slate-900 block">Total</span>
                  <span className="text-[11px] text-slate-400">TVA comprise</span>
                </div>
                <span className="text-2xl font-black text-emerald-700">
                  {api.formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Promo Code Input Form */}
            {!coupon && (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Code promotionnel
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: BIENVENUE5000"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200 uppercase tracking-wider focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Appliquer'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                )}
                <p className="text-[10px] text-slate-400">
                  Astuce : Utilisez le code <strong>BIENVENUE5000</strong> pour tester une réduction immédiate de 5 000 FCFA.
                </p>
              </form>
            )}

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  openAuthModal(
                    'register',
                    'Veuillez vous inscrire ou vous connecter pour commander vos applications et recevoir vos clés de licence.'
                  );
                } else {
                  navigate('checkout');
                }
              }}
              className="w-full py-4 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>{user ? 'Passer la commande' : 'Se connecter & Commander'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!user && (
              <p className="text-[11px] text-center text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                ⚠️ La création d’un compte est obligatoire pour générer et enregistrer vos clés de licence.
              </p>
            )}

            {/* Trust and Payment Guarantee */}
            <div className="pt-4 border-t border-slate-100 text-center space-y-2">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Paiement 100% sécurisé</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Flooz</span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">TMoney</span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Visa / Mastercard</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Video Demonstration Modal */}
      <VideoDemoModal
        product={selectedProductForVideo}
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onOrderNow={() => {
          if (!user) {
            openAuthModal('register', 'Créer un compte pour finaliser la commande');
          } else {
            navigate('checkout');
          }
        }}
      />
    </div>
  );
};
