import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface AuthModalProps {
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const {
    isAuthModalOpen,
    authModalMode,
    authModalReason,
    closeAuthModal,
    login,
    register,
    openAuthModal
  } = useAuth();
  const { addToast } = useNotifications();

  const [mode, setMode] = useState<'login' | 'register'>(authModalMode || 'login');

  // Keep synced if context mode changes
  React.useEffect(() => {
    if (authModalMode) setMode(authModalMode);
  }, [authModalMode]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('+228 ');
  const [regCompany, setRegCompany] = useState('');
  const [regRole, setRegRole] = useState<'client' | 'seller'>('client');
  const [acceptTerms, setAcceptTerms] = useState(true);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      addToast('Erreur', 'Veuillez renseigner votre adresse email.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        addToast('Connexion réussie', 'Bienvenue sur la plateforme APP EXCEL !', 'success');
        if (onSuccess) onSuccess();
        closeAuthModal();
      } else {
        addToast('Erreur d’authentification', res.message || 'Identifiants invalides.', 'error');
      }
    } catch (err: any) {
      addToast('Erreur', err.message || 'Une erreur est survenue.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      addToast('Champs requis', 'Veuillez remplir le nom, l’email et le mot de passe.', 'warning');
      return;
    }
    if (regPassword.length < 6) {
      addToast('Mot de passe trop court', 'Le mot de passe doit contenir au moins 6 caractères.', 'warning');
      return;
    }
    if (!acceptTerms) {
      addToast('Conditions requises', 'Veuillez accepter les Conditions d’Utilisation.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        phone: regPhone.trim(),
        companyName: regCompany.trim() || undefined,
        role: regRole
      });

      addToast(
        'Compte créé avec succès !',
        `Bienvenue ${regName}, vous pouvez maintenant finaliser votre commande.`,
        'success'
      );
      if (onSuccess) onSuccess();
      closeAuthModal();
    } catch (err: any) {
      addToast('Erreur de création', err.message || 'Une erreur est survenue.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold tracking-wide uppercase mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Portail Sécurisé APP EXCEL</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight">
            {mode === 'login' ? 'Connexion à votre espace' : 'Créer un compte client ou vendeur'}
          </h2>
          <p className="text-emerald-100/80 text-xs mt-1">
            {mode === 'login'
              ? 'Accédez à vos commandes, téléchargements sécurisés et licences.'
              : 'Commandez des solutions Excel professionnelles et recevez vos clés instantanément.'}
          </p>

          {authModalReason && (
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-400/30 flex items-start space-x-2 text-xs text-emerald-100">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>{authModalReason}</span>
            </div>
          )}
        </div>

        {/* Tabs switcher */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-3 text-center transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-3 text-center transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Body content */}
        <div className="p-6">
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="ex: moumouniabdoulmalik29@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Mot de passe
                  </label>
                  <span className="text-[11px] text-emerald-600 hover:underline cursor-pointer">
                    Mot de passe oublié ?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-md hover:shadow-emerald-600/20 flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Connexion en cours...</span>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500">
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Créer un compte gratuitement
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom complet ou Raison Sociale *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="ex: Kodjo Mensah"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adresse email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="kodjo@entreprise.tg"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Téléphone (Flooz / TMoney)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="+228 90 12 34 56"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 caractères"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Entreprise (Optionnel)
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={regCompany}
                      onChange={e => setRegCompany(e.target.value)}
                      placeholder="SARL, École, Boutique..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Type de compte :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      regRole === 'client'
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-medium'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      checked={regRole === 'client'}
                      onChange={() => setRegRole('client')}
                      className="text-emerald-600 focus:ring-emerald-500 mr-2"
                    />
                    <span>Client (Acheteur)</span>
                  </label>

                  <label
                    className={`flex items-center p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                      regRole === 'seller'
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-medium'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      checked={regRole === 'seller'}
                      onChange={() => setRegRole('seller')}
                      className="text-emerald-600 focus:ring-emerald-500 mr-2"
                    />
                    <span>Vendeur / Développeur</span>
                  </label>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="modal-terms"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="modal-terms" className="text-[11px] text-slate-600 leading-tight">
                  J'accepte les Conditions Générales de Vente et la Politique de Confidentialité de la plateforme APP EXCEL.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-md hover:shadow-emerald-600/20 flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Création du compte...</span>
                ) : (
                  <>
                    <span>Créer mon compte et continuer</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1 text-xs text-slate-500">
                Vous avez déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Se connecter
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
