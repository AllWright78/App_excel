import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import { PaymentMethod, Order, Product } from '../types';
import { VideoDemoModal } from '../components/common/VideoDemoModal';
import { PaymentGatewayFactory, PaymentRequest } from '../services/payment';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Truck,
  Lock,
  CheckCircle2,
  ArrowLeft,
  FileSpreadsheet,
  Download,
  KeyRound,
  ExternalLink,
  Play,
  UserPlus,
  Zap,
  Radio
} from 'lucide-react';

const ADMIN_MOBILE_NUMBER = '91 59 95 78';

interface CheckoutPageProps {
  navigate: (route: string, param?: string) => void;
  onOrderCompleted?: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate, onOrderCompleted }) => {
  const { items, itemCount, subtotal, discount, total, coupon, clearCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const { addToast } = useNotifications();

  // Video demo modal state
  const [selectedProductForVideo, setSelectedProductForVideo] = useState<Product | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+228 90 12 34 56');
  const [customerCompany, setCustomerCompany] = useState('SARL Horizon Commerce');
  const [customerCountry, setCustomerCountry] = useState('Togo');
  const [customerCity, setCustomerCity] = useState('Lomé');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('flooz');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('+228 99 88 77 66');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [mobilePaymentOpen, setMobilePaymentOpen] = useState(false);
  const [mobilePaymentConfirmed, setMobilePaymentConfirmed] = useState(false);

  const launchMobileMoneyMenu = () => {
    const ussdCode = paymentMethod === 'flooz' ? '*155#' : '*145#';
    window.location.href = `tel:${encodeURIComponent(ussdCode)}`;
  };

  React.useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (user.phone && (!customerPhone || customerPhone === '+228 90 12 34 56')) setCustomerPhone(user.phone);
    }
  }, [user]);

  // If cart is empty and no completed order, go back
  if (items.length === 0 && !completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-600 text-sm">Votre panier est vide.</p>
        <button
          onClick={() => navigate('applications')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
        >
          Retourner aux applications
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict requirement: User must create an account / login before checkout
    if (!user) {
      addToast(
        'Compte requis',
        'Veuillez créer un compte ou vous connecter avant de valider votre commande.',
        'warning'
      );
      openAuthModal('register', 'Création de compte requise pour commander et recevoir vos licences.');
      return;
    }

    if (!acceptTerms) {
      addToast('Attention', 'Veuillez accepter les Conditions Générales de Vente pour continuer.', 'warning');
      return;
    }

    if ((paymentMethod === 'flooz' || paymentMethod === 'tmoney') && !mobilePaymentConfirmed) {
      setMobilePaymentOpen(true);
      launchMobileMoneyMenu();
      return;
    }

    setProcessing(true);

    try {
      const activeUser = user;
      const orderNumber = `CMD-2025-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Resolve formal PaymentGateway based on selected provider
      const gateway = PaymentGatewayFactory.getGateway(paymentMethod);

      // 2. Prepare PaymentRequest for gateway
      const paymentRequest: PaymentRequest = {
        orderId: `temp-ord-${Date.now()}`,
        orderNumber,
        amount: total,
        currency: 'FCFA',
        customer: {
          id: activeUser.id,
          name: customerName || activeUser.name,
          email: customerEmail || activeUser.email,
          phone: customerPhone || activeUser.phone,
          country: customerCountry,
          city: customerCity
        },
        paymentMethod,
        description: `Achat GESTE APP - Commande ${orderNumber}`,
        paymentDetails: {
          phoneNumber: mobileMoneyNumber || customerPhone,
          cardNumber,
          cardExp: cardExpiry,
          cardCvc,
          cardHolder: customerName || activeUser.name
        }
      };

      // 3. Process payment via the formal PaymentGateway (Flooz / TMoney / Stripe)
      const paymentResult = await gateway.processPayment(paymentRequest);

      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'La passerelle de paiement a refusé la transaction.');
      }

      // 4. Record transaction in database BEFORE confirming the order
      const recordedTx = await api.recordTransaction({
        transactionReference: paymentResult.transactionReference,
        orderNumber,
        userId: activeUser.id,
        userName: customerName || activeUser.name,
        userEmail: customerEmail || activeUser.email,
        amount: total,
        currency: 'FCFA',
        provider: (paymentMethod === 'card' ? 'stripe' : paymentMethod) as any,
        status: paymentResult.status === 'success' ? 'success' : 'pending',
        paymentDetails: {
          ...paymentRequest.paymentDetails,
          providerName: gateway.providerName,
          ussdPrompt: paymentResult.ussdPrompt,
          recipientName: 'GESTE APP',
          recipientMobileNumber: ADMIN_MOBILE_NUMBER.replace(/\s/g, ''),
          paymentInstruction: `Transfert mobile money vers ${ADMIN_MOBILE_NUMBER}`
        },
        gatewayResponse: paymentResult.gatewayResponse
      });

      // 5. Finalize and confirm order in database linked with the transaction
      const result = await api.createOrder({
        user: activeUser,
        items,
        paymentMethod: paymentMethod === 'card' ? 'stripe' : paymentMethod,
        couponCode: coupon?.code,
        transactionId: recordedTx.transactionReference,
        orderNumber,
        transactionReference: recordedTx.transactionReference,
        paymentStatus: paymentResult.status === 'success' ? 'success' : 'pending',
        deliveryNotes: `Validé via ${gateway.providerName}. Réf: ${paymentResult.transactionReference}`
      });

      // 6. Update recorded transaction with generated orderId
      await api.updateTransaction(recordedTx.id, {
        orderId: result.order.id,
        orderNumber: result.order.orderNumber
      });

      setCompletedOrder(result.order);
      clearCart();
      if (onOrderCompleted) onOrderCompleted(result.order);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 }
      });

      addToast(
        'Paiement validé avec succès !',
        `Transaction enregistrée (${recordedTx.transactionReference}). Commande confirmée et licences activées.`,
        'success'
      );
      setMobilePaymentConfirmed(false);
    } catch (err: any) {
      addToast('Erreur de paiement', err.message || 'Une erreur est survenue lors du paiement.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const confirmMobilePayment = () => {
    setMobilePaymentOpen(false);
    setMobilePaymentConfirmed(true);
    addToast(
      'Paiement mobile confirmé',
      'La commande va maintenant être enregistrée après vérification de la transaction.',
      'info'
    );
  };

  // SUCCESS VIEW: After Order Completed
  if (completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
        
        {/* Success Header */}
        <div className="bg-emerald-600 text-white rounded-3xl p-8 sm:p-10 text-center space-y-3 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Merci pour votre commande !</h1>
          <p className="text-emerald-100 text-sm max-w-lg mx-auto">
            Votre paiement de <strong>{api.formatCurrency(completedOrder.totalAmount)}</strong> a été validé.
            Un e-mail de confirmation avec vos factures et fichiers a été envoyé à <strong>{completedOrder.userEmail}</strong>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-block bg-emerald-800/60 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider">
              COMMANDE N° {completedOrder.orderNumber}
            </div>
            {completedOrder.transactionId && (
              <div className="inline-block bg-emerald-900/80 px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider text-emerald-200">
                TRANSACTION N° {completedOrder.transactionId}
              </div>
            )}
          </div>
        </div>

        {/* Digital Delivery Box: Licenses & Downloads */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Vos licences & téléchargements immédiats</h3>
              <p className="text-xs text-slate-500">
                Vous pouvez télécharger vos fichiers Excel dès maintenant et copier votre clé de licence.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Statut: Payé & Actif
            </span>
          </div>

          <div className="space-y-4">
            {completedOrder.items.map((item, idx) => {
              const generatedKey = item.licenseKey || `EXCEL-${item.productName.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-2025`;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.productName}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="capitalize font-medium text-emerald-700">
                          Licence {item.licenseType === 'monthly' ? 'Mensuelle' : item.licenseType === 'lifetime' ? 'Achat Unique' : 'Annuelle'}
                        </span>
                        <span>·</span>
                        <span>Format: .xlsm</span>
                      </div>

                      {/* License Key Display */}
                      <div className="mt-2 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Clé d'activation: <strong>{generatedKey}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Immediate Download Button */}
                  <a
                    href={api.createSecureDownloadUrl(generatedKey, item.productId)}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger le classeur</span>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Quick links to client dashboard */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => navigate('dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Accéder à mon espace client (Mes licences)
            </button>

            <button
              onClick={() => navigate('applications')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Retourner à la boutique
            </button>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {mobilePaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Valider le paiement mobile</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Le menu {paymentMethod === 'flooz' ? 'Flooz (*155#)' : 'TMoney (*145#)'} doit s’ouvrir sur votre téléphone.
                </p>
              </div>
              <button type="button" onClick={() => setMobilePaymentOpen(false)} className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-2 text-sm">
              <p className="text-xs text-emerald-800 font-semibold">Envoyer exactement</p>
              <p className="text-2xl font-extrabold text-emerald-700">{api.formatCurrency(total)}</p>
              <p className="text-xs text-slate-700">
                Destinataire : <strong>GESTE APP</strong> · <strong>{ADMIN_MOBILE_NUMBER}</strong>
              </p>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600">
              <li>Ouvrez le menu {paymentMethod === 'flooz' ? 'Flooz' : 'TMoney'} sur votre téléphone.</li>
              <li>Choisissez « Transfert » et indiquez le numéro <strong>{ADMIN_MOBILE_NUMBER}</strong>.</li>
              <li>Indiquez le montant, puis saisissez votre code personnel.</li>
              <li>Revenez ici après le SMS de confirmation.</li>
            </ol>

            <div className="flex flex-col sm:flex-row gap-2">
              <button type="button" onClick={launchMobileMoneyMenu} className="flex-1 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold">
                Ouvrir le téléphone
              </button>
              <button type="button" onClick={confirmMobilePayment} className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                J’ai validé le paiement
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Ne partagez jamais votre code personnel avec GESTE APP.
            </p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('cart')}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Validation de la commande & Paiement
          </h1>
          <p className="text-xs text-slate-500">
            Complétez vos informations pour recevoir immédiatement vos logiciels et licences.
          </p>
        </div>
      </div>

      {/* Mandatory Account Creation Notification if Not Logged In */}
      {!user && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Compte client obligatoire pour commander
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                La commande requiert un compte enregistré pour générer vos clés de licence uniques, sécuriser vos téléchargements et émettre vos reçus.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => openAuthModal('login', 'Connectez-vous pour continuer votre commande')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register', 'Création immédiate de compte client')}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              Créer mon compte
            </button>
          </div>
        </div>
      )}

      {/* Payment API Realtime Monitor Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white">API de Paiement Active</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Moov Flooz API v2.4, Togocom TMoney Gateway & Passerelle Cartes SSL</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800">
            HTTP 200 OK · Webhook prêt
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Customer info & Payment choices (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Client Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Informations du destinataire</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nom complet <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Adresse e-mail (Réception des licences) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Numéro de téléphone WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Entreprise / Organisation
                </label>
                <input
                  type="text"
                  value={customerCompany}
                  onChange={e => setCustomerCompany(e.target.value)}
                  className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Pays
                </label>
                <select
                  value={customerCountry}
                  onChange={e => setCustomerCountry(e.target.value)}
                  className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden font-medium"
                >
                  <option value="Togo">Togo (Lomé, Kara, Sokodé, Atakpamé)</option>
                  <option value="Bénin">Bénin</option>
                  <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                  <option value="Sénégal">Sénégal</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Mali">Mali</option>
                  <option value="Niger">Niger</option>
                  <option value="France">France</option>
                  <option value="Autre">Autre pays international</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  value={customerCity}
                  onChange={e => setCustomerCity(e.target.value)}
                  className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* 2. Mode de paiement (Section 10) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Choisir le mode de paiement</span>
            </h3>

            {/* Payment Options Radio Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Flooz */}
              <label
                onClick={() => setPaymentMethod('flooz')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'flooz'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'flooz'}
                  onChange={() => setPaymentMethod('flooz')}
                  className="accent-emerald-600 mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Moov Money (Flooz)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Togo</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Paiement direct sans frais supplémentaires</p>
                </div>
              </label>

              {/* TMoney */}
              <label
                onClick={() => setPaymentMethod('tmoney')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'tmoney'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'tmoney'}
                  onChange={() => setPaymentMethod('tmoney')}
                  className="accent-emerald-600 mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Togocom (TMoney)</span>
                    <span className="text-[10px] bg-yellow-100 text-yellow-800 font-bold px-1.5 py-0.5 rounded">Togo</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Validation instantanée par push USSD</p>
                </div>
              </label>

              {/* Carte Bancaire */}
              <label
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-emerald-600 mt-1"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Carte Bancaire (Visa / Mastercard)</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Paiement international sécurisé SSL 256 bits</p>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-emerald-600 mt-1"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Paiement à la livraison</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pour livraison physique sur clé USB à Lomé</p>
                </div>
              </label>
            </div>

            {/* Specific Payment Input Fields */}
            {(paymentMethod === 'flooz' || paymentMethod === 'tmoney') && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Numéro de débit {paymentMethod === 'flooz' ? 'Flooz (Moov)' : 'TMoney (Togocom)'}</span>
                </div>
                <input
                  type="text"
                  value={mobileMoneyNumber}
                  onChange={e => setMobileMoneyNumber(e.target.value)}
                  placeholder="+228 90 00 00 00"
                  className="w-full bg-white text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono focus:outline-hidden"
                />
                <p className="text-[11px] text-slate-500">
                  Une invite de validation s'affichera sur votre téléphone pour autoriser le prélèvement de <strong>{api.formatCurrency(total)}</strong>.
                </p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Coordonnées de la carte</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="Numéro de carte"
                    className="w-full bg-white text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      placeholder="MM/AA"
                      className="bg-white text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono"
                    />
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      placeholder="CVC"
                      className="bg-white text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="accent-emerald-600 w-4 h-4 mt-0.5"
                />
                <span>
                  J’accepte les <button type="button" onClick={() => navigate('terms')} className="text-emerald-700 font-semibold underline">Conditions Générales de Vente</button> et la <button type="button" onClick={() => navigate('license-policy')} className="text-emerald-700 font-semibold underline">Politique des Licences logicielles</button>.
                </span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Pay Button (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xl space-y-6 sticky top-24">
            
            <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
              Récapitulatif ({itemCount} articles)
            </h3>

            {/* Mini Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-slate-100">
              {items.map(item => (
                <div key={`${item.product.id}-${item.licenseType}`} className="pt-2 first:pt-0">
                  <div className="flex items-start justify-between text-xs gap-2">
                    <div>
                      <p className="font-bold text-slate-800 line-clamp-1">{item.product.name}</p>
                      <span className="text-[10px] text-slate-400">
                        {item.licenseType === 'monthly' ? 'Mensuelle' : item.licenseType === 'lifetime' ? 'Achat unique' : 'Annuelle'} · Qté: {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-900 shrink-0">
                      {api.formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Video Demonstration button in checkout */}
                  <div className="mt-1 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProductForVideo(item.product);
                        setVideoModalOpen(true);
                      }}
                      className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded transition-colors"
                    >
                      <Play className="w-2.5 h-2.5 fill-emerald-600 text-emerald-600" />
                      <span>Voir démo vidéo</span>
                    </button>
                    <span className="text-[9px] text-slate-400">Vérifié Excel VBA</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Details */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total</span>
                <span className="font-bold text-slate-800">{api.formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Réduction promo</span>
                  <span>-{api.formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Frais de livraison numérique</span>
                <span className="font-bold text-emerald-600">Gratuit (0 FCFA)</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-slate-900">Total à régler</span>
                <span className="text-xl font-black text-emerald-700">{api.formatCurrency(total)}</span>
              </div>
            </div>

            {/* Submit Payment Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full py-4 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{processing ? 'Validation du paiement...' : `Valider et Payer ${api.formatCurrency(total)}`}</span>
            </button>

            <div className="text-center text-[11px] text-slate-400 space-y-1">
              <p>Authentification sécurisée · Clé de licence délivrée immédiatement</p>
              <p>Facture téléchargeable au format PDF dans votre espace</p>
            </div>

          </div>
        </div>

      </form>

      {/* Video Demonstration Modal */}
      <VideoDemoModal
        product={selectedProductForVideo}
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />
    </div>
  );
};
