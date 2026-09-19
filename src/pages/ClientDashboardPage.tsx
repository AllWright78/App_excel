import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import { License, Order } from '../types';
import {
  KeyRound,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  RefreshCw,
  Clock,
  ShieldCheck,
  ShoppingBag,
  FileText,
  MessageSquare,
  User as UserIcon,
  AlertTriangle,
  Monitor,
  Send
} from 'lucide-react';

interface ClientDashboardPageProps {
  navigate: (route: string, param?: string) => void;
}

export const ClientDashboardPage: React.FC<ClientDashboardPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<'licenses' | 'orders' | 'messages' | 'profile'>('licenses');
  const [licenses, setLicenses] = useState<License[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Support message state
  const [supportMessage, setSupportMessage] = useState('');
  const [messagesList, setMessagesList] = useState([
    {
      id: 'msg-1',
      sender: 'Support APP EXCEL',
      time: 'Hier à 15:20',
      text: 'Bonjour Jean, votre licence pour CRM Entreprise a bien été activée. Avez-vous besoin d’aide pour la synchronisation des colonnes ?',
      isStaff: true
    }
  ]);

  useEffect(() => {
    async function loadClientData() {
      setLoading(true);
      const userId = user ? user.id : 'user-client-1';
      const [userLicenses, userOrders] = await Promise.all([
        api.getLicensesByUser(userId),
        api.getOrdersByUser(userId)
      ]);
      setLicenses(userLicenses);
      setOrders(userOrders);
      setLoading(false);
    }
    loadClientData();
  }, [user]);

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    addToast('Copié !', `Clé de licence ${key} copiée dans le presse-papier.`, 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleRenew = (license: License) => {
    addToast('Renouvellement enclenché', `Votre licence ${license.productName} a été prolongée de 365 jours.`, 'success');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setMessagesList([
      ...messagesList,
      {
        id: 'msg-' + Date.now(),
        sender: user?.name || 'Moi',
        time: 'À l’instant',
        text: supportMessage.trim(),
        isStaff: false
      }
    ]);
    setSupportMessage('');
    addToast('Message envoyé', 'Le support ou le vendeur vous répondra sous 2h.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {user?.name.charAt(0) || 'J'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Espace Client : {user?.name || 'Jean Dupont'}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Compte Vérifié
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {user?.email || 'jean.dupont@entreprise.tg'} · Lomé, Togo · {licenses.length} licence(s) active(s)
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('applications')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
        >
          Acheter une nouvelle application
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'licenses', label: `Mes licences (${licenses.length})`, icon: KeyRound },
          { id: 'orders', label: `Mes commandes (${orders.length})`, icon: ShoppingBag },
          { id: 'messages', label: 'Support & Assistance', icon: MessageSquare },
          { id: 'profile', label: 'Paramètres du compte', icon: UserIcon },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LICENSES & DOWNLOADS */}
      {activeTab === 'licenses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Mes licences logicielles</h2>
              <p className="text-xs text-slate-500">
                Téléchargez vos applications Excel et gérez vos clés d'activation.
              </p>
            </div>
            <button
              onClick={() => navigate('license-verifier')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Tester la clé sur l’API</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {licenses.map(license => {
              const isExpired = license.status === 'expired' || (license.expiresAt ? new Date(license.expiresAt) < new Date() : false);
              const isExpiringSoon = !isExpired && !!license.expiresAt && (new Date(license.expiresAt).getTime() - Date.now()) < 15 * 86400000;

              return (
                <div
                  key={license.id}
                  className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between gap-5 transition-all ${
                    isExpired
                      ? 'border-rose-200'
                      : isExpiringSoon
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <div>
                    {/* Header: Title and status badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-slate-900 text-white flex items-center justify-center font-bold">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{license.productName}</h3>
                          <span className="text-[11px] text-slate-500">
                            Type: <strong className="capitalize text-slate-700">{license.type === 'monthly' ? 'Mensuelle' : license.type === 'lifetime' ? 'Achat unique' : 'Annuelle'}</strong>
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isExpired
                            ? 'bg-rose-100 text-rose-800'
                            : isExpiringSoon
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isExpired ? 'Expirée' : isExpiringSoon ? 'Expire bientôt' : 'Active'}
                      </span>
                    </div>

                    {/* License Key Box */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <KeyRound className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-mono text-xs font-bold text-slate-800 truncate">
                          {license.licenseKey}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(license.licenseKey)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                        title="Copier la clé"
                      >
                        {copiedKey === license.licenseKey ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Expiration Info */}
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Expiration : {license.expiresAt || 'À vie'}</span>
                      </div>
                      <span className="text-slate-600 font-medium">
                        Postes activés : {license.activationsCount}/{license.maxActivations}
                      </span>
                    </div>

                    {/* Warning if expiring soon */}
                    {isExpiringSoon && (
                      <div className="mt-2.5 p-2 rounded-lg bg-amber-100/80 text-amber-900 text-[11px] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Votre licence expire dans moins de 15 jours. Pensez à renouveler.</span>
                      </div>
                    )}
                  </div>

                  {/* Actions: Download & Renew */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={api.createSecureDownloadUrl(license.licenseKey, license.productId)}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger (.xlsm)</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleRenew(license)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Renouveler</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS & INVOICES */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Historique des commandes</h2>
            <p className="text-xs text-slate-500">
              Consultez le statut de vos paiements et téléchargez vos factures d'achat.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">N° Commande</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Articles</th>
                    <th className="p-4">Paiement</th>
                    <th className="p-4">Montant Total</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Facture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">{order.orderNumber}</td>
                      <td className="p-4 text-slate-600">{order.createdAt}</td>
                      <td className="p-4 text-slate-800">
                        {order.items.map(item => item.productName).join(', ')}
                      </td>
                      <td className="p-4 text-slate-600 capitalize">
                        {order.paymentMethod === 'flooz' ? 'Flooz Togo' : order.paymentMethod === 'tmoney' ? 'TMoney Togo' : 'Carte Bancaire'}
                      </td>
                      <td className="p-4 font-extrabold text-emerald-700">
                        {api.formatCurrency(order.totalAmount)}
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Payé & Livré
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => addToast('Téléchargement', `Facture ${order.orderNumber}.pdf générée.`, 'success')}
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SUPPORT & MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Support & Assistance Technique</h2>
            <p className="text-xs text-slate-500">
              Posez vos questions sur vos classeurs Excel, formules ou clés de licence.
            </p>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200">
            {messagesList.map(msg => (
              <div
                key={msg.id}
                className={`p-3.5 rounded-xl max-w-md ${
                  msg.isStaff
                    ? 'bg-white border border-slate-200 text-slate-800 mr-auto'
                    : 'bg-emerald-600 text-white ml-auto'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-[11px] font-bold ${msg.isStaff ? 'text-emerald-700' : 'text-emerald-100'}`}>
                    {msg.sender}
                  </span>
                  <span className={`text-[10px] ${msg.isStaff ? 'text-slate-400' : 'text-emerald-200'}`}>
                    {msg.time}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Écrivez votre message..."
              value={supportMessage}
              onChange={e => setSupportMessage(e.target.value)}
              className="flex-1 bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Informations du compte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-500 block mb-1">Nom complet</label>
              <input type="text" defaultValue={user?.name || 'Jean Dupont'} className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Email</label>
              <input type="email" defaultValue={user?.email || 'jean.dupont@entreprise.tg'} className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Téléphone</label>
              <input type="tel" defaultValue={user?.phone || '+228 90 12 34 56'} className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200" />
            </div>
            <div>
              <label className="text-slate-500 block mb-1">Entreprise</label>
              <input type="text" defaultValue="SARL Horizon Commerce" className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200" />
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={() => addToast('Profil sauvegardé', 'Vos coordonnées ont été mises à jour.', 'success')}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
