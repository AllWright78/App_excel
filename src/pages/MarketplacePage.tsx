import React, { useState, useEffect } from 'react';
import { Product, Category, LicenseType } from '../types';
import { api, subscribeToCategories, subscribeToProducts } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';
import { VideoDemoModal } from '../components/common/VideoDemoModal';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Star,
  Check,
  FileSpreadsheet,
  Play
} from 'lucide-react';

interface MarketplacePageProps {
  initialCategory?: string;
  initialQuery?: string;
  navigate: (route: string, param?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  initialCategory,
  initialQuery,
  navigate,
  onSelectProduct
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoProduct, setSelectedVideoProduct] = useState<Product | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedLicenseType, setSelectedLicenseType] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function loadCategories() {
      const cats = await api.getCategories();
      setCategories(cats);
    }
    loadCategories();
    const unsubscribe = subscribeToCategories(loadCategories);
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const res = await api.getProducts({
        category: selectedCategory,
        search: searchQuery,
        licenseType: selectedLicenseType,
        minPrice: minPrice !== '' ? Number(minPrice) : undefined,
        maxPrice: maxPrice !== '' ? Number(maxPrice) : undefined,
        sort: sortBy
      });
      setProducts(res.products);
      setCurrentPage(1);
      setLoading(false);
    }
    fetchProducts();
    const unsubscribe = subscribeToProducts(fetchProducts);
    return unsubscribe;
  }, [selectedCategory, searchQuery, selectedLicenseType, minPrice, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLicenseType('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('popular');
  };

  // Pagination calculation
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <button onClick={() => navigate('home')} className="hover:text-emerald-700">
          Accueil
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-800">Applications</span>
        {selectedCategory !== 'all' && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-emerald-700 capitalize font-semibold">{selectedCategory}</span>
          </>
        )}
      </div>

      {/* Page Title & Mobile Filter Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Marketplace d’applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Trouvez les logiciels de gestion, fichiers automatisés et tableaux de bord adaptés à votre entreprise.
          </p>
        </div>

        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-semibold shadow-xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <span>Filtres de recherche</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT SIDEBAR FILTERS (Matches Section 6 & Mockup) */}
        <div className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} lg:col-span-1`}>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6 sticky top-24">
            
            {/* Header: Filtres & Réinitialiser */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>Filtres</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            </div>

            {/* Keyword Search in Filter */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Recherche
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Mot-clé, fonction..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-slate-800 pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Catégories Checkbox List */}
            <div>
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5">
                Catégories
              </label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                <label className="flex items-center gap-2 text-xs text-slate-700 hover:text-emerald-700 cursor-pointer py-0.5">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'all'}
                    onChange={() => setSelectedCategory('all')}
                    className="accent-emerald-600 w-3.5 h-3.5"
                  />
                  <span className="flex-1 font-medium">Toutes les catégories</span>
                </label>

                {categories.map(cat => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 text-xs text-slate-700 hover:text-emerald-700 cursor-pointer py-0.5"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.id || selectedCategory === cat.slug || selectedCategory === cat.name}
                      onChange={() => setSelectedCategory(cat.id)}
                      className="accent-emerald-600 w-3.5 h-3.5"
                    />
                    <span className="flex-1">{cat.name}</span>
                    <span className="text-[10px] text-slate-400">({cat.productCount})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type de Licence Checkboxes */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Type de licence
              </label>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Toutes les licences' },
                  { value: 'monthly', label: 'Mensuelle (30 jours)' },
                  { value: 'annual', label: 'Annuelle (365 jours)' },
                  { value: 'lifetime', label: 'Achat unique (à vie)' },
                ].map(lic => (
                  <label key={lic.value} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="licenseType"
                      checked={selectedLicenseType === lic.value}
                      onChange={() => setSelectedLicenseType(lic.value)}
                      className="accent-emerald-600 w-3.5 h-3.5"
                    />
                    <span>{lic.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Prix Min - Prix Max (FCFA) */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Budget (FCFA)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-50 text-xs px-3 py-1.5 rounded-lg border border-slate-200"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-50 text-xs px-3 py-1.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT MAIN CONTENT: Application Listings */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Filter Bar: Result Count, Sort, Grid/List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Toutes les applications
              </h3>
              <p className="text-xs text-slate-500">
                <span className="font-bold text-emerald-700">{totalItems}</span> résultats trouvés
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="hidden sm:inline">Trier par :</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 rounded-lg px-2.5 py-1.5 focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="popular">Plus populaires</option>
                  <option value="rating">Mieux notés</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>

              {/* Grid / List Switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-500'}`}
                  aria-label="Vue grille"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white shadow-xs text-emerald-700' : 'text-slate-500'}`}
                  aria-label="Vue liste"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Items Display */}
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs">Chargement des applications...</p>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Aucune application ne correspond à vos filtres</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Essayez d'élargir vos critères de recherche ou réinitialisez les filtres pour afficher l'ensemble du catalogue.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(prod: Product) => onSelectProduct(prod)}
                  onOpenVideo={(prod: Product) => {
                    setSelectedVideoProduct(prod);
                    setVideoModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {paginatedProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-5"
                >
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl bg-gradient-to-br from-emerald-600 to-slate-900 flex items-center justify-center text-white shrink-0 group/icon">
                    <FileSpreadsheet className="w-10 h-10 text-emerald-100" />
                    {product.demoVideoUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideoProduct(product);
                          setVideoModalOpen(true);
                        }}
                        className="absolute inset-0 bg-slate-950/60 flex items-center justify-center text-white rounded-xl opacity-0 group-hover/icon:opacity-100 transition-opacity"
                        title="Voir la vidéo"
                      >
                        <Play className="w-6 h-6 fill-white" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {product.categoryName}
                      </span>
                      <span className="text-[11px] text-slate-400">v{product.version}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{product.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 max-w-xl">{product.shortDescription}</p>

                    <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-800">{product.rating}</span>
                        <span>({product.reviewsCount})</span>
                      </div>
                      <span>{product.salesCount} ventes</span>
                      <span className="text-slate-400 font-medium">{product.compatibility}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-end justify-between shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto gap-2">
                    <div className="text-right mb-1">
                      <span className="text-lg font-extrabold text-emerald-700 block">
                        {api.formatCurrency(product.basePrice)}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {product.defaultLicense === 'monthly' ? 'Mensuelle' : product.defaultLicense === 'lifetime' ? 'Achat unique' : 'Annuelle'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVideoProduct(product);
                          setVideoModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                        <span>Vidéo</span>
                      </button>

                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                      >
                        Commander
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                Précédent
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                Suivant
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Video Demonstration Modal */}
      <VideoDemoModal
        product={selectedVideoProduct}
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onOrderNow={(prod) => {
          setVideoModalOpen(false);
          onSelectProduct(prod);
        }}
      />
    </div>
  );
};
