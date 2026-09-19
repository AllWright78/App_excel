import { Category, Product, User, Order, License, Coupon, PlatformSettings, Ticket, MessageItem, Transaction } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-excel', name: 'Excel', slug: 'excel', iconName: 'FileSpreadsheet', description: 'Tableaux de bord et classeurs automatisés', productCount: 38 },
  { id: 'cat-gestion', name: 'Gestion', slug: 'gestion', iconName: 'Briefcase', description: 'Outils et progiciels de gestion intégrée', productCount: 29 },
  { id: 'cat-compta', name: 'Comptabilité', slug: 'comptabilite', iconName: 'Calculator', description: 'Bilan, compte de résultat et états financiers SYSCOHADA', productCount: 22 },
  { id: 'cat-education', name: 'Éducation', slug: 'education', iconName: 'GraduationCap', description: 'Bulletins scolaires, scolarité et gestion d’établissements', productCount: 14 },
  { id: 'cat-commerce', name: 'Commerce', slug: 'commerce', iconName: 'ShoppingBag', description: 'Point de vente, facturation et tickets de caisse', productCount: 19 },
  { id: 'cat-agri', name: 'Agriculture', slug: 'agriculture', iconName: 'Sprout', description: 'Suivi de récoltes, intrants, cheptel et rendements', productCount: 11 },
  { id: 'cat-stock', name: 'Stock', slug: 'stock', iconName: 'Boxes', description: 'Inventaires, alertes de rupture, FIFO/LIFO et flux', productCount: 25 },
  { id: 'cat-crm', name: 'CRM', slug: 'crm', iconName: 'Users', description: 'Gestion de la relation client, prospection et devis', productCount: 16 },
  { id: 'cat-finance', name: 'Finance', slug: 'finance', iconName: 'TrendingUp', description: 'Trésorerie, prévisionnels et plans de financement', productCount: 18 },
  { id: 'cat-rh', name: 'Ressources humaines', slug: 'rh', iconName: 'UserCheck', description: 'Bulletins de paie, congés et contrats', productCount: 13 },
  { id: 'cat-autres', name: 'Autres', slug: 'autres', iconName: 'Layers', description: 'Modèles juridiques et utilitaires professionnels', productCount: 8 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-stock-pro',
    slug: 'gestion-de-stock-pro',
    name: 'Gestion de stock Pro',
    shortDescription: 'Application Excel professionnelle pour la gestion complète des stocks, alertes et inventaires.',
    description: 'Application Excel professionnelle pour la gestion complète de votre stock. Suivez vos produits, gérez vos entrées et sorties en direct, générez des rapports automatiques et optimisez votre inventaire en quelques clics.',
    categoryId: 'cat-stock',
    categoryName: 'Gestion',
    vendorId: 'vendor-techsol',
    vendorName: 'Tech Solutions',
    vendorVerified: true,
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'Suivi des stocks et alertes de rupture en temps réel',
      'Génération automatique des bons d’entrée et de sortie',
      'Valorisation comptable du stock (PUMP, FIFO, LIFO)',
      'Gestion multi-magasins et fournisseurs',
      'Tableau de bord dynamique avec graphiques interactifs',
      'Export PDF et Excel en un clic'
    ],
    requirements: [
      'Microsoft Excel 2016, 2019, 2021 ou Microsoft 365',
      'Compatible Windows et macOS',
      'Activation des macros VBA recommandée'
    ],
    compatibility: 'Windows, Mac, Office 365',
    version: '2.1.0',
    fileSize: '5.2 MB',
    fileFormat: '.xlsm (Excel avec macros)',
    updatedAt: '12/03/2025',
    salesCount: 1240,
    rating: 4.8,
    reviewsCount: 124,
    status: 'approved',
    licenseOptions: {
      monthly: 20000,
      annual: 50000,
      lifetime: 100000,
    },
    defaultLicense: 'annual',
    basePrice: 50000,
    isFeatured: true,
    demoVideoUrl: 'https://www.youtube.com/embed/S_8qM8C-Q7s',
    demoVideoTitle: 'Démonstration vidéo complète : Gestion de stock Pro sur Excel',
    sourceFileName: 'Gestion_Stock_Pro_v2.1.xlsm',
    faqs: [
      { question: 'Ai-je besoin de compétences avancées sur Excel ?', answer: 'Non, l’outil dispose d’un menu intuitif conçu pour des personnes sans compétences informatiques particulières.' },
      { question: 'Comment activer ma licence après l’achat ?', answer: 'Vous recevez immédiatement votre clé de licence par email et dans votre espace client. Entrez-la à l’ouverture du classeur.' },
      { question: 'Puis-je installer l’application sur plusieurs ordinateurs ?', answer: 'La licence annuelle standard vous permet d’activer jusqu’à 3 postes de travail simultanément.' }
    ],
    documentation: 'Guide utilisateur complet de 24 pages au format PDF inclus avec captures d’écran et vidéos tutorielles pas à pas.'
  },
  {
    id: 'prod-compta-facile',
    slug: 'comptabilite-facile',
    name: 'Comptabilité Facile',
    shortDescription: 'Solution automatisée de comptabilité générale conforme SYSCOHADA révisé.',
    description: 'Enregistrez facilement vos écritures comptables, générez votre grand livre, votre balance générale et éditez votre bilan et compte de résultat sans être expert-comptable.',
    categoryId: 'cat-compta',
    categoryName: 'Comptabilité',
    vendorId: 'vendor-techsol',
    vendorName: 'Finance Plus Togo',
    vendorVerified: true,
    logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'Plan comptable SYSCOHADA révisé pré-intégré',
      'Saisie rapide des écritures (Banque, Caisse, Achats, Ventes)',
      'Grand livre et balance générale automatiques',
      'Génération du bilan et compte de résultat normalisé',
      'Rapprochement bancaire simplifié'
    ],
    requirements: ['Excel 2016 ou supérieur', 'Windows 10/11 ou Mac'],
    compatibility: 'Windows, Mac, Office 365',
    version: '3.0.4',
    fileSize: '6.8 MB',
    fileFormat: '.xlsm',
    updatedAt: '28/02/2025',
    salesCount: 980,
    rating: 4.7,
    reviewsCount: 98,
    status: 'approved',
    licenseOptions: {
      monthly: 15000,
      annual: 40000,
      lifetime: 80000,
    },
    defaultLicense: 'annual',
    basePrice: 40000,
    isFeatured: true,
    demoVideoUrl: 'https://www.youtube.com/embed/Vl0h1yMv0c4',
    demoVideoTitle: 'Tutoriel vidéo : Tenue comptable SYSCOHADA et Bilan en 1 clic',
    sourceFileName: 'Compta_Facile_SYSCOHADA_v3.0.xlsm',
    faqs: [
      { question: 'Est-ce adapté aux PME d’Afrique de l’Ouest ?', answer: 'Absolument, le plan de comptes et les états financiers respectent la nomenclature SYSCOHADA de l’OHADA.' }
    ]
  },
  {
    id: 'prod-crm-entreprise',
    slug: 'crm-entreprise',
    name: 'CRM Entreprise',
    shortDescription: 'Gestion commerciale complète, suivi des prospects, devis et opportunités.',
    description: 'Centralisez l’ensemble de vos contacts prospects, suivez vos pipelines de vente, convertissez des devis en factures et mesurez les performances de vos commerciaux en temps réel.',
    categoryId: 'cat-crm',
    categoryName: 'CRM',
    vendorId: 'vendor-techsol',
    vendorName: 'Tech Solutions',
    vendorVerified: true,
    logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'Pipeline de vente visuel type Kanban intégré à Excel',
      'Fiches clients détaillées avec historique d’interactions',
      'Édition instantanée de devis et factures proforma',
      'Calcul automatique des commissions commerciales',
      'Suivi des relances clients et échéances'
    ],
    requirements: ['Excel 2019+ ou Microsoft 365'],
    compatibility: 'Windows, Mac, Office 365',
    version: '1.9.2',
    fileSize: '4.5 MB',
    fileFormat: '.xlsm',
    updatedAt: '10/01/2025',
    salesCount: 2450,
    rating: 4.9,
    reviewsCount: 156,
    status: 'approved',
    licenseOptions: {
      monthly: 30000,
      annual: 75000,
      lifetime: 150000,
    },
    defaultLicense: 'annual',
    basePrice: 75000,
    isFeatured: true,
    demoVideoUrl: 'https://www.youtube.com/embed/S_8qM8C-Q7s',
    demoVideoTitle: 'Démo Kanban & Pipeline Commercial Excel',
    sourceFileName: 'CRM_Entreprise_Commercial_v1.9.xlsm',
    faqs: [
      { question: 'Puis-je importer mes contacts existants ?', answer: 'Oui, une fonction d’import CSV/Excel rapide est incluse.' }
    ]
  },
  {
    id: 'prod-scolaire',
    slug: 'gestion-scolaire',
    name: 'Gestion scolaire & Bulletins',
    shortDescription: 'Application de gestion pour collèges, lycées et écoles primaires.',
    description: 'Gérez les inscriptions des élèves, les frais de scolarité, les notes par trimestre ou semestre, et imprimez automatiquement des bulletins scolaires personnalisés avec logos et moyennes.',
    categoryId: 'cat-education',
    categoryName: 'Éducation',
    vendorId: 'vendor-eduapps',
    vendorName: 'EduTech Afrique',
    vendorVerified: true,
    logo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'Calcul automatique des moyennes et classements',
      'Impression des bulletins de notes aux normes ministérielles',
      'Suivi des paiements de scolarité et rappels de moratoire',
      'Gestion des fiches de présence et retards des élèves'
    ],
    requirements: ['Excel 2016 ou plus récent'],
    compatibility: 'Windows, Mac',
    version: '2.4.0',
    fileSize: '7.1 MB',
    fileFormat: '.xlsm',
    updatedAt: '15/01/2025',
    salesCount: 760,
    rating: 4.6,
    reviewsCount: 87,
    status: 'approved',
    licenseOptions: {
      monthly: 12000,
      annual: 35000,
      lifetime: 70000,
    },
    defaultLicense: 'annual',
    basePrice: 35000,
    isFeatured: true,
    demoVideoUrl: 'https://www.youtube.com/embed/Vl0h1yMv0c4',
    demoVideoTitle: 'Démo Gestion Scolaire : Saisie des notes et génération des bulletins',
    sourceFileName: 'Gestion_Scolaire_Bulletins_v2.4.xlsm',
    faqs: []
  },
  {
    id: 'prod-dashboard-excel',
    slug: 'tableau-de-bord-excel',
    name: 'Tableau de bord Excel Direction',
    shortDescription: 'Cockpit de pilotage financier et opérationnel pour directeurs et chefs d’entreprise.',
    description: 'Visualisez en un clin d’œil l’ensemble des indicateurs clés de votre entreprise (chiffre d’affaires, marge brute, créances clients, trésorerie nette) grâce à un design épuré.',
    categoryId: 'cat-excel',
    categoryName: 'Excel',
    vendorId: 'vendor-techsol',
    vendorName: 'Tech Solutions',
    vendorVerified: true,
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'Graphiques dynamiques avec segments et chronologies',
      'Ratios de rentabilité et alertes de trésorerie',
      'Prise en main immédiate, aucun code requis',
      'Modèle prêt à brancher sur vos données'
    ],
    requirements: ['Excel 2016, 2019, 2021, 365'],
    compatibility: 'Windows, Mac, Office 365',
    version: '1.5.0',
    fileSize: '3.8 MB',
    fileFormat: '.xlsx',
    updatedAt: '05/02/2025',
    salesCount: 760,
    rating: 4.6,
    reviewsCount: 87,
    status: 'approved',
    licenseOptions: {
      lifetime: 30000,
    },
    defaultLicense: 'lifetime',
    basePrice: 30000,
    isFeatured: true,
    demoVideoUrl: 'https://www.youtube.com/embed/S_8qM8C-Q7s',
    demoVideoTitle: 'Présentation dynamique du Cockpit Financier Excel',
    sourceFileName: 'Tableau_de_Bord_Direction_Excel.xlsx',
    faqs: []
  },
  {
    id: 'prod-agri-pro',
    slug: 'gestion-agricole-pro',
    name: 'Gestion agricole Pro',
    shortDescription: 'Application pour producteurs agricoles, fermes avicoles et coopératives.',
    description: 'Suivez vos parcelles cultivées, vos intrants (engrais, semences), la main d’œuvre, le coût de revient par hectare et calculez votre marge nette par récolte.',
    categoryId: 'cat-agri',
    categoryName: 'Agriculture',
    vendorId: 'vendor-agritech',
    vendorName: 'AgriTech Sahel',
    vendorVerified: true,
    logo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'Suivi parcellaire et calendrier de semis/récolte',
      'Gestion des élevages (volailles, bovins, ovins, porcs)',
      'Calcul du coût de revient à l’unité produite',
      'Gestion des approvisionnements et pesticides'
    ],
    requirements: ['Excel 2016 ou plus récent'],
    compatibility: 'Windows, Mac, Office 365',
    version: '2.0.1',
    fileSize: '4.9 MB',
    fileFormat: '.xlsm',
    updatedAt: '18/02/2025',
    salesCount: 1140,
    rating: 4.8,
    reviewsCount: 112,
    status: 'approved',
    licenseOptions: {
      monthly: 18000,
      annual: 45000,
      lifetime: 90000,
    },
    defaultLicense: 'annual',
    basePrice: 45000,
    isFeatured: true,
    faqs: []
  },
  {
    id: 'prod-commerciale',
    slug: 'gestion-commerciale',
    name: 'Gestion commerciale & Caisse',
    shortDescription: 'Point de vente, facturation avec reçu de caisse et inventaire en magasin.',
    description: 'Solution idéale pour boutiques, superettes et quincailleries. Enregistrez les ventes au comptoir, imprimez des tickets de caisse thermique 80mm ou factures A4, et gérez la caisse du jour.',
    categoryId: 'cat-commerce',
    categoryName: 'Commerce',
    vendorId: 'vendor-techsol',
    vendorName: 'Tech Solutions',
    vendorVerified: true,
    logo: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'Interface de caisse ultra rapide compatible lecteur code-barres',
      'Impression des tickets de caisse format ticket ou A4',
      'Clôture de caisse quotidienne (X et Z de caisse)',
      'Gestion des règlements espèces, TMoney, Flooz et cartes'
    ],
    requirements: ['Excel 2016 ou supérieur sur Windows'],
    compatibility: 'Windows 10/11',
    version: '3.1.2',
    fileSize: '5.8 MB',
    fileFormat: '.xlsm',
    updatedAt: '25/01/2025',
    salesCount: 890,
    rating: 4.7,
    reviewsCount: 94,
    status: 'approved',
    licenseOptions: {
      annual: 60000,
      lifetime: 120000,
    },
    defaultLicense: 'annual',
    basePrice: 60000,
    isFeatured: true,
    faqs: []
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Moumouni Abdoul Malik',
    email: 'moumouniabdoulmalik29@gmail.com',
    role: 'super_admin',
    password: 'Abdoul123@',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+228 90 12 34 56',
    country: 'Togo',
    address: 'Boulevard du 13 Janvier, Lomé, Togo',
    createdAt: '2025-01-01'
  },
  {
    id: 'user-seller',
    name: 'Tech Solutions SARL',
    email: 'vendeur@techsolutions.tg',
    role: 'seller',
    password: 'Password123!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+228 91 88 77 66',
    country: 'Togo',
    address: 'Quartier Tokoin, Lomé, Togo',
    companyName: 'Tech Solutions SARL',
    sellerStatus: 'approved',
    createdAt: '2025-01-10'
  },
  {
    id: 'user-client',
    name: 'Jean Dupont',
    email: 'client@exemple.com',
    role: 'client',
    password: 'Password123!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    phone: '+228 92 33 44 55',
    country: 'Togo',
    address: 'Adidogomé, Lomé, Togo',
    createdAt: '2025-02-01'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'CMD-2025-001',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    userPhone: '+228 92 33 44 55',
    items: [
      {
        id: 'item-1',
        productId: 'prod-stock-pro',
        productName: 'Gestion de stock Pro',
        productLogo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
        licenseType: 'annual',
        price: 50000,
        quantity: 1,
        licenseKey: 'EXCEL-STK-7789-2025-X9A'
      }
    ],
    totalAmount: 50000,
    subtotal: 50000,
    discountAmount: 0,
    paymentMethod: 'flooz',
    paymentStatus: 'success',
    orderStatus: 'delivered',
    transactionId: 'FLZ-TG-9827361',
    createdAt: '15/05/2025',
    deliveryNotes: 'Licence activée et transmise par email automatique.'
  },
  {
    id: 'ord-1002',
    orderNumber: 'CMD-2025-002',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    userPhone: '+228 92 33 44 55',
    items: [
      {
        id: 'item-2',
        productId: 'prod-compta-facile',
        productName: 'Comptabilité Facile',
        productLogo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
        licenseType: 'annual',
        price: 40000,
        quantity: 1,
        licenseKey: 'EXCEL-CPT-4432-2025-M2B'
      }
    ],
    totalAmount: 40000,
    subtotal: 40000,
    discountAmount: 0,
    paymentMethod: 'tmoney',
    paymentStatus: 'success',
    orderStatus: 'delivered',
    transactionId: 'TMY-TG-4128945',
    createdAt: '10/05/2025'
  },
  {
    id: 'ord-1003',
    orderNumber: 'CMD-2025-003',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    userPhone: '+228 92 33 44 55',
    items: [
      {
        id: 'item-3',
        productId: 'prod-crm-entreprise',
        productName: 'CRM Entreprise',
        productLogo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
        licenseType: 'annual',
        price: 75000,
        quantity: 1,
        licenseKey: 'EXCEL-CRM-9912-2025-Z7K'
      }
    ],
    totalAmount: 75000,
    subtotal: 75000,
    discountAmount: 0,
    paymentMethod: 'card',
    paymentStatus: 'success',
    orderStatus: 'delivered',
    transactionId: 'CRD-VISA-882190',
    createdAt: '02/05/2025'
  },
  {
    id: 'ord-1004',
    orderNumber: 'CMD-2025-004',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    userPhone: '+228 92 33 44 55',
    items: [
      {
        id: 'item-4',
        productId: 'prod-agri-pro',
        productName: 'Gestion agricole Pro',
        productLogo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
        licenseType: 'annual',
        price: 45000,
        quantity: 1,
        licenseKey: 'EXCEL-AGR-3321-2025-V1Y'
      }
    ],
    totalAmount: 45000,
    subtotal: 45000,
    discountAmount: 0,
    paymentMethod: 'flooz',
    paymentStatus: 'success',
    orderStatus: 'delivered',
    transactionId: 'FLZ-TG-2219033',
    createdAt: '28/04/2025'
  }
];

