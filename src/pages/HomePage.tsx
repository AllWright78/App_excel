import React, { useEffect, useState } from 'react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';
import { VideoDemoModal } from '../components/common/VideoDemoModal';
import {
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  KeyRound,
  Headphones,
  Globe2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Search,
  Users,
  Briefcase,
  GraduationCap,
  ShoppingBag,
  Sprout,
  Boxes,
  Layers,
  Sparkles
} from 'lucide-react';

interface HomePageProps {
  navigate: (route: string, param?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onSelectProduct }) => {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedVideoProduct, setSelectedVideoProduct] = useState<Product | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [stats, setStats] = useState({
    applications: 128,
    clients: 1248,
    sellers: 236,
    orders: 3450,
    countries: 12
  });

  useEffect(() => {
    async function loadData() {
      const { products } = await api.getProducts({ sort: 'popular' });
      setPopularProducts(products.slice(0, 4));
      const cats = await api.getCategories();
      setCategories(cats);
      const adminStats = await api.getAdminStats();
      if (adminStats) {
        setStats({
          applications: 128,
          clients: adminStats.usersCount,
          sellers: adminStats.vendorsCount,
          orders: 3450,
          countries: 14
        });
      }
    }
    loadData();
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'Sprout': return <Sprout className="w-5 h-5" />;
      case 'Boxes': return <Boxes className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO SECTION (Matches Section 5 & Top-Left Mockup) */}
      <section className="relative isolate overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-gradient-to-br from-emerald-50 via-white 55% to-sky-50/70">
        <div className="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-sky-300/15 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Calls to Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Marketplace Spécialisée N°1 en Afrique & Togo</span>
              </div>

              <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.08]">
                Vos applications professionnelles,{' '}
                <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">
                  simplement.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl font-normal">
                Découvrez, achetez et utilisez des solutions numériques adaptées à vos besoins.
                Tableaux de bord Excel automatisés, logiciels de gestion de stock, comptabilité SYSCOHADA et CRM.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('applications')}
                  className="px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Découvrir les applications</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('dashboard')}
                  className="px-7 py-3.5 rounded-2xl bg-white/90 hover:bg-white text-slate-800 font-semibold text-base border border-slate-200 hover:border-emerald-300 shadow-premium transition-all flex items-center justify-center"
                >
                  Créer un compte
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Livraison numérique instantanée</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Flooz & TMoney acceptés</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Mockup Showcase (Excel dashboard screen preview) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl opacity-20 blur-2xl -z-10"></div>

                {/* Main Software Card Interface Mockup */}
                <div className="bg-slate-950/95 rounded-[2rem] border border-white/10 shadow-premium overflow-hidden text-white p-5 space-y-4 backdrop-blur-sm">
                  
                  {/* Window Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs text-slate-400 font-mono ml-2">Gestion_de_Stock_Pro_v2.1.xlsm</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                      LICENCE ACTIVE
                    </span>
                  </div>

                  {/* Mockup Dashboard Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">TABLEAU DE BORD EXCEL</p>
                      <h4 className="text-base font-bold text-white">Stock Général & Valorisation</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-xl shadow-md">
                      X
                    </div>
                  </div>

                  {/* Mockup KPI Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/60">
                      <p className="text-[10px] text-slate-400">Valeur totale du stock</p>
                      <p className="text-base font-extrabold text-emerald-400 mt-0.5">24 850 000 FCFA</p>
                      <span className="text-[10px] text-emerald-300 font-semibold">+14.2% ce mois</span>
                    </div>
                    <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700/60">
                      <p className="text-[10px] text-slate-400">Articles en rupture</p>
                      <p className="text-base font-extrabold text-amber-400 mt-0.5">3 Références</p>
                      <span className="text-[10px] text-amber-300 font-semibold">Alerte automatique</span>
                    </div>
                  </div>

                  {/* Simulated Chart Bars */}
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-2">
                      <span>Flux d'entrées / sorties</span>
                      <span className="text-emerald-400">Automatisé VBA</span>
                    </div>
                    <div className="flex items-end gap-2 h-20 pt-2">
                      <div className="flex-1 bg-slate-700 hover:bg-emerald-600 rounded-t h-[45%] transition-all"></div>
                      <div className="flex-1 bg-slate-700 hover:bg-emerald-600 rounded-t h-[70%] transition-all"></div>
                      <div className="flex-1 bg-emerald-500 rounded-t h-[95%]"></div>
                      <div className="flex-1 bg-slate-700 hover:bg-emerald-600 rounded-t h-[60%] transition-all"></div>
                      <div className="flex-1 bg-emerald-500 rounded-t h-[80%]"></div>
                      <div className="flex-1 bg-slate-700 hover:bg-emerald-600 rounded-t h-[75%] transition-all"></div>
                      <div className="flex-1 bg-emerald-500 rounded-t h-[100%]"></div>
                    </div>
                  </div>

                  {/* Live Floating Badge */}
                  <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="font-bold text-white text-xs">Clé: EXCEL-STK-7789-2025</p>
                        <p className="text-[10px] text-slate-400">Validée · Clôture annuelle incluse</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded">
                      Vérifié
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS (5 Badges from Section 5 & Mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Paiement sécurisé</h4>
              <p className="text-[11px] text-slate-500">Tous les moyens de paiement</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Livraison numérique</h4>
              <p className="text-[11px] text-slate-500">Par e-mail après validation</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Licences sécurisées</h4>
              <p className="text-[11px] text-slate-500">Mensuelle, annuelle ou unique</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Support client</h4>
              <p className="text-[11px] text-slate-500">Toujours à votre écoute</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3 col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">International</h4>
              <p className="text-[11px] text-slate-500">Togo et autres pays</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. APPLICATIONS POPULAIRES (Section 5 & Mockup Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Applications populaires
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Les solutions logicielles et classeurs Excel les plus plébiscités par nos clients.
            </p>
          </div>
          <button
            onClick={() => navigate('applications')}
            className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map(product => (
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
      </section>

      {/* 4. CATÉGORIES POPULAIRES (Section 5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Catégories populaires
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Explorez notre catalogue par domaine d'activité et trouvez immédiatement l'outil qu'il vous faut.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate('applications', cat.slug)}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-lg transition-all text-center flex flex-col items-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white flex items-center justify-center transition-colors mb-3">
                {getCategoryIcon(cat.iconName)}
              </div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </h4>
              <span className="text-[11px] text-slate-400 mt-1">
                {cat.productCount} solutions
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. POURQUOI APP EXCEL ? (Section 5) */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Fiabilité & Technologie
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
            Pourquoi choisir APP EXCEL ?
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            Une plateforme pensée pour les professionnels africains et mondiaux, alliant simplicité d'Excel et puissance des licences logicielles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Solutions professionnelles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applications conçues et testées par des experts comptables, développeurs VBA et consultants certifiés.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Paiement local & sécurisé</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Réglez en toute sécurité via Flooz (Moov), TMoney (Togocom) ou par carte bancaire internationale en FCFA.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Gestion des licences</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Génération automatique de clé de licence avec vérification en temps réel, renouvellement et multi-postes.
            </p>
          </div>
        </div>
      </section>

      {/* 6. COMMENT ÇA MARCHE ? (Section 5: 5 étapes) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Parcours simple & rapide
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Comment ça marche ?
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            De la sélection à la prise en main de votre application en moins de 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            { step: '1', title: 'Rechercher', desc: 'Explorez notre marketplace selon votre métier ou besoin.' },
            { step: '2', title: 'Consulter', desc: 'Vérifiez les fonctionnalités, versions et prérequis.' },
            { step: '3', title: 'Commander', desc: 'Choisissez votre licence (mensuelle, annuelle ou unique).' },
            { step: '4', title: 'Payer', desc: 'Réglez en toute sérénité avec Flooz, TMoney ou carte.' },
            { step: '5', title: 'Recevoir', desc: 'Téléchargez l’application et activez votre licence par email.' },
          ].map((item, index) => (
            <div key={item.step} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm mb-3 shadow-md shadow-emerald-600/20">
                {item.step}
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. NOS CHIFFRES (Section 5: Chiffres dynamiques) */}
      <section className="bg-emerald-700 text-white py-14 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-xl sm:text-2xl font-extrabold mb-10">
            APP EXCEL en quelques chiffres
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
            <div className="p-4 bg-emerald-800/40 rounded-2xl border border-emerald-500/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">{stats.applications}+</p>
              <p className="text-xs font-medium text-emerald-100 mt-1">Applications & Outils</p>
            </div>

            <div className="p-4 bg-emerald-800/40 rounded-2xl border border-emerald-500/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">{stats.clients.toLocaleString('fr-FR')}+</p>
              <p className="text-xs font-medium text-emerald-100 mt-1">Clients satisfaits</p>
            </div>

            <div className="p-4 bg-emerald-800/40 rounded-2xl border border-emerald-500/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">{stats.sellers}+</p>
              <p className="text-xs font-medium text-emerald-100 mt-1">Développeurs & Vendeurs</p>
            </div>

            <div className="p-4 bg-emerald-800/40 rounded-2xl border border-emerald-500/30">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">{stats.orders.toLocaleString('fr-FR')}+</p>
              <p className="text-xs font-medium text-emerald-100 mt-1">Commandes traitées</p>
            </div>

            <div className="p-4 bg-emerald-800/40 rounded-2xl border border-emerald-500/30 col-span-2 md:col-span-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">{stats.countries}</p>
              <p className="text-xs font-medium text-emerald-100 mt-1">Pays couverts</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-900/50 shadow-xl">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Vous êtes créateur de solutions Excel ou logiciels ?
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              Rejoignez le réseau de vendeurs APP EXCEL, monétisez vos fichiers et applications automatisées auprès de milliers de clients.
            </p>
          </div>
          <button
            onClick={() => navigate('become-seller')}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-md transition-all shrink-0"
          >
            Devenir vendeur sur APP EXCEL
          </button>
        </div>
      </section>

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
