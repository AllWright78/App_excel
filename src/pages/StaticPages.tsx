import React, { useState } from 'react';
import { Category, Product } from '../types';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import {
  FileSpreadsheet,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Store,
  ArrowRight,
  HelpCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface StaticPageProps {
  type: 'categories' | 'subscriptions' | 'sellers' | 'become-seller' | 'about' | 'contact' | 'terms' | 'privacy' | 'refund' | 'license-policy' | 'support';
  navigate: (route: string, param?: string) => void;
  categories?: Category[];
}

export const StaticPages: React.FC<StaticPageProps> = ({ type, navigate, categories = [] }) => {
  const { addToast } = useNotifications();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerSpecialty, setSellerSpecialty] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Message envoyé', 'Notre équipe technique vous répondra dans un délai de 2 heures.', 'success');
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  const handleSellerApply = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Candidature reçue', 'Votre demande pour devenir vendeur sur APP EXCEL est en cours de validation.', 'success');
    setSellerName('');
    setSellerSpecialty('');
  };

  if (type === 'categories') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Toutes les catégories</h1>
          <p className="text-sm text-slate-500 mt-1">Explorez les solutions Excel et numériques classées par corps de métier.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => navigate('applications', cat.slug)}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1.5">{cat.description}</p>
              <span className="inline-block mt-4 text-xs font-semibold text-emerald-700">
                {cat.productCount} applications disponibles →
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'subscriptions') {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">Nos modèles de licences logicielles</h1>
          <p className="text-sm text-slate-500">
            Une flexibilité totale pour équiper votre entreprise : testez au mois, rentabilisez à l’année ou optez pour la possession définitive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Licence Mensuelle</h3>
            <p className="text-xs text-slate-500">30 jours d'utilisation pour un besoin temporaire ou tester les fonctionnalités.</p>
            <div className="text-2xl font-black text-slate-900">Dès 15 000 FCFA <span className="text-xs font-normal text-slate-400">/mois</span></div>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Accès complet aux macros</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 1 Poste de travail</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Support client</li>
            </ul>
            <button onClick={() => navigate('applications')} className="w-full py-2.5 rounded-xl border border-emerald-600 text-emerald-700 font-bold text-xs hover:bg-emerald-50">
              Voir les applications
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-xl space-y-4 relative">
            <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
              Plus Populaire
            </span>
            <h3 className="text-lg font-bold text-slate-900">Licence Annuelle</h3>
            <p className="text-xs text-slate-500">365 jours de sérénité avec toutes les mises à jour fiscales et logicielles incluses.</p>
            <div className="text-2xl font-black text-emerald-700">Dès 45 000 FCFA <span className="text-xs font-normal text-slate-400">/an</span></div>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Économie de 40% vs mensuel</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mises à jour v2 et correctifs</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Support prioritaire 7j/7</li>
            </ul>
            <button onClick={() => navigate('applications')} className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700">
              Choisir une application
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Achat Unique (À vie)</h3>
            <p className="text-xs text-slate-500">Acquérez le classeur définitivement, sans redevance périodique.</p>
            <div className="text-2xl font-black text-slate-900">Dès 90 000 FCFA <span className="text-xs font-normal text-slate-400">une seule fois</span></div>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Aucune expiration de clé</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Multi-postes inclus</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Code VBA modifiable</li>
            </ul>
            <button onClick={() => navigate('applications')} className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50">
              Voir le catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'become-seller') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Programme Partenaires</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Devenez vendeur sur APP EXCEL</h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Monétisez vos compétences Excel, développements VBA et logiciels de gestion auprès d'entreprises en Afrique et dans le monde.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white rounded-2xl border border-slate-200">
            <div className="text-3xl font-black text-emerald-600 mb-1">85%</div>
            <h4 className="text-xs font-bold text-slate-900">Reversement Vendeur</h4>
            <p className="text-[11px] text-slate-500 mt-1">Vous touchez 85% du prix de vente sur chaque licence.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200">
            <div className="text-3xl font-black text-emerald-600 mb-1">Flooz / TMoney</div>
            <h4 className="text-xs font-bold text-slate-900">Retraits instantanés</h4>
            <p className="text-[11px] text-slate-500 mt-1">Vos gains sont transférés directement sur votre compte mobile money.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200">
            <div className="text-3xl font-black text-emerald-600 mb-1">API Anti-Copie</div>
            <h4 className="text-xs font-bold text-slate-900">Protection logicielle</h4>
            <p className="text-[11px] text-slate-500 mt-1">Vos fichiers sont protégés par notre serveur de licences.</p>
          </div>
        </div>

        <form onSubmit={handleSellerApply} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4 max-w-xl mx-auto text-xs">
          <h3 className="text-base font-bold text-slate-900">Formulaire de candidature vendeur</h3>
          <div>
            <label className="text-slate-700 font-semibold block mb-1">Nom du créateur ou de l'entreprise</label>
            <input
              type="text"
              required
              value={sellerName}
              onChange={e => setSellerName(e.target.value)}
              placeholder="Ex: Expert Gestion Solutions"
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div>
            <label className="text-slate-700 font-semibold block mb-1">Spécialité logicielle</label>
            <input
              type="text"
              required
              value={sellerSpecialty}
              onChange={e => setSellerSpecialty(e.target.value)}
              placeholder="Ex: Comptabilité SYSCOHADA, Modèles Agricoles..."
              className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md">
            Envoyer ma candidature
          </button>
        </form>
      </div>
    );
  }

  if (type === 'contact') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Contactez l’équipe APP EXCEL</h1>
          <p className="text-sm text-slate-500 mt-1">Notre support technique basé à Lomé est disponible 7j/7 pour vous assister.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Adresse</h4>
                <p className="text-xs text-slate-500 mt-0.5">Boulevard du 13 Janvier, Lomé, Togo</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Téléphone / WhatsApp</h4>
                <p className="text-xs text-slate-500 mt-0.5">+228 90 00 11 22 / +228 91 88 77 66</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Email</h4>
                <p className="text-xs text-slate-500 mt-0.5">contact@appexcel.tg / support@appexcel.tg</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <div>
              <label className="text-slate-700 font-bold block mb-1">Votre nom</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold block mb-1">Votre email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-700 font-bold block mb-1">Message</label>
              <textarea
                rows={4}
                required
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs">
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Legal / Terms / Refund
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-slate-600 text-sm leading-relaxed">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize">
        {type === 'terms' ? 'Conditions Générales de Vente' : type === 'privacy' ? 'Politique de Confidentialité' : type === 'refund' ? 'Politique de Remboursement' : 'Politique des Licences'}
      </h1>

      <p>
        La marketplace APP EXCEL assure la distribution sécurisée de produits logiciels et de classeurs automatisés.
        Toute commande passée via Flooz, TMoney, Carte Bancaire ou Espèces est régie par les présentes clauses.
      </p>

      <h3 className="text-base font-bold text-slate-800 pt-3">1. Livraison numérique et licences</h3>
      <p>
        Dès confirmation du paiement par les opérateurs de téléphonie ou passerelles bancaires, la clé d'activation et le lien de téléchargement sont automatiquement générés et transmis au client.
      </p>

      <h3 className="text-base font-bold text-slate-800 pt-3">2. Politique de remboursement</h3>
      <p>
        Conformément aux dispositions relatives aux contenus numériques personnalisés avec clé de licence active, les remboursements ne sont acceptés que si un dysfonctionnement technique avéré ne peut être résolu par le support sous 72 heures.
      </p>
    </div>
  );
};
