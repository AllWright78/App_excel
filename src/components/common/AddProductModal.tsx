import React, { useState, useRef } from 'react';
import { Product, LicenseType } from '../../types';
import { api } from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Video,
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  FileCheck
} from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
  isAdmin?: boolean;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductCreated,
  isAdmin = false
}) => {
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('cat-gestion');
  const [categoryName, setCategoryName] = useState('Gestion');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(35000);
  const [annualPrice, setAnnualPrice] = useState(60000);
  const [lifetimePrice, setLifetimePrice] = useState(95000);
  const [defaultLicense, setDefaultLicense] = useState<LicenseType>('annual');
  const [version, setVersion] = useState('1.0.0');
  const [compatibility, setCompatibility] = useState('Excel 2016, 2019, 2021, Microsoft 365 (Windows & Mac)');

  // PC File Upload State
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    format: string;
    fileData?: string;
  } | null>(null);

  // Video Demo State
  const [demoVideoUrl, setDemoVideoUrl] = useState(
    'https://www.youtube.com/embed/dQw4w9WgXcQ'
  );
  const [videoTitle, setVideoTitle] = useState('Démonstration complète de la solution');
  const [previewVideo, setPreviewVideo] = useState(false);

  // Features List
  const [features, setFeatures] = useState<string[]>([
    'Tableau de bord dynamique avec graphiques KPI',
    'Calculs et clôtures comptables automatiques',
    'Macros VBA sécurisées et verrouillées',
    'Export PDF et impression prête à l’emploi'
  ]);
  const [newFeature, setNewFeature] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handle local file selection from PC
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeFormatted =
        file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(1) + ' Mo'
          : (file.size / 1024).toFixed(0) + ' Ko';
      
      const ext = '.' + (file.name.split('.').pop() || 'xlsx');

      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedFile({
          name: file.name,
          size: sizeFormatted,
          format: ext,
          fileData: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);

      addToast(
        'Fichier PC chargé !',
        `Le fichier ${file.name} (${sizeFormatted}) est prêt à être publié.`,
        'success'
      );
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Erreur', 'Veuillez saisir un nom pour l’application.', 'warning');
      return;
    }
    if (isAdmin && !selectedFile) {
      addToast(
        'Fichier requis',
        'Sélectionnez le fichier Excel ou l’archive de l’application depuis votre PC avant de publier.',
        'warning'
      );
      fileInputRef.current?.click();
      return;
    }

    setIsSubmitting(true);
    try {
      const newProduct: Product = {
        id: 'prod-' + Date.now(),
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categoryId,
        categoryName,
        shortDescription:
          shortDescription.trim() ||
          'Solution professionnelle Excel automatisée avec tableau de bord et gestion.',
        description:
          description.trim() ||
          'Application Excel conçue pour optimiser votre productivité, vos calculs et vos rapports d’activités.',
        basePrice,
        licenseOptions: {
          monthly: basePrice,
          annual: annualPrice,
          lifetime: lifetimePrice
        },
        defaultLicense,
        features,
        requirements: [
          'Microsoft Excel 2016 ou version ultérieure',
          'Macros activées pour le bon fonctionnement'
        ],
        compatibility,
        version,
        fileFormat: selectedFile?.format || '.xlsm',
        fileSize: selectedFile?.size || '4.5 Mo',
        logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
        gallery: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
        ],
        sourceFileName: selectedFile?.name || 'Application_Excel.xlsm',
        sourceFileData: selectedFile?.fileData,
        demoVideoUrl: demoVideoUrl.trim() || undefined,
        demoVideoTitle: videoTitle.trim() || undefined,
        vendorId: user?.id || (isAdmin ? 'user-admin' : 'user-seller'),
        vendorName: user?.companyName || user?.name || (isAdmin ? 'APP EXCEL Studio' : 'Vendeur Certifié'),
        vendorVerified: true,
        rating: 5.0,
        reviewsCount: 1,
        salesCount: 0,
        status: isAdmin ? 'approved' : 'pending_review',
        faqs: [],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      const created = await api.createProduct(newProduct, user || undefined);
      addToast(
        'Application ajoutée avec succès !',
        `"${created.name}" avec son fichier PC et sa vidéo de démo est en ligne.`,
        'success'
      );
      onProductCreated(created);
      onClose();
    } catch (err: any) {
      addToast('Erreur lors de l’ajout', err.message || 'Une erreur est survenue', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/80 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold">
                Ajouter une application (Fichier PC & Vidéo)
              </h2>
              <p className="text-xs text-emerald-200">
                Téléversez le classeur Excel depuis votre ordinateur et intégrez la vidéo de démonstration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* 1. PC FILE UPLOAD ZONE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              1. Téléverser le fichier de l'application depuis votre PC <span className="text-rose-500">*</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xlsm,.xlsb,.zip,.rar,.exe"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                selectedFile
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50'
              }`}
            >
              {selectedFile ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      {selectedFile.format.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span>{selectedFile.name}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        Taille : <span className="font-semibold text-slate-700">{selectedFile.size}</span> · Format prêt au téléchargement sécurisé
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                  >
                    Changer de fichier
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Cliquez pour choisir le fichier sur votre PC ou glissez-le ici
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Formats supportés : <strong>.xlsm</strong> (avec macros), <strong>.xlsx</strong>, <strong>.xlsb</strong>, <strong>.zip</strong>
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg">
                    Parcourir l'ordinateur
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 2. DEMO VIDEO SECTION */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                2. Vidéo de Démonstration pour les clients <span className="text-emerald-600 font-normal">(Recommandé)</span>
              </label>
              <button
                type="button"
                onClick={() => setPreviewVideo(!previewVideo)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Video className="w-3.5 h-3.5" />
                <span>{previewVideo ? 'Masquer l’aperçu vidéo' : 'Tester l’aperçu vidéo'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Lien de la vidéo (YouTube, Vimeo ou MP4)
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/..."
                  value={demoVideoUrl}
                  onChange={(e) => setDemoVideoUrl(e.target.value)}
                  className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Titre explicatif de la vidéo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Guide pratique et fonctionnalités du tableau"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Video Live Preview Box */}
            {previewVideo && demoVideoUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video shadow-md mt-2">
                <iframe
                  src={demoVideoUrl}
                  title={videoTitle}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* 3. GENERAL PRODUCT INFO */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              3. Informations générales & Tarifs
            </label>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nom de l'application <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Gestion de Stock Automatisée Pro"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden font-bold text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Catégorie
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    const cats: Record<string, string> = {
                      'cat-gestion': 'Gestion',
                      'cat-comptabilite': 'Comptabilité',
                      'cat-commerce': 'Commerces & Boutiques',
                      'cat-agriculture': 'Agriculteurs',
                      'cat-ecole': 'Écoles & Universités',
                      'cat-rh': 'Ressources Humaines',
                      'cat-dashboard': 'Tableaux de bord'
                    };
                    setCategoryName(cats[e.target.value] || 'Gestion');
                  }}
                  className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="cat-gestion">Gestion générale</option>
                  <option value="cat-comptabilite">Comptabilité</option>
                  <option value="cat-commerce">Commerces & Boutiques</option>
                  <option value="cat-agriculture">Agriculteurs</option>
                  <option value="cat-ecole">Écoles & Éducation</option>
                  <option value="cat-rh">Ressources Humaines</option>
                  <option value="cat-dashboard">Tableaux de bord</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Formule par défaut
                </label>
                <select
                  value={defaultLicense}
                  onChange={(e) => setDefaultLicense(e.target.value as LicenseType)}
                  className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200"
                >
                  <option value="monthly">Mensuelle</option>
                  <option value="annual">Annuelle (Recommandée)</option>
                  <option value="lifetime">Achat unique (À vie)</option>
                </select>
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Prix Mensuel (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Prix Annuel (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={annualPrice}
                  onChange={(e) => setAnnualPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200 font-bold text-emerald-700"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Achat Unique / À vie (FCFA)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={lifetimePrice}
                  onChange={(e) => setLifetimePrice(Number(e.target.value))}
                  className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Description courte (vue carte)
              </label>
              <input
                type="text"
                placeholder="Ex: Solution complète pour le suivi des entrées/sorties et alertes ruptures."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full bg-slate-50 text-xs px-3.5 py-2 rounded-xl border border-slate-200"
              />
            </div>

            {/* Full Description */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Description détaillée & Mode d'emploi
              </label>
              <textarea
                rows={3}
                placeholder="Expliquez en détail les atouts de votre fichier Excel, les onglets disponibles et les automatisations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-slate-200 resize-none"
              />
            </div>

            {/* Features Tags */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Fonctionnalités clés incluses
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Ajouter un point fort (ex: Tableau de bord CA)..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  className="flex-1 bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                >
                  Ajouter
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-emerald-500 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isSubmitting ? 'Publication...' : 'Publier l’application sur APP EXCEL'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
