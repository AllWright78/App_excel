import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import { Product, License, User, PayoutRequest, Coupon } from '../types';
import { CreateUserModal } from '../components/common/CreateUserModal';
import { AddProductModal } from '../components/common/AddProductModal';
import {
  ShieldAlert,
  Users,
  DollarSign,
  TrendingUp,
  KeyRound,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  Tag,
  Store,
  Check,
  RotateCcw,
  UserPlus,
  UploadCloud,
  ShieldCheck,
  Video
} from 'lucide-react';

interface AdminDashboardPageProps {
  navigate: (route: string, param?: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { addToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'licenses' | 'users' | 'payouts' | 'coupons'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Modals state
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Search & Filter
  const [licenseSearch, setLicenseSearch] = useState('');
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

  // New coupon modal
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState(10);

  useEffect(() => {
    async function loadAdminData() {
      const [admStats, prods, usrs, pyts] = await Promise.all([
        api.getAdminStats(),
        api.getProducts({ includeUnpublished: true }),
        api.getAllUsers(),
        api.getSellerPayouts('user-seller')
      ]);
      setStats(admStats);
      setProducts(prods.products);
      setUsers(usrs);
      setPayouts(pyts);
      setCoupons([
        { id: 'c1', code: 'EXCEL10', type: 'percentage', value: 10, expiresAt: '2025-12-31', usageCount: 42, isActive: true },
        { id: 'c2', code: 'TOGO2025', type: 'fixed', value: 5000, expiresAt: '2025-12-31', usageCount: 18, isActive: true }
      ]);

      // Default demo licenses for admin view
      setLicenses([
        {
          id: 'lic-1',
          licenseKey: 'EXCEL-STK-7789-2025',
          productId: 'prod-1',
          productName: 'Gestion de stock Pro',
          productSlug: 'gestion-stock-pro',
          productLogo: '',
          userId: 'user-client-1',
          userName: 'Jean Dupont',
          userEmail: 'jean.dupont@entreprise.tg',
          orderId: 'ord-1',
          orderNumber: 'CMD-2025-1001',
          type: 'annual',
          status: 'active',
          startDate: '2025-01-10',
          expiresAt: '2026-01-10',
          activationsCount: 1,
          maxActivations: 2,
          version: '2.4.0'
        },
        {
          id: 'lic-2',
          licenseKey: 'EXCEL-CPT-3312-2025',
          productId: 'prod-2',
          productName: 'Comptabilité Facile',
          productSlug: 'comptabilite-facile',
          productLogo: '',
          userId: 'user-client-1',
          userName: 'Jean Dupont',
          userEmail: 'jean.dupont@entreprise.tg',
          orderId: 'ord-2',
          orderNumber: 'CMD-2025-1002',
          type: 'monthly',
          status: 'active',
          startDate: '2025-02-01',
          expiresAt: '2025-03-01',
          activationsCount: 1,
          maxActivations: 1,
          version: '1.8.2'
        },
        {
          id: 'lic-3',
          licenseKey: 'EXCEL-CRM-9901-2024',
          productId: 'prod-3',
          productName: 'CRM Entreprise',
          productSlug: 'crm-entreprise',
          productLogo: '',
          userId: 'user-client-2',
          userName: 'Paul Mensah',
          userEmail: 'paul.mensah@cabinet.tg',
          orderId: 'ord-3',
          orderNumber: 'CMD-2024-0099',
          type: 'annual',
          status: 'expired',
          startDate: '2024-01-01',
          expiresAt: '2025-01-01',
          activationsCount: 0,
          maxActivations: 3,
          version: '3.0.0'
        }
      ]);
    }
    loadAdminData();
  }, []);

  const handleToggleProductStatus = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    try {
      const updated = product.status === 'approved'
        ? await api.rejectProduct(productId)
        : await api.approveProduct(productId);
      setProducts(prev => prev.map(p => p.id === productId ? updated : p));
      addToast('Statut mis à jour', 'La visibilité du produit a été modifiée sur la marketplace.', 'info');
    } catch (error: any) {
      addToast('Erreur', error.message || 'Impossible de modifier le statut de cette application.', 'error');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Supprimer définitivement « ${product.name} » ? Cette action est irréversible.`)) {
      return;
    }

    try {
      await api.deleteProduct(product.id);
      setProducts(prev => prev.filter(item => item.id !== product.id));
      addToast('Application supprimée', 'L’application a été supprimée définitivement du catalogue.', 'success');
    } catch (error: any) {
      addToast('Erreur', error.message || 'Impossible de supprimer cette application.', 'error');
    }
  };

  const handleUpdateUserRole = async (userId: string, nextRole: 'admin' | 'seller' | 'client') => {
    try {
      const updated = await api.updateUser(userId, {
        role: nextRole,
        sellerStatus: nextRole === 'seller' ? 'approved' : undefined
      });
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      addToast('Rôle modifié', `${updated.name} est maintenant ${nextRole === 'seller' ? 'Vendeur' : nextRole === 'admin' ? 'Administrateur' : 'Client'}.`, 'success');
    } catch (error: any) {
      addToast('Erreur', error.message || 'Impossible de modifier ce rôle.', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      addToast('Compte supprimé', 'Le compte a été retiré de la plateforme.', 'info');
    } catch (error: any) {
      addToast('Erreur', error.message || 'Impossible de supprimer ce compte.', 'error');
    }
  };

  const handleToggleArchiveUser = async (userId: string, currentArchived: boolean) => {
    try {
      const updated = await api.archiveUser(userId, !currentArchived);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      addToast(
        currentArchived ? 'Compte restauré' : 'Compte archivé',
        currentArchived ? `${updated.name} a été réactivé.` : `${updated.name} a été archivé et ne peut plus se connecter.`,
        currentArchived ? 'success' : 'warning'
      );
    } catch (error: any) {
      addToast('Erreur', error.message || 'Impossible d’archiver ce compte.', 'error');
    }
  };

  const handleApprovePayout = (payoutId: string) => {
    setPayouts(prev =>
      prev.map(p => (p.id === payoutId ? { ...p, status: 'paid' } : p))
    );
    addToast('Paiement validé', 'Le virement vendeur Flooz/TMoney a été approuvé.', 'success');
  };

  const handleRevokeLicense = (licenseId: string) => {
    setLicenses(prev =>
      prev.map(l => (l.id === licenseId ? { ...l, status: 'suspended' } : l))
    );
    addToast('Licence révoquée', 'La clé a été immédiatement invalidée sur l’API.', 'warning');
  };

  const handleExtendLicense = (licenseId: string) => {
    setLicenses(prev =>
      prev.map(l =>
        l.id === licenseId
          ? { ...l, status: 'active', expiresAt: '2026-12-31' }
          : l
      )
    );
    addToast('Licence prolongée', 'La date d’expiration a été étendue de 365 jours.', 'success');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const newCoupon: Coupon = {
      id: 'cpn-' + Date.now(),
      code: couponCode.trim().toUpperCase(),
      type: couponType,
      value: couponValue,
      expiresAt: '2025-12-31',
      usageCount: 0,
      isActive: true
    };
    setCoupons([newCoupon, ...coupons]);
    setCouponCode('');
    addToast('Code promo créé', `Le code ${newCoupon.code} est désormais actif.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Super Admin Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Super Administration GESTE APP
              </h1>
              <span className="bg-purple-500/30 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-400/40">
                Accès Super Root
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Contrôle complet de la marketplace, serveurs de licences, vendeurs et commissions.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('license-verifier')}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-colors"
        >
          Console API Licences
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500">Volume Ventes Brut</p>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">28 450 000 F</p>
          <span className="text-[10px] text-emerald-600 font-semibold">+22.4%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500">Commissions (15%)</p>
          <p className="text-lg sm:text-xl font-extrabold text-purple-700 mt-1">4 267 500 F</p>
          <span className="text-[10px] text-slate-400">Revenus plateforme</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500">Utilisateurs inscrits</p>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">1 248</p>
          <span className="text-[10px] text-slate-400">Clients & Acheteurs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500">Vendeurs certifiés</p>
          <p className="text-lg sm:text-xl font-extrabold text-blue-700 mt-1">236</p>
          <span className="text-[10px] text-slate-400">Développeurs & Pros</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500">Applications Excel</p>
          <p className="text-lg sm:text-xl font-extrabold text-emerald-700 mt-1">{products.length}</p>
          <span className="text-[10px] text-slate-400">Au catalogue actif</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] text-slate-500">Licences actives</p>
          <p className="text-lg sm:text-xl font-extrabold text-emerald-700 mt-1">4 120</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Serveur en ligne</span>
        </div>

      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Vue d’ensemble', icon: TrendingUp },
          { id: 'products', label: `Catalogue (${products.length})`, icon: FileSpreadsheet },
          { id: 'licenses', label: 'Gestion des Licences', icon: KeyRound },
          { id: 'users', label: `Utilisateurs (${users.length})`, icon: Users },
          { id: 'payouts', label: `Demandes de Retrait (${payouts.length})`, icon: DollarSign },
          { id: 'coupons', label: `Codes Promo (${coupons.length})`, icon: Tag },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Modération & Catalogue des Applications</h2>
              <p className="text-xs text-slate-500">
                Gérez les solutions en ligne, ajoutez de nouvelles applications depuis votre PC avec vidéo de démo.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une application (Depuis PC)</span>
              </button>

              <button
                onClick={() => navigate('applications')}
                className="text-xs font-bold text-purple-700 hover:underline"
              >
                Voir la boutique →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Application</th>
                  <th className="p-4">Vendeur</th>
                  <th className="p-4">Fichier & Vidéo</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Prix de base</th>
                  <th className="p-4">Ventes</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Action modération</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{prod.name}</p>
                      <p className="text-[10px] text-slate-400">v{prod.version || '1.0.0'}</p>
                    </td>
                    <td className="p-4 text-slate-600">{prod.vendorName}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {prod.sourceFileData && (
                          <a
                            href={prod.sourceFileData}
                            download={prod.sourceFileName || 'Application_Excel.xlsm'}
                            onClick={() => addToast('Téléchargement lancé', prod.sourceFileName || 'Fichier de l’application', 'success')}
                            className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 hover:bg-emerald-200"
                          >
                            <UploadCloud className="w-3 h-3" />
                            <span>Télécharger</span>
                          </a>
                        )}
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                          {prod.fileFormat || '.xlsm'}
                        </span>
                        {prod.demoVideoUrl && (
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            <span>Vidéo</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{prod.categoryName}</td>
                    <td className="p-4 font-bold text-emerald-700">{api.formatCurrency(prod.basePrice)}</td>
                    <td className="p-4 text-slate-700 font-semibold">{prod.salesCount}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        prod.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {prod.status === 'approved' ? 'En ligne' : 'Masqué'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleProductStatus(prod.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg ${
                          prod.status === 'approved'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {prod.status === 'approved' ? 'Suspendre' : 'Approuver'}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod)}
                        className="ml-2 inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                      >
                        <Trash2 className="w-3 h-3" />
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

      {/* TAB: LICENSES */}
      {activeTab === 'licenses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registre des Licences Logicielles</h2>
              <p className="text-xs text-slate-500">
                Recherchez une clé client, prolongez la validité ou révoquez l'accès à distance.
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher clé (ex: EXCEL-...)"
                value={licenseSearch}
                onChange={e => setLicenseSearch(e.target.value)}
                className="bg-slate-50 text-xs pl-8 pr-4 py-2 rounded-xl border border-slate-200 w-64"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Clé de Licence</th>
                  <th className="p-4">Application</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Expiration</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {licenses
                  .filter(l => l.licenseKey.toLowerCase().includes(licenseSearch.toLowerCase()) || l.productName.toLowerCase().includes(licenseSearch.toLowerCase()))
                  .map(lic => (
                    <tr key={lic.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-emerald-800">{lic.licenseKey}</td>
                      <td className="p-4 font-semibold text-slate-900">{lic.productName}</td>
                      <td className="p-4 text-slate-600">{lic.userName}</td>
                      <td className="p-4 capitalize text-slate-600">{lic.type}</td>
                      <td className="p-4 text-slate-600">{lic.expiresAt}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          lic.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lic.status === 'suspended'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {lic.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleExtendLicense(lic.id)}
                          className="text-xs font-semibold text-emerald-700 hover:underline"
                        >
                          +1 an
                        </button>
                        <button
                          onClick={() => handleRevokeLicense(lic.id)}
                          className="text-xs font-semibold text-rose-600 hover:underline"
                        >
                          Révoquer
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Demandes de retraits vendeurs</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">ID Demande</th>
                  <th className="p-4">Vendeur</th>
                  <th className="p-4">Montant</th>
                  <th className="p-4">Moyen de paiement</th>
                  <th className="p-4">Coordonnées / Tél</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="p-4 font-semibold text-slate-800">Tech Solutions</td>
                    <td className="p-4 font-extrabold text-emerald-700">{api.formatCurrency(p.amount)}</td>
                    <td className="p-4 capitalize text-slate-600">{p.method}</td>
                    <td className="p-4 font-mono text-slate-800">{p.paymentDetails}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status === 'paid' ? 'Validé & Payé' : 'En attente'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {p.status === 'pending' ? (
                        <button
                          onClick={() => handleApprovePayout(p.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          Valider virement
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Traité</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Créer un code promo</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Code promo (ex: TOGO2025)</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Type de réduction</label>
                  <select
                    value={couponType}
                    onChange={e => setCouponType(e.target.value as any)}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (FCFA)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Valeur</label>
                  <input
                    type="number"
                    value={couponValue}
                    onChange={e => setCouponValue(Number(e.target.value))}
                    className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
              >
                Générer le code promo
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">Codes promotionnels actifs</h3>
            <div className="space-y-2">
              {coupons.map(cpn => (
                <div key={cpn.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-600" />
                    <div>
                      <span className="font-mono font-bold text-slate-900">{cpn.code}</span>
                      <span className="text-[11px] text-slate-500 ml-2">
                        {cpn.type === 'percentage' ? `-${cpn.value}%` : `-${api.formatCurrency(cpn.value)}`}
                      </span>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Actif ({cpn.usageCount} utilisations)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Gestion des Comptes & Rôles</h2>
              <p className="text-xs text-slate-500">
                Créez des administrateurs pour modérer la plateforme ou des comptes vendeurs pour publier des applications.
              </p>
            </div>

            <button
              onClick={() => setIsCreateUserOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Créer un compte (Admin ou Vendeur)</span>
            </button>
          </div>

          {/* Super Admin Info Card */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                ROOT
              </div>
              <div>
                <p className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <span>Super Administrateur Maître :</span>
                  <span className="font-mono bg-purple-200/80 px-2 py-0.5 rounded text-purple-900">moumouniabdoulmalik29@gmail.com</span>
                </p>
                <p className="text-[11px] text-purple-700">
                  Droit souverain d'attribution des rôles, gestion des commissions et validation des serveurs de licences.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold bg-purple-200 text-purple-800 px-2.5 py-1 rounded-full uppercase shrink-0">
              Super Admin Actif
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Utilisateur</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Téléphone</th>
                  <th className="p-4">Rôle</th>
                  <th className="p-4">Commission / Infos</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => {
                  const isSuperAdmin = u.email === 'moumouniabdoulmalik29@gmail.com';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{u.name}</span>
                          {isSuperAdmin && (
                            <span className="bg-purple-100 text-purple-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                              SUPER
                            </span>
                          )}
                        </div>
                        {(u.companyName || u.company) && (
                          <span className="text-[10px] text-slate-400 block">{u.companyName || u.company}</span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-slate-600">{u.email}</td>
                      <td className="p-4 text-slate-600">{u.phone || 'Non renseigné'}</td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'seller'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.role === 'super_admin'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role === 'seller' ? 'Vendeur' : u.role === 'super_admin' ? 'Super Admin' : u.role === 'admin' ? 'Admin' : 'Client'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        {u.role === 'seller'
                          ? `Commission : ${u.commissionRate || 85}%`
                          : u.role === 'admin'
                          ? 'Accès Modération'
                          : u.role === 'super_admin'
                          ? 'Accès Total'
                          : 'Acheteur'}
                      </td>
                      <td className="p-4">
                        {u.isArchived ? (
                          <span className="text-rose-600 font-semibold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Archivé</span>
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Actif</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {!isSuperAdmin ? (
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            {u.role === 'client' && (
                              <button
                                onClick={() => handleUpdateUserRole(u.id, 'seller')}
                                className="text-[11px] font-semibold text-emerald-700 hover:underline"
                              >
                                Passer Vendeur
                              </button>
                            )}
                            {u.role === 'seller' && (
                              <button
                                onClick={() => handleUpdateUserRole(u.id, 'admin')}
                                className="text-[11px] font-semibold text-purple-700 hover:underline"
                              >
                                Promouvoir Admin
                              </button>
                            )}
                            {u.role === 'admin' && (
                              <button
                                onClick={() => handleUpdateUserRole(u.id, 'client')}
                                className="text-[11px] font-semibold text-slate-700 hover:underline"
                              >
                                Rétrograder Client
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleArchiveUser(u.id, Boolean(u.isArchived))}
                              className="text-[11px] font-semibold text-amber-700 hover:underline"
                              title={u.isArchived ? 'Restaurer l’utilisateur' : 'Archiver l’utilisateur'}
                            >
                              {u.isArchived ? 'Désarchiver' : 'Archiver'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-[11px] text-rose-600 hover:text-rose-800 font-medium"
                              title="Supprimer l'utilisateur"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 italic">Protégé</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Product from PC with Video */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        isAdmin={true}
        onProductCreated={(newProd) => {
          setProducts(prev => [newProd, ...prev.filter(product => product.id !== newProd.id)]);
          addToast(
            'Application publiée',
            `${newProd.name} est maintenant visible dans la boutique et sur l’accueil.`,
            'success'
          );
        }}
      />

      {/* Modal: Create User (Admin or Vendeur) by Super Admin */}
      <CreateUserModal
        isOpen={isCreateUserOpen}
        onClose={() => setIsCreateUserOpen(false)}
        onUserCreated={(newUser) => {
          setUsers([newUser, ...users]);
        }}
      />

    </div>
  );
};
