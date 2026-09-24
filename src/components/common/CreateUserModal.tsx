import React, { useState } from 'react';
import { User } from '../../types';
import { api } from '../../services/api';
import { createManagedUserWithFirebase, isFirebaseConfigured } from '../../services/firebase';
import { useNotifications } from '../../context/NotificationContext';
import {
  X,
  UserPlus,
  Shield,
  Store,
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  Building,
  Key,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: (user: User) => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated
}) => {
  const { addToast } = useNotifications();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Pass123@AppExcel');
  const [role, setRole] = useState<'admin' | 'vendeur' | 'client'>('vendeur');
  const [phone, setPhone] = useState('+228 ');
  const [company, setCompany] = useState('');
  const [commissionRate, setCommissionRate] = useState(85);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      addToast('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedRole = role === 'vendeur' ? 'seller' : role;
      const newUser = isFirebaseConfigured
        ? await createManagedUserWithFirebase({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password.trim(),
            role: normalizedRole,
            phone: phone.trim() || undefined,
            companyName: company.trim() || undefined
          })
        : await api.createUser({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password.trim(),
            role,
            phone: phone.trim() || undefined,
            company: company.trim() || undefined,
            commissionRate: role === 'vendeur' ? commissionRate : undefined
          });

      addToast(
        'Compte créé avec succès !',
        isFirebaseConfigured
          ? `Le compte ${newUser.name} a été créé. Un email de vérification lui a été envoyé.`
          : `L'utilisateur ${newUser.name} a été enregistré avec le rôle ${role.toUpperCase()}.`,
        'success'
      );

      onUserCreated(newUser);
      onClose();

      // Reset form
      setName('');
      setEmail('');
      setPassword('Pass123@AppExcel');
      setRole('vendeur');
      setPhone('+228 ');
      setCompany('');
    } catch (err: any) {
      addToast('Erreur lors de la création', err.message || 'Échec de la création', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/80 flex items-center justify-center text-white shadow-md">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold">
                Créer un compte (Admin ou Vendeur)
              </h2>
              <p className="text-xs text-purple-200">
                Super Admin : Attribution de privilèges et accès
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Role Choice */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              Type de compte à créer <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('vendeur')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                  role === 'vendeur'
                    ? 'border-purple-600 bg-purple-50/80 text-purple-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Store className="w-5 h-5 mb-1 text-purple-600" />
                <span className="text-xs font-bold">Vendeur</span>
                <span className="text-[10px] text-slate-400">Publie des apps</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                  role === 'admin'
                    ? 'border-purple-600 bg-purple-50/80 text-purple-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Shield className="w-5 h-5 mb-1 text-purple-600" />
                <span className="text-xs font-bold">Admin</span>
                <span className="text-[10px] text-slate-400">Modération</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                  role === 'client'
                    ? 'border-purple-600 bg-purple-50/80 text-purple-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <UserIcon className="w-5 h-5 mb-1 text-slate-600" />
                <span className="text-xs font-bold">Client</span>
                <span className="text-[10px] text-slate-400">Acheteur</span>
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Nom complet ou Raison sociale <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Ex: Kodjo Mensah / Solution Excel Togo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Adresse e-mail <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="vendeur@appexcel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Mot de passe temporaire <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setPassword('Excel' + Math.floor(1000 + Math.random() * 9000) + '@')}
                className="text-[10px] text-purple-600 font-bold hover:underline"
              >
                Générer un mot de passe
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-hidden font-bold"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              L'utilisateur pourra modifier son mot de passe lors de sa première connexion.
            </p>
          </div>

          {/* Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Téléphone (Flooz / TMoney)
              </label>
              <input
                type="text"
                placeholder="+228 90 12 34 56"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-hidden"
              />
            </div>

            {role === 'vendeur' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Commission Vendeur (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-hidden font-bold"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Entreprise / Département
                </label>
                <input
                  type="text"
                  placeholder="Ex: Direction Financière"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:border-purple-500 focus:outline-hidden"
                />
              </div>
            )}
          </div>

          {/* Info note */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-900 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <span>
              Ce compte aura un accès immédiat avec les droits accordés.
              Le Super Admin <strong>moumouniabdoulmalik29@gmail.com</strong> garde le contrôle absolu sur tous les comptes.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Création en cours...' : `Créer le compte ${role.toUpperCase()}`}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
