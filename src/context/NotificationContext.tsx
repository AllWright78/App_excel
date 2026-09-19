import React, { createContext, useContext, useState } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  toasts: { id: string; title: string; message: string; type: string }[];
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Alerte d’expiration de licence',
      message: 'Votre licence pour "CRM Entreprise" expire dans 14 jours. Pensez à la renouveler.',
      type: 'warning',
      timestamp: 'Il y a 2 heures',
      read: false,
      actionUrl: '#/dashboard'
    },
    {
      id: 'notif-2',
      title: 'Commande confirmée et livrée',
      message: 'Votre commande CMD-2025-001 a été traitée. Clé de licence active.',
      type: 'success',
      timestamp: 'Hier à 16:40',
      read: false,
      actionUrl: '#/dashboard'
    },
    {
      id: 'notif-3',
      title: 'Mise à jour disponible v2.1.0',
      message: 'Une nouvelle version de Gestion de stock Pro est disponible au téléchargement.',
      type: 'info',
      timestamp: 'Il y a 3 jours',
      read: true,
      actionUrl: '#/dashboard'
    }
  ]);

  const [toasts, setToasts] = useState<{ id: string; title: string; message: string; type: string }[]>([]);

  const addToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addToast,
        toasts,
        removeToast
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
