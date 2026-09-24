import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import { Product, License, PayoutRequest } from '../types';
import { AddProductModal } from '../components/common/AddProductModal';
import {
  Store,
  Plus,
  DollarSign,
  TrendingUp,
  KeyRound,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Send,
  SlidersHorizontal,
  X,
  UploadCloud,
  Video
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface SellerDashboardPageProps {
  navigate: (route: string, param?: string) => void;
}

export const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<'products' | 'licenses' | 'payouts' | 'analytics'>('products');
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // New product modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Payout request modal state
  const [payoutAmount, setPayoutAmount] = useState(150000);
  const [payoutMethod, setPayoutMethod] = useState<'flooz' | 'tmoney' | 'bank_transfer'>('flooz');
  const [payoutPhone, setPayoutPhone] = useState('+228 90 00 11 22');

  const salesData = [
    { month: 'Jan', ventes: 320000 },
    { month: 'Fév', ventes: 450000 },
    { month: 'Mar', ventes: 600000 },
    { month: 'Avr', ventes: 550000 },
    { month: 'Mai', ventes: 820000 },
    { month: 'Juin', ventes: 980000 },
  ];

  useEffect(() => {
    async function loadVendorData() {
      setLoading(true);
      const res = await api.getProducts({});
      setVendorProducts(res.products.slice(0, 3));
      const payoutsList = await api.getSellerPayouts('user-seller');
      setPayouts(payoutsList);
      setLoading(false);
    }
    loadVendorData();
  }, []);

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newReq = await api.requestSellerPayout(
        'user-seller',
        'Tech Solutions',
        payoutAmount,
        payoutMethod,
        payoutPhone
      );
      setPayouts([newReq, ...payouts]);
      addToast('Demande enregistrée', `Votre demande de retrait de ${api.formatCurrency(payoutAmount)} a été transmise à l'administrateur.`, 'success');
    } catch (err: any) {
      addToast('Erreur', err.message, 'error');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Supprimer définitivement « ${product.name} » ? Cette action est irréversible.`)) {
      return;
    }

    try {
      await api.deleteProduct(product.id);
      setVendorProducts(prev => prev.filter(item => item.id !== product.id));
      addToast('Application supprimée', 'L’application a été supprimée définitivement.', 'success');
    } catch (error: any) {
      addToast('Erreur', error.message || 'Impossible de supprimer cette application.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Espace Vendeur : Tech Solutions
              </h1>
              <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                Vendeur Certifié
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Reversement vendeur : <strong>85%</strong> (Commission GESTE APP : 15%) · Paiements Flooz & TMoney & carte bancaire
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddProductOpen(true)}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publier une application</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Chiffre d’affaires brut</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">4 250 000 FCFA</span>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +18.4% ce mois
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Revenus nets (85%)</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-extrabold text-blue-700 block">3 612 500 FCFA</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Après déduction commission</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Solde retirable immédiat</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-700 block">1 850 000 FCFA</span>
          <button
            onClick={() => setActiveTab('payouts')}
            className="text-[11px] text-emerald-700 font-bold hover:underline mt-1 inline-block"
          >
            Demander un virement →
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Licences vendues</span>
            <KeyRound className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">78 licences</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Toutes versions confondues</span>
        </div>

      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'products', label: `Mes applications (${vendorProducts.length})`, icon: FileSpreadsheet },
          { id: 'licenses', label: 'Licences & Clients', icon: KeyRound },
          { id: 'payouts', label: 'Retraits de fonds', icon: DollarSign },
          { id: 'analytics', label: 'Évolution des ventes', icon: TrendingUp },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: VENDOR PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Applications en ligne</h2>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un fichier Excel</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Application</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Prix mensuel</th>
                  <th className="p-4">Prix annuel</th>
                  <th className="p-4">Ventes</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendorProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                          <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{prod.name}</p>
                          <span className="text-[10px] text-slate-400">v{prod.version} · {prod.fileFormat}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{prod.categoryName}</td>
                    <td className="p-4 text-slate-600">
                      {prod.licenseOptions.monthly ? api.formatCurrency(prod.licenseOptions.monthly) : '-'}
                    </td>
                    <td className="p-4 font-bold text-emerald-700">
                      {prod.licenseOptions.annual ? api.formatCurrency(prod.licenseOptions.annual) : api.formatCurrency(prod.basePrice)}
                    </td>
                    <td className="p-4 font-semibold text-slate-900">{prod.salesCount}</td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Active
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => addToast('Édition', `Formulaire de mise à jour pour ${prod.name} ouvert.`, 'info')}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LICENSES MANAGEMENT */}
      {activeTab === 'licenses' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Licences générées pour vos clients</h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <p className="font-bold text-slate-900">Gestion de stock Pro · Client : Jean Dupont</p>
                <p className="font-mono text-emerald-700 mt-0.5">Clé : EXCEL-STK-7789-2025</p>
              </div>
              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Actif (324 jours restants)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <p className="font-bold text-slate-900">Comptabilité Facile · Client : Amavi K.</p>
                <p className="font-mono text-emerald-700 mt-0.5">Clé : EXCEL-CPT-3312-2025</p>
              </div>
              <div className="text-right">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Expire bientôt (8 jours restants)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAYOUTS (RETRAITS) */}
      {activeTab === 'payouts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Request Payout Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Demander un retrait de gains</h3>
            <p className="text-xs text-slate-500">
              Solde disponible : <strong className="text-emerald-700">1 850 000 FCFA</strong>
            </p>

            <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Montant à retirer (FCFA)</label>
                <input
                  type="number"
                  min={10000}
                  max={1850000}
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Mode de réception</label>
                <select
                  value={payoutMethod}
                  onChange={e => setPayoutMethod(e.target.value as any)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium"
                >
                  <option value="flooz">Flooz Togo (Moov Money)</option>
                  <option value="tmoney">TMoney Togo (Togocom)</option>
                  <option value="bank_transfer">Virement Bancaire (UBA, Ecobank, Orabank)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Numéro de téléphone / IBAN</label>
                <input
                  type="text"
                  value={payoutPhone}
                  onChange={e => setPayoutPhone(e.target.value)}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Confirmer la demande de retrait
              </button>
            </form>
          </div>

          {/* Payouts History */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Historique des versements reçus</h3>
            <div className="space-y-2">
              {payouts.map(p => (
                <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 block">{api.formatCurrency(p.amount)}</span>
                    <span className="text-[11px] text-slate-400 capitalize">
                      Via {p.method} ({p.paymentDetails}) · {p.requestedAt}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {p.status === 'paid' ? 'Payé' : 'En attente'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: RECHARTS ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Évolution mensuelle des revenus</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toLocaleString('fr-FR')} FCFA`, 'Ventes']}
                />
                <Area type="monotone" dataKey="ventes" stroke="#10b981" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Modal: Add New Product from PC with Video */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        isAdmin={false}
        onProductCreated={(newProduct) => {
          setVendorProducts([newProduct, ...vendorProducts]);
        }}
      />

    </div>
  );
};