export const INITIAL_LICENSES: License[] = [
  {
    id: 'lic-1',
    licenseKey: 'EXCEL-STK-7789-2025-X9A',
    productId: 'prod-stock-pro',
    productName: 'Gestion de stock Pro',
    productSlug: 'gestion-de-stock-pro',
    productLogo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    orderId: 'ord-1001',
    orderNumber: 'CMD-2025-001',
    type: 'annual',
    status: 'active',
    startDate: '2025-05-15',
    expiresAt: '2026-05-15',
    activationsCount: 1,
    maxActivations: 3,
    version: '2.1.0'
  },
  {
    id: 'lic-2',
    licenseKey: 'EXCEL-CPT-4432-2025-M2B',
    productId: 'prod-compta-facile',
    productName: 'Comptabilité Facile',
    productSlug: 'comptabilite-facile',
    productLogo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    orderId: 'ord-1002',
    orderNumber: 'CMD-2025-002',
    type: 'annual',
    status: 'active',
    startDate: '2025-05-10',
    expiresAt: '2026-05-10',
    activationsCount: 1,
    maxActivations: 2,
    version: '3.0.4'
  },
  {
    id: 'lic-3',
    licenseKey: 'EXCEL-CRM-9912-2025-Z7K',
    productId: 'prod-crm-entreprise',
    productName: 'CRM Entreprise',
    productSlug: 'crm-entreprise',
    productLogo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    orderId: 'ord-1003',
    orderNumber: 'CMD-2025-003',
    type: 'monthly',
    status: 'active',
    startDate: '2025-05-02',
    expiresAt: '2025-06-02', // soon expiring example!
    activationsCount: 2,
    maxActivations: 3,
    version: '1.9.2'
  },
  {
    id: 'lic-4',
    licenseKey: 'EXCEL-AGR-3321-2025-V1Y',
    productId: 'prod-agri-pro',
    productName: 'Gestion agricole Pro',
    productSlug: 'gestion-agricole-pro',
    productLogo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    orderId: 'ord-1004',
    orderNumber: 'CMD-2025-004',
    type: 'annual',
    status: 'active',
    startDate: '2025-04-28',
    expiresAt: '2025-05-28', // soon expiring example!
    activationsCount: 1,
    maxActivations: 2,
    version: '2.0.1'
  },
  {
    id: 'lic-5',
    licenseKey: 'EXCEL-DSH-1100-2025-L9Q',
    productId: 'prod-dashboard-excel',
    productName: 'Tableau de bord Excel Direction',
    productSlug: 'tableau-de-bord-excel',
    productLogo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    orderId: 'ord-1000',
    orderNumber: 'CMD-2025-000',
    type: 'lifetime',
    status: 'active',
    startDate: '2025-01-15',
    expiresAt: null,
    activationsCount: 1,
    maxActivations: 5,
    version: '1.5.0'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { id: 'c-1', code: 'EXCEL10', type: 'percentage', value: 10, expiresAt: '2026-12-31', usageCount: 42, isActive: true },
  { id: 'c-2', code: 'BIENVENUE5000', type: 'fixed', value: 5000, minSpend: 30000, expiresAt: '2026-12-31', usageCount: 88, isActive: true },
  { id: 'c-3', code: 'PRO20', type: 'percentage', value: 20, minSpend: 50000, expiresAt: '2026-12-31', usageCount: 15, isActive: true }
];

export const INITIAL_SETTINGS: PlatformSettings = {
  siteName: 'APP EXCEL',
  contactEmail: 'contact@appexcel.tg',
  contactPhone: '+228 90 00 11 22',
  currency: 'XOF',
  currencySymbol: 'FCFA',
  globalCommissionRate: 15, // 15% platform commission
  autoApproveProducts: false,
  smtpHost: 'smtp.mailgun.org',
  smtpPort: 587,
  smtpUser: 'notifications@appexcel.tg',
  floozEnabled: true,
  tmoneyEnabled: true,
  cardEnabled: true,
  cashEnabled: false
};

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 't-1',
    ticketNumber: 'TCK-8821',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    subject: 'Activation de la licence sur mon second PC',
    category: 'Licences & Clés',
    description: 'Bonjour, j’ai changé d’ordinateur portable et je souhaite transférer ma licence Gestion de stock Pro.',
    status: 'open',
    createdAt: '2025-05-18 09:30',
    updatedAt: '2025-05-18 10:15',
    replies: [
      {
        id: 'r-1',
        senderName: 'Support APP EXCEL',
        senderRole: 'support',
        message: 'Bonjour M. Dupont. Votre clé de licence permet jusqu’à 3 postes. Vous pouvez simplement l’entrer sur le nouveau PC. Si besoin, nous pouvons réinitialiser le compteur d’activations.',
        createdAt: '2025-05-18 10:15'
      }
    ]
  }
];

