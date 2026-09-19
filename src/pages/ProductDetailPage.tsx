import React, { useState } from 'react';
import { Product, LicenseType } from '../types';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { VideoDemoModal } from '../components/common/VideoDemoModal';
import {
  ChevronRight,
  Star,
  CheckCircle2,
  FileSpreadsheet,
  ShieldCheck,
  Download,
  Calendar,
  Layers,
  Monitor,
  Heart,
  MessageSquare,
  ShoppingCart,
  Zap,
  HelpCircle,
  FileText,
  Clock,
  Sparkles,
  Send,
  Play,
  UserPlus
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  navigate: (route: string, param?: string) => void;
  onOpenChatWithVendor?: (vendorId: string, vendorName: string, product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  navigate,
  onOpenChatWithVendor
}) => {
  const { addToCart } = useCart();
  const { addToast } = useNotifications();
  const { user, openAuthModal } = useAuth();

  // License selection state
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>(
    product.defaultLicense || (product.licenseOptions.annual ? 'annual' : 'lifetime')
  );

  const [activeTab, setActiveTab] = useState<'description' | 'video' | 'features' | 'reviews' | 'faq' | 'docs'>('description');
  const [selectedImage, setSelectedImage] = useState<string>(product.gallery[0] || product.logo);
  const [isFavorite, setIsFavorite] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      name: 'Amavi K.',
      company: 'Quincaillerie Centrale (Lomé)',
      rating: 5,
      date: 'Il y a 1 semaine',
      comment: 'Excellent outil Excel ! Les alertes de stock minimum nous évitent désormais toute rupture. Prise en main en 15 minutes.'
    },
    {
      id: 'rev-2',
      name: 'Élise T.',
      company: 'Supermarché Horizon',
      rating: 5,
      date: 'Il y a 3 semaines',
      comment: 'La valorisation PUMP automatique et les tableaux de bord sont impeccables. La clé annuelle a été reçue immédiatement après le paiement Flooz.'
    }
  ]);

  // Pricing calculation based on selected license
  const currentPrice =
    selectedLicense === 'monthly'
      ? product.licenseOptions.monthly || product.basePrice
      : selectedLicense === 'lifetime'
      ? product.licenseOptions.lifetime || product.basePrice * 2
      : product.licenseOptions.annual || product.basePrice;

  const handleAddToCart = () => {
    addToCart(product, selectedLicense);
    addToast(
      'Ajouté au panier !',
      `${product.name} (${selectedLicense === 'monthly' ? 'Mensuelle' : selectedLicense === 'lifetime' ? 'Achat unique' : 'Annuelle'}) a été ajouté.`,
      'success'
    );
  };

  const handleBuyNow = () => {
    addToCart(product, selectedLicense);
    if (!user) {
      openAuthModal('register', `Veuillez créer un compte ou vous connecter pour commander "${product.name}" et activer votre licence.`);
    } else {
      navigate('checkout');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast('Connexion requise', 'Connectez-vous pour publier un commentaire.', 'warning');
      openAuthModal('login', 'Connectez-vous pour donner votre avis sur cette application.');
      return;
    }
    if (!newComment.trim()) return;
    const newRev = {
      id: 'rev-' + Date.now(),
      name: user.name,
      company: 'Utilisateur vérifié',
      rating: newRating,
      date: 'À l’instant',
      comment: newComment.trim()
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewComment('');
    addToast('Avis publié !', 'Merci pour votre retour d’expérience.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => navigate('home')} className="hover:text-emerald-700">Accueil</button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <button onClick={() => navigate('applications')} className="hover:text-emerald-700">Applications</button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-800">{product.name}</span>
      </div>

      {/* Main Grid Section (Matches Top-Right Mockup) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Visual Preview & Gallery (5 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 border border-slate-800 p-8 flex items-center justify-center min-h-[320px] shadow-lg overflow-hidden group">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative z-10 w-28 h-28 rounded-3xl bg-emerald-600 shadow-2xl flex items-center justify-center text-white border-2 border-emerald-400/60 group-hover:scale-105 transition-transform duration-300">
              <FileSpreadsheet className="w-16 h-16 text-emerald-50" />
              <span className="absolute bottom-2 right-2 bg-white text-emerald-900 font-black text-xs px-1.5 py-0.5 rounded shadow">
                XLS
              </span>
            </div>

            {/* Video Play Overlay */}
            {product.demoVideoUrl && (
              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="absolute inset-0 bg-slate-950/40 hover:bg-slate-950/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white transition-all group/btn z-20 cursor-pointer"
                title="Lancer la démonstration vidéo"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-600 group-hover/btn:bg-emerald-500 text-white flex items-center justify-center shadow-xl group-hover/btn:scale-110 transition-transform mb-2 border-2 border-white/50">
                  <Play className="w-6 h-6 fill-white text-white ml-1" />
                </div>
                <span className="text-xs font-bold bg-slate-900/90 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/40 flex items-center space-x-1">
                  <span>Voir Démo Vidéo</span>
                </span>
              </button>
            )}

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-400 z-10">
              <span className="font-mono bg-slate-800/80 px-2 py-0.5 rounded">Format: {product.fileFormat}</span>
              <span className="font-mono bg-slate-800/80 px-2 py-0.5 rounded">Taille: {product.fileSize}</span>
            </div>
          </div>

          {/* Thumbnails Gallery */}
          {product.gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {product.gallery.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedImage === img ? 'border-emerald-500 shadow-md' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="Capture d'écran" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Technical Specs Badges */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Version
              </span>
              <span className="font-bold text-slate-800">{product.version}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Dernière mise à jour
              </span>
              <span className="font-bold text-slate-800">{product.updatedAt}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                Taille du classeur
              </span>
              <span className="font-bold text-slate-800">{product.fileSize}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Monitor className="w-3.5 h-3.5 text-emerald-600" />
                Compatibilité
              </span>
              <span className="font-bold text-slate-800">{product.compatibility}</span>
            </div>
          </div>
        </div>

        {/* Center Col: Title, Description, Features, Vendor (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {product.categoryName}
              </span>
              <span className="text-xs text-slate-500">
                Développé par <strong className="text-slate-800">{product.vendorName}</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {/* Ratings & Sales */}
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-2.5">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900 text-sm">{product.rating}</span>
                <span className="text-slate-500">({product.reviewsCount} avis vérifiés)</span>
              </div>
              <span>·</span>
              <span className="font-medium text-slate-700">
                {product.salesCount.toLocaleString('fr-FR')} ventes
              </span>
            </div>
          </div>

          {/* Pricing Highlight Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">
                Tarif sélectionné
              </span>
              <span className="text-2xl font-black text-emerald-700">
                {api.formatCurrency(currentPrice)}
              </span>
            </div>
            <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1 rounded-full shadow-xs">
              {selectedLicense === 'monthly' ? 'Licence mensuelle' : selectedLicense === 'lifetime' ? 'Achat unique' : 'Licence annuelle'}
            </span>
          </div>

          {/* Short Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Feature Highlights with Green Checkmarks */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Points forts & fonctionnalités clés
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Vendor Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-emerald-400 font-bold flex items-center justify-center text-sm">
                TS
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900">{product.vendorName}</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-500">Vendeur certifié & support technique</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onOpenChatWithVendor) {
                  onOpenChatWithVendor(product.vendorId, product.vendorName, product);
                } else {
                  navigate('dashboard');
                }
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors shrink-0"
            >
              Voir boutique
            </button>
          </div>
        </div>

        {/* Right Col: License Selector & Purchase Actions (3 cols) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border-2 border-emerald-500/30 p-6 shadow-xl space-y-6 sticky top-24">
            
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Choisir une licence</h3>
              <p className="text-xs text-slate-500 mt-0.5">Sélectionnez la durée de votre droit d'utilisation.</p>
            </div>

            {/* License Radio Options */}
            <div className="space-y-3">
              {product.licenseOptions.monthly && (
                <label
                  onClick={() => setSelectedLicense('monthly')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedLicense === 'monthly'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="licensePlan"
                      checked={selectedLicense === 'monthly'}
                      onChange={() => setSelectedLicense('monthly')}
                      className="accent-emerald-600 w-4 h-4"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Mensuelle (30 jours)</p>
                      <p className="text-[10px] text-slate-500">Idéal pour tester</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">
                    {api.formatCurrency(product.licenseOptions.monthly)}
                  </span>
                </label>
              )}

              {product.licenseOptions.annual && (
                <label
                  onClick={() => setSelectedLicense('annual')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all relative ${
                    selectedLicense === 'annual'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                    Recommandé
                  </span>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="licensePlan"
                      checked={selectedLicense === 'annual'}
                      onChange={() => setSelectedLicense('annual')}
                      className="accent-emerald-600 w-4 h-4"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Annuelle (365 jours)</p>
                      <p className="text-[10px] text-slate-500">Mises à jour incluses</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {api.formatCurrency(product.licenseOptions.annual)}
                  </span>
                </label>
              )}

              {product.licenseOptions.lifetime && (
                <label
                  onClick={() => setSelectedLicense('lifetime')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedLicense === 'lifetime'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="licensePlan"
                      checked={selectedLicense === 'lifetime'}
                      onChange={() => setSelectedLicense('lifetime')}
                      className="accent-emerald-600 w-4 h-4"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Achat unique</p>
                      <p className="text-[10px] text-slate-500">Usage illimité à vie</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">
                    {api.formatCurrency(product.licenseOptions.lifetime)}
                  </span>
                </label>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Acheter maintenant</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-emerald-700 font-bold text-sm border-2 border-emerald-600 hover:border-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Ajouter au panier</span>
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => {
                  setIsFavorite(!isFavorite);
                  addToast(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris', '', 'info');
                }}
                className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
                  isFavorite ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-600' : ''}`} />
                <span>Favoris</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenChatWithVendor) {
                    onOpenChatWithVendor(product.vendorId, product.vendorName, product);
                  } else {
                    navigate('dashboard');
                  }
                }}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contacter</span>
              </button>
            </div>

            {/* Guarantees note */}
            <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-500 space-y-1.5 border border-slate-200/60">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clé générée automatiquement</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lien de téléchargement sécurisé</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Support technique inclus 7j/7</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Tabs Section: Description, Features, Reviews, FAQ, Documentation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
          {[
            { id: 'description', label: 'Description' },
            { id: 'video', label: '🎬 Démo Vidéo' },
            { id: 'features', label: 'Fonctionnalités' },
            { id: 'reviews', label: `Avis (${reviewsList.length})` },
            { id: 'faq', label: 'FAQ' },
            { id: 'docs', label: 'Documentation' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-6">
          {activeTab === 'video' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    <span>{product.demoVideoTitle || `Démonstration guidée : ${product.name}`}</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Regardez le classeur en action : saisie, automatisation VBA, tableaux de bord et édition d'états.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Mode Cinéma</span>
                </button>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
                <iframe
                  className="w-full h-full border-0"
                  src={`${product.demoVideoUrl || 'https://www.youtube.com/embed/S_8qM8C-Q7s'}?rel=0&modestbranding=1`}
                  title={product.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center space-x-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Contenu vidéo certifié conforme par le développeur {product.vendorName}</span>
                </div>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Commander cette application
                </button>
              </div>
            </div>
          )}
          {activeTab === 'description' && (
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed max-w-4xl">
              <h3 className="text-lg font-bold text-slate-900">Présentation complète du logiciel</h3>
              <p>{product.description}</p>
              <p>
                Développé sous environnement Microsoft Excel avec macros VBA optimisées pour une exécution ultra-rapide,
                cet outil a été spécialement calibré pour répondre aux exigences des entreprises et structures africaines.
                Aucune connexion Internet permanente n'est requise pour le fonctionnement quotidien, la licence s'activant
                une seule fois lors de la réception du classeur.
              </p>
              
              <h4 className="font-bold text-slate-800 pt-2">Système et prérequis requis :</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                {product.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-slate-900">Modules et fonctionnalités détaillées</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{feat}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Module intégré avec sauvegarde automatique et intégrité des calculs.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-extrabold text-emerald-700">{product.rating}</span>
                  <div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Basé sur {reviewsList.length} retours de clients vérifiés</p>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{rev.name}</span>
                        <span className="text-[11px] text-slate-400 ml-2 font-medium">({rev.company})</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Laisser un avis vérifié</h4>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Votre note</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">Votre commentaire</label>
                  <textarea
                    rows={3}
                    placeholder="Partagez votre retour d’utilisation..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    className="w-full bg-white text-xs p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publier mon avis</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-slate-900">Questions fréquentes</h3>
              {product.faqs.length > 0 ? (
                product.faqs.map((faq, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-600" />
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1.5 pl-6 leading-relaxed">{faq.answer}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Contactez le vendeur ou le support APP EXCEL pour toute question technique.</p>
              )}
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-4 max-w-3xl text-xs text-slate-600 leading-relaxed">
              <h3 className="text-lg font-bold text-slate-900">Guide de prise en main & Documentation</h3>
              <p>
                {product.documentation || 'Un manuel d’utilisation complet et une vidéo explicative sont fournis avec le téléchargement.'}
              </p>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-emerald-700" />
                  <div>
                    <h5 className="font-bold text-slate-900">Manuel_Utilisateur_{product.name}.pdf</h5>
                    <span className="text-[10px] text-slate-500">Document PDF inclus dans la commande</span>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold">Inclus</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Demonstration Modal (Full cinema mode) */}
      <VideoDemoModal
        product={product}
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onOrderNow={handleBuyNow}
      />

    </div>
  );
};
