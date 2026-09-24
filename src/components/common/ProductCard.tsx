import React, { useState } from 'react';
import { Product } from '../../types';
import { Star, Heart, ShieldCheck, Play, Eye } from 'lucide-react';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onOpenVideo?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onOpenVideo }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToast } = useNotifications();
  const { addToCart } = useCart();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    addToast(
      !isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris',
      `${product.name} a été ${!isFavorite ? 'ajouté à vos favoris' : 'retiré de vos favoris'}.`,
      'info'
    );
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenVideo) {
      onOpenVideo(product);
    } else {
      onSelect(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const licenseType = product.defaultLicense || 'annual';
    addToCart(product, licenseType);
    addToast(
      'Ajouté au panier',
      `${product.name} a été ajouté au panier.`,
      'success'
    );
  };

  // Determine license badge text
  const licenseText = product.defaultLicense === 'monthly'
    ? 'Licence mensuelle'
    : product.defaultLicense === 'lifetime'
    ? 'Licence unique'
    : 'Licence annuelle';

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-premium hover:border-emerald-500/40 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Visual Thumbnail */}
      <div className="relative h-44 w-full bg-gradient-to-br from-emerald-950 via-slate-900 to-sky-950 flex items-center justify-center overflow-hidden p-6">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Main Logo / Icon Showcase */}
        <div className="relative z-10 w-28 h-24 rounded-2xl overflow-hidden bg-white shadow-xl border-2 border-emerald-400/50 group-hover:scale-105 transition-transform duration-300">
          <img src={product.logo} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-white transition-all shadow-xs"
          title="Ajouter aux favoris"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Vendor verification pill */}
        {product.vendorVerified && (
          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs text-emerald-400 text-[10px] font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Vérifié</span>
          </div>
        )}

        {/* Video Demo Button Badge */}
        {(product.demoVideos?.length || product.demoVideoUrl) && (
          <button
            type="button"
            onClick={handleVideoClick}
            className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-slate-900/90 hover:bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/40 shadow-md transition-all hover:scale-105"
            title="Regarder la démo en vidéo"
          >
            <Play className="w-3 h-3 fill-white text-white" />
            <span>{product.demoVideos?.length ? `${product.demoVideos.length} vidéos` : 'Démo vidéo'}</span>
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Title */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {product.categoryName}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              v{product.version}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & License info */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-extrabold text-emerald-700">
              {api.formatCurrency(product.basePrice)}
            </span>
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {licenseText}
            </span>
          </div>

          {/* Social Proof: Rating & Sales */}
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2.5">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800">{product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
            <span className="text-slate-500 text-[11px]">
              {product.salesCount.toLocaleString('fr-FR')} ventes
            </span>
          </div>

          {/* Action Buttons: Voir vidéo & Voir détails */}
          <div className="grid grid-cols-2 gap-2 mt-3.5">
            <button
              type="button"
              onClick={handleVideoClick}
              className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>Voir vidéo</span>
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold tracking-wide transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Commander</span>
            </button>
            <button
              type="button"
              onClick={() => onSelect(product)}
              className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Voir les détails</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