export const INITIAL_MESSAGES: MessageItem[] = [
  {
    id: 'm-1',
    senderId: 'user-client',
    senderName: 'Jean Dupont',
    receiverId: 'user-seller',
    receiverName: 'Tech Solutions',
    content: 'Bonjour, est-il possible d’ajouter une catégorie personnalisée d’articles dans Gestion de stock Pro ?',
    timestamp: '17/05/2025 14:20',
    read: true,
    productId: 'prod-stock-pro',
    productName: 'Gestion de stock Pro'
  },
  {
    id: 'm-2',
    senderId: 'user-seller',
    senderName: 'Tech Solutions',
    receiverId: 'user-client',
    receiverName: 'Jean Dupont',
    content: 'Bonjour Jean ! Oui tout à fait, rendez-vous dans l’onglet "Paramètres > Familles d’articles" du classeur pour en ajouter autant que souhaité.',
    timestamp: '17/05/2025 14:35',
    read: true,
    productId: 'prod-stock-pro',
    productName: 'Gestion de stock Pro'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-flz-seed-1',
    transactionReference: 'FLZ-TG-20250515-8492',
    orderId: 'ord-1',
    orderNumber: 'CMD-2025-8492',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    amount: 50000,
    currency: 'FCFA',
    provider: 'flooz',
    status: 'success',
    paymentDetails: { phoneNumber: '+228 98 12 34 56', operator: 'Moov Africa' },
    gatewayResponse: { statusCode: '00', statusDescription: 'TRANSACTION_SUCCESS', operatorRef: 'MOOV-20250515' },
    createdAt: '2025-05-15 14:22',
    updatedAt: '2025-05-15 14:23'
  },
  {
    id: 'tx-tmn-seed-2',
    transactionReference: 'TMN-TG-20250510-7219',
    orderId: 'ord-2',
    orderNumber: 'CMD-2025-7219',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    amount: 40000,
    currency: 'FCFA',
    provider: 'tmoney',
    status: 'success',
    paymentDetails: { phoneNumber: '+228 90 23 45 67', operator: 'Togocom' },
    gatewayResponse: { responseCode: '200', responseMessage: 'APPROVED', togocomReference: 'TGC-20250510' },
    createdAt: '2025-05-10 11:05',
    updatedAt: '2025-05-10 11:06'
  },
  {
    id: 'tx-str-seed-3',
    transactionReference: 'STR-PI-3M876A2901',
    orderId: 'ord-3',
    orderNumber: 'CMD-2025-3912',
    userId: 'user-client',
    userName: 'Jean Dupont',
    userEmail: 'client@exemple.com',
    amount: 75000,
    currency: 'FCFA',
    provider: 'stripe',
    status: 'success',
    paymentDetails: { cardBrand: 'visa', cardLast4: '4242', cardHolder: 'Jean Dupont' },
    gatewayResponse: { id: 'pi_3M876A2901', status: 'succeeded', brand: 'visa' },
    createdAt: '2025-05-02 09:12',
    updatedAt: '2025-05-02 09:13'
  }
];
