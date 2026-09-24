import React from 'react';
import { FileSpreadsheet, ShieldCheck, Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  navigate: (route: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Column 1: Brand & Presentation */}
          <div className="lg:col-span-2">
            <div
              onClick={() => navigate('home')}
              className="flex items-center gap-2.5 cursor-pointer select-none group inline-flex mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                <span className="text-emerald-400">GESTE</span> APP
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              La première marketplace technologique spécialisée dans la vente de solutions logicielles,
              tableaux de bord automatisés et applications professionnelles pour entreprises et indépendants.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lomé, Togo · Déploiement international</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>informatiquegrace@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+228 91 59 95 78</span>
              </div>
            </div>

            {/* Payment methods accepted */}
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                Moyens de paiement acceptés
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-slate-800 text-emerald-400 text-xs px-2.5 py-1 rounded-md border border-slate-700 font-bold">
                  Flooz
                </span>
                <span className="bg-slate-800 text-yellow-400 text-xs px-2.5 py-1 rounded-md border border-slate-700 font-bold">
                  TMoney
                </span>
                <span className="bg-slate-800 text-blue-400 text-xs px-2.5 py-1 rounded-md border border-slate-700 font-bold">
                  Carte Bancaire
                </span>
                <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700">
                  PayPal
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Applications & Catégories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Catégories phares
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('applications', 'Excel')} className="hover:text-emerald-400 transition-colors">
                  Tableaux de bord Excel
                </button>
              </li>
              <li>
                <button onClick={() => navigate('applications', 'Gestion')} className="hover:text-emerald-400 transition-colors">
                  Gestion de stock & inventaire
                </button>
              </li>
              <li>
                <button onClick={() => navigate('applications', 'Comptabilité')} className="hover:text-emerald-400 transition-colors">
                  Comptabilité SYSCOHADA
                </button>
              </li>
              <li>
                <button onClick={() => navigate('applications', 'CRM')} className="hover:text-emerald-400 transition-colors">
                  CRM & Prospection client
                </button>
              </li>
              <li>
                <button onClick={() => navigate('applications', 'Éducation')} className="hover:text-emerald-400 transition-colors">
                  Gestion scolaire & Bulletins
                </button>
              </li>
              <li>
                <button onClick={() => navigate('applications', 'Agriculture')} className="hover:text-emerald-400 transition-colors">
                  Gestion agricole & Fermes
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Espace Vendeur & Développeurs */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Partenaires & Tech
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('become-seller')} className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1">
                  <span>Devenir vendeur</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-bold">85% reversement</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('license-verifier')} className="hover:text-emerald-400 transition-colors text-left">
                  API de vérification de licence
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-emerald-400 transition-colors">
                  Support développeurs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Informations légales & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Assistance & Légal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('support')} className="hover:text-emerald-400 transition-colors">
                  Centre d’aide & Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-emerald-400 transition-colors">
                  À propos de GESTE APP
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-emerald-400 transition-colors">
                  Conditions Générales de Vente
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacy')} className="hover:text-emerald-400 transition-colors">
                  Politique de confidentialité
                </button>
              </li>
              <li>
                <button onClick={() => navigate('refund')} className="hover:text-emerald-400 transition-colors">
                  Politique de remboursement
                </button>
              </li>
              <li>
                <button onClick={() => navigate('license-policy')} className="hover:text-emerald-400 transition-colors">
                  Politique des licences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & guarantees */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} GESTE APP. Tous droits réservés.</span>
            <span className="hidden sm:inline">· Plateforme SaaS pour l'Afrique et le Monde.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Licences cryptées & Authentifiées
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
