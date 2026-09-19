import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { INITIAL_USERS } from '../data/initialData';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: Role | 'guest';
  loginAs: (userRole: Role | 'guest') => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    companyName?: string;
    role?: Role;
  }) => Promise<User>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  authModalReason?: string;
  openAuthModal: (mode?: 'login' | 'register', reason?: string) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('app_excel_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalReason, setAuthModalReason] = useState<string | undefined>(undefined);

  const openAuthModal = (mode: 'login' | 'register' = 'login', reason?: string) => {
    setAuthModalMode(mode);
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalReason(undefined);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('app_excel_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('app_excel_current_user');
    }
  }, [user]);

  const loginAs = async (userRole: Role | 'guest') => {
    if (userRole === 'guest') {
      setUser(null);
      return;
    }
    const allUsers = await api.getAllUsers();
    const found = allUsers.find(u => u.role === userRole);
    if (found) {
      setUser(found);
    } else {
      // Fallback
      if (userRole === 'super_admin') setUser(INITIAL_USERS[0]);
      else if (userRole === 'seller') setUser(INITIAL_USERS[1]);
      else setUser(INITIAL_USERS[2]);
    }
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const allUsers = await api.getAllUsers();

    // Check super admin credentials
    if (cleanEmail === 'moumouniabdoulmalik29@gmail.com') {
      if (password && password !== 'Abdoul123@') {
        return { success: false, message: 'Mot de passe incorrect pour le Super Administrateur.' };
      }
      const adminUser = allUsers.find(u => u.email.toLowerCase() === cleanEmail) || INITIAL_USERS[0];
      setUser({ ...adminUser, role: 'super_admin' });
      closeAuthModal();
      return { success: true };
    }

    const found = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      if (password && found.password && found.password !== password) {
        return { success: false, message: 'Mot de passe incorrect. Veuillez vérifier votre saisie.' };
      }
      setUser(found);
      closeAuthModal();
      return { success: true };
    }

    return {
      success: false,
      message: "Aucun compte trouvé avec cet email. Veuillez créer un compte client ou vendeur."
    };
  };

  const register = async (data: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    companyName?: string;
    role?: Role;
  }): Promise<User> => {
    const newUser = await api.createUser({
      name: data.name,
      email: data.email,
      password: data.password || 'MotDePasse2025!',
      phone: data.phone || '+228 90 00 00 00',
      companyName: data.companyName,
      role: data.role || 'client'
    });

    setUser(newUser);
    closeAuthModal();
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      api.updateUser(user.id, data).catch(console.error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'guest',
        loginAs,
        login,
        register,
        logout,
        updateUserProfile,
        isAuthModalOpen,
        authModalMode,
        authModalReason,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
