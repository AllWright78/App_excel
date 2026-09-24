import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  FileSpreadsheet,
  Search,
  ShoppingCart,
  Bell,
  Menu,
  X,
  User as UserIcon,
  ShieldAlert,
  Store,
  LayoutDashboard,
  KeyRound,
  LogOut,
  ChevronDown,
  Package,
  Heart
} from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string, param?: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate, onSearchSubmit }) => {
  const { user, logout, openAuthModal } = useAuth();
  const { itemCount } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      navigate('applications');
    }
  };

  // The 7 canonical navigation tabs matching image.png exactly
  const navTabs = [
    { id: 'home', label: 'Accueil', route: 'home' },
    { id: 'applications', label: 'Applications', route: 'applications' },
    { id: 'categories', label: 'Catégories', route: 'categories' },
    { id: 'subscriptions', label: 'Abonnements', route: 'subscriptions' },
    { id: 'about', label: 'À propos', route: 'about' },
    { id: 'contact', label: 'Contact', route: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Header Row: Logo, Search Bar, Quick Actions & Auth */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none group-hover:text-emerald-700 transition-colors">
                <span className="text-emerald-600">GESTE</span> APP
              </span>
            </div>
          </div>

          {/* Central Rounded Search Bar (Matching image.png) */}
          <div className="flex-1 max-w-2xl mx-2 sm:mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative flex items-center bg-slate-100/90 hover:bg-slate-100 focus-within:bg-white rounded-full border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all overflow-hidden px-3.5 py-1.5 sm:py-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher une application, une catégorie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-600 mr-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="p-1 text-slate-500 hover:text-emerald-600 transition-colors shrink-0"
                  aria-label="Lancer la recherche"
                >
                  <Search className="w-4 h-4 text-slate-500 hover:text-emerald-600" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Action Icons: Notification, Cart & Real-Time Auth */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setNotifDropdownOpen(!notifDropdownOpen); setUserDropdownOpen(false); }}
                className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-emerald-600 hover:underline font-medium"
                    >
                      Tout marquer comme lu
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        Aucune notification pour le moment.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            setNotifDropdownOpen(false);
                            if (n.actionUrl) navigate('dashboard');
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-emerald-50/40' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-xs font-bold text-slate-800">{n.title}</h5>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={() => navigate('cart')}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors relative"
              aria-label="Panier d'achat"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Real-Time User Authentication (No Demo Switcher) */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setUserDropdownOpen(!userDropdownOpen); setNotifDropdownOpen(false); }}
                  className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-all"
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/20"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-slate-800 max-w-[110px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Connecté en temps réel</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      {(user.role === 'admin' || user.role === 'super_admin') && (
                        <button
                          onClick={() => { navigate('admin'); setUserDropdownOpen(false); }}
                          className="w-full px-4 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50 flex items-center gap-2.5"
                        >
                          <ShieldAlert className="w-4 h-4 text-purple-600" />
                          <span>Espace administration</span>
                        </button>
                      )}

                      <button
                        onClick={() => { navigate('dashboard'); setUserDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>Mon espace</span>
                      </button>

                      <button
                        onClick={() => { navigate('license-verifier'); setUserDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2.5"
                      >
                        <KeyRound className="w-4 h-4 text-slate-500" />
                        <span>Vérificateur de licences VBA</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="text-xs font-semibold text-slate-700 hover:text-emerald-600 px-2.5 sm:px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Connexion
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-4 py-2 rounded-xl shadow-xs transition-colors"
                >
                  Inscription
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Clean Navigation Tabs */}
      <div className="border-t border-slate-100 bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 sm:space-x-4 py-2 overflow-x-auto">
            {navTabs.map(tab => {
              const isActive = currentRoute === tab.route;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigate(tab.route)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all shrink-0 ${
                    isActive
                      ? 'text-emerald-600 font-semibold bg-emerald-50/80 border border-emerald-200/60'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Navigation
          </div>
          {navTabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { navigate(tab.route); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                currentRoute === tab.route ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
            {user ? (
              <>
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <button
                    onClick={() => { navigate('admin'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 rounded-lg"
                  >
                    Tableau de bord Administrateur
                  </button>
                )}
                {(user.role === 'seller' || user.role === 'super_admin') && (
                  <button
                    onClick={() => { navigate('seller-dashboard'); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg"
                  >
                    Espace Vendeur
                  </button>
                )}
                <button
                  onClick={() => { navigate('dashboard'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg"
                >
                  Mon espace
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50 rounded-lg"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Connexion
                </button>
                <button
                  onClick={() => { openAuthModal('register'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-white bg-emerald-600 rounded-xl"
                >
                  Inscription
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
