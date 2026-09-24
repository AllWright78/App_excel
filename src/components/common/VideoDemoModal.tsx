import React, { useState } from 'react';
import { Product } from '../../types';
import { X, Play, CheckCircle2, ShieldCheck, ShoppingCart, Sparkles, ExternalLink } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import { getYoutubeEmbedUrl } from '../../utils/video';

interface VideoDemoModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderNow?: (product: Product) => void;
}

export const VideoDemoModal: React.FC<VideoDemoModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderNow
}) => {
  const { addToCart } = useCart();
  const { addToast } = useNotifications();
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  if (!isOpen || !product) return null;

  const videos = product.demoVideos?.length
    ? product.demoVideos
    : [{ url: product.demoVideoUrl || 'https://www.youtube.com/embed/S_8qM8C-Q7s', title: product.demoVideoTitle || '' }];
  const selectedVideo = videos[selectedVideoIndex] || videos[0];
  const originalVideoUrl = selectedVideo.url;
  const videoUrl = getYoutubeEmbedUrl(originalVideoUrl);
  const videoTitle = selectedVideo.title || `Démonstration en vidéo : ${product.name}`;

  const handleAddToCart = () => {
    addToCart(product, product.defaultLicense || 'annual');
    addToast('Ajouté au panier !', `${product.name} a été ajouté à votre panier.`, 'success');
  };

  const handleDirectOrder = () => {
    addToCart(product, product.defaultLicense || 'annual');
    onClose();
    if (onOrderNow) onOrderNow(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Play className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Vidéo Démonstration Live
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                  {product.categoryName}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100 truncate max-w-md sm:max-w-xl">
                {videoTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Frame */}
        {videos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-slate-950 border-b border-slate-800">
            {videos.map((video, index) => (
              <button
                key={`${video.url}-${index}`}
                type="button"
                onClick={() => setSelectedVideoIndex(index)}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold ${selectedVideoIndex === index ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                {video.title || `Vidéo ${index + 1}`}
              </button>
            ))}
          </div>
        )}
        <div className="relative aspect-video w-full bg-black">
          {videoUrl ? (
            <>
              <iframe
                className="relative z-0 w-full h-full border-0"
                src={`${videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer la vidéo"
                title="Fermer la vidéo"
                className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-slate-950/90 text-white shadow-lg ring-1 ring-white/30 hover:bg-rose-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-radial from-slate-800 to-slate-950">
              <div className="w-16 h-16 rounded-full bg-emerald-600/30 border border-emerald-500 text-emerald-400 flex items-center justify-center mb-4">
                <Play className="w-8 h-8 fill-emerald-400 translate-x-0.5" />
              </div>
              <h4 className="text-lg font-bold mb-1">{product.name}</h4>
              <p className="text-xs text-slate-400 max-w-md mb-4">
                Lecteur vidéo optimisé avec prévisualisation des formulaires automatisés, menus VBA et tableaux de bord dynamiques.
              </p>
              <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Compatible Excel 2016 à 365 (Windows & Mac)</span>
              </div>
            </div>
          )}
        </div>

        {videoUrl && (
          <div className="px-4 pt-3 bg-slate-950 text-center">
            <a
              href={originalVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ouvrir la vidéo sur YouTube
            </a>
          </div>
        )}

        {/* Bottom Details & Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <img
              src={product.logo}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-100">{product.name}</h4>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>Par {product.vendorName}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">
                  {product.basePrice.toLocaleString('fr-FR')} FCFA
                </span>
                <span>•</span>
                <span>{product.fileFormat}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold text-xs transition-colors flex items-center space-x-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Quitter la vidéo</span>
            </button>
            <button
              onClick={handleAddToCart}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors flex items-center space-x-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ajouter au panier</span>
            </button>
            <button
              onClick={handleDirectOrder}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/25 flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Commander immédiatement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
