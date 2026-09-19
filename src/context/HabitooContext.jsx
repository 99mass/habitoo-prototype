import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CITIES } from '../data/propertiesData';

const HabitooContext = createContext();

const INITIAL_TRANSACTIONS = [
  {
    id: "tx-001",
    type: "DEPOSIT",
    title: "Recharge Mobile Money (Orange Money)",
    amount: 150000,
    currency: "FCFA",
    date: "20 Février 2025 à 14:32",
    status: "Complété",
    ref: "OM-CI-849201"
  },
  {
    id: "tx-002",
    type: "ESCROW_VISIT",
    title: "Frais de visite sécurisés — Villa Signature 'Le Belvédère'",
    amount: -10000,
    currency: "FCFA",
    date: "22 Février 2025 à 09:15",
    status: "Sous séquestre",
    ref: "VIS-HAB-9921"
  },
  {
    id: "tx-003",
    type: "REFUND",
    title: "Remboursement visite annulée agent — Plateau Laguna Sky",
    amount: 10000,
    currency: "FCFA",
    date: "15 Février 2025 à 16:45",
    status: "Remboursé",
    ref: "REF-HAB-3112"
  }
];

const INITIAL_VISITS = [
  {
    id: "vis-03",
    propertyId: "hab-ci-01",
    propertyTitle: "Villa Signature 'Le Belvédère' — Riviera Golf",
    propertyAddress: "Boulevard de France prolongé, Cocody, Abidjan",
    date: "Hier à 15:00",
    time: "15:00 - 15:45",
    status: "Effectuée",
    fee: 10000,
    escrowStatus: "Visite honorée",
    agentName: "Jean-Marc Kouassi",
    agentAgency: "Démarcheur Agréé Habitoo",
    paymentMethod: "Portefeuille Habitoo",
    rating: null
  },
  {
    id: "vis-01",
    propertyId: "hab-ci-01",
    propertyTitle: "Villa Signature 'Le Belvédère' — Riviera Golf",
    propertyAddress: "Boulevard de France prolongé, Cocody, Abidjan",
    date: "26 Février 2025",
    time: "15:00 - 16:00",
    status: "Confirmé",
    fee: 10000,
    escrowStatus: "Séquestre actif",
    agentName: "Jean-Marc Kouassi",
    agentAgency: "Démarcheur Agréé Habitoo",
    paymentMethod: "Portefeuille Habitoo"
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-01",
    type: "VISIT",
    title: "Visite programmée confirmée",
    message: "Votre créneau pour la Villa Signature 'Le Belvédère' a été validé avec l'agent.",
    date: "Il y a 2 heures",
    read: false,
    link: "/mon-compte?tab=visits"
  },
  {
    id: "notif-03",
    type: "SECURITY",
    title: "Connexion sécurisée détectée",
    message: "Nouvelle session ouverte avec succès.",
    date: "20 Février 2025",
    read: true,
    link: "/mon-compte?tab=settings"
  }
];

const INITIAL_PRO_PROFILES = [
  {
    id: "demarcheur-kouassi",
    type: "DEMARCHEUR",
    name: "Jean-Marc Kouassi",
    title: "Démarcheur Immobilier Agréé",
    badge: "Démarcheur Agréé PRO",
    license: "AGR-CI-2024-0892",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    neighborhoods: ["Cocody", "Riviera Golf", "Plateau", "Deux-Plateaux"],
    bio: "Professionnel accrédité sur le marché immobilier d'Abidjan depuis plus de 8 ans. Spécialisé dans les villas d'exception et appartements résidentiels de haut standing. Audit rigoureux des titres fonciers et accompagnement complet des acquéreurs et locataires.",
    stats: {
      propertyCount: 2,
      verifiedVisitsRate: "100%",
      memberSince: "Janvier 2024",
      avgResponseTime: "< 2h"
    },
    propertyIds: ["hab-ci-01", "hab-ci-05"],
    reviews: [
      {
        id: "rev-01",
        author: "Dr. Patrick Ahoua",
        date: "14 Février 2025",
        score: 5,
        criteria: { punctuality: 5, professionalism: 5, compliance: 5 },
        comment: "Visite de la villa à la Riviera Golf parfaitement organisée. Dossier technique complet remis dès le début. Ponctuel et très précis sur les charges de copropriété.",
        verifiedVisit: true,
        propertyTitle: "Villa Signature 'Le Belvédère' — Riviera Golf"
      },
      {
        id: "rev-02",
        author: "Mme Clarisse Bédié",
        date: "28 Janvier 2025",
        score: 5,
        criteria: { punctuality: 5, professionalism: 5, compliance: 4 },
        comment: "Démarcheur extrêmement courtois et transparent. Pas de mauvaises surprises entre les photos de l'annonce et l'état réel du bien.",
        verifiedVisit: true,
        propertyTitle: "Manoir Contemporain 'Le Vallon' — 2 Plateaux"
      },
      {
        id: "rev-03",
        author: "Marc-Aurèle K.",
        date: "10 Janvier 2025",
        score: 5,
        criteria: { punctuality: 5, professionalism: 5, compliance: 5 },
        comment: "Procédure de séquestre Habitoo respectée à la lettre. Très bonne connaissance du quartier Riviera 3.",
        verifiedVisit: true,
        propertyTitle: "Villa Signature 'Le Belvédère'"
      }
    ]
  },
  {
    id: "agence-ivoire",
    type: "AGENCE",
    name: "Ivoire Prestige Properties",
    title: "Agence Immobilière Agréée & Conseil Patrimonial",
    badge: "Agence Certifiée PRO",
    license: "RCCM-CI-ABJ-2021-B-14902",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    neighborhoods: ["Cocody", "Marcory Zone 4", "Riviera", "Plateau"],
    bio: "Cabinet d'administration de biens et de transactions d'exception implanté à Abidjan. Nos conseillers certifiés auditent chaque mandat selon les protocoles stricts d'Habitoo (vérification du titre foncier, audit technique du bâtiment et compte séquestre sécurisé).",
    stats: {
      propertyCount: 1,
      verifiedVisitsRate: "100%",
      memberSince: "Novembre 2023",
      avgResponseTime: "< 1h"
    },
    teamMembers: [
      {
        name: "Jean-Marc Kouassi",
        role: "Directeur des transactions résidentielles",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
      },
      {
        name: "Sarah Bamba",
        role: "Responsable Gestion Locative & Audit",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
      }
    ],
    propertyIds: ["hab-ci-02"],
    reviews: [
      {
        id: "rev-ag-01",
        author: "Stéphane Konan",
        date: "02 Février 2025",
        score: 5,
        criteria: { punctuality: 5, professionalism: 5, compliance: 5 },
        comment: "Excellente prise en charge pour la location de notre résidence d'expatriation. Réactivité exemplaire de l'équipe et suivi sans faille.",
        verifiedVisit: true,
        propertyTitle: "Penthouse Panoramique 'Laguna Sky' — Plateau"
      },
      {
        id: "rev-ag-02",
        author: "Nathalie Diop",
        date: "19 Janvier 2025",
        score: 4,
        criteria: { punctuality: 4, professionalism: 5, compliance: 5 },
        comment: "Agence professionnelle et sérieuse. Documents juridiques clairs et conformes aux exigences du bail notarié.",
        verifiedVisit: true,
        propertyTitle: "Penthouse Panoramique 'Laguna Sky' — Plateau"
      }
    ]
  },
  {
    id: "demarcheur-nouveau",
    type: "DEMARCHEUR",
    name: "Aminata Traoré",
    title: "Démarcheur Indépendant Accrédité",
    badge: "Démarcheur Agréé PRO",
    license: "AGR-CI-2025-1140",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    neighborhoods: ["Cocody", "Angré", "Riviera Palmeraie", "Marcory Zone 4"],
    bio: "Démarcheuse immobilière indépendante nouvellement accréditée par le réseau Habitoo. Sélection rigoureuse de biens vérifiés sur site avec audits techniques préalables et vérification de la disponibilité.",
    stats: {
      propertyCount: 1,
      verifiedVisitsRate: "100%",
      memberSince: "Février 2025",
      avgResponseTime: "< 15min"
    },
    propertyIds: ["hab-ci-04"],
    reviews: [] // AUCUN AVIS !
  }
];

export const HabitooProvider = ({ children }) => {
  // Active city & currency
  const [activeCity, setActiveCity] = useState(() => {
    const saved = localStorage.getItem('habitoo_city');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const matched = CITIES.find(c => c.id === parsed.id);
        if (matched) return matched;
      } catch (e) {
        console.error("Error reading habitoo_city:", e);
      }
    }
    return CITIES[0];
  });

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('habitoo_favorites');
    return saved ? JSON.parse(saved) : ["hab-ci-01", "hab-ci-02"];
  });

  // Transactions
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('habitoo_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Scheduled Visits
  const [scheduledVisits, setScheduledVisits] = useState(() => {
    const saved = localStorage.getItem('habitoo_visits');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasCompleted = parsed.some(v => v.status === 'Effectuée');
          if (!hasCompleted) {
            return [INITIAL_VISITS[0], ...parsed];
          }
          return parsed;
        }
      } catch (e) {
        console.error("Error reading habitoo_visits:", e);
      }
    }
    return INITIAL_VISITS;
  });

  // Search Filters
  const [searchFilters, setSearchFilters] = useState({
    transactionType: "LOCATION", // "LOCATION" | "VENTE"
    location: "Abidjan",
    typologies: [],
    minBudget: 500000,
    maxBudget: 15000000,
    amenities: []
  });

const DEFAULT_USER = {
  id: "usr-google-88219",
  name: "Marc-Aurèle Kouassi",
  email: "m.kouassi@gmail.com",
  phone: "+225 07 78 92 14 00",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  authMethod: "google",
  isVerified: true,
  memberId: "CI-88219",
  role: "Propriétaire Déclarant",
  joinedDate: "Membre depuis Janvier 2025"
};

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const isLoggedOut = localStorage.getItem('habitoo_logged_out') === 'true';
    if (isLoggedOut) return null;
    const saved = localStorage.getItem('habitoo_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  // Auth Modal & Pending OTP state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAuth, setPendingAuth] = useState(null); // { method: 'email' | 'phone', identifier: string, code: '1111' }
  const postAuthCallbackRef = useRef(null);

  // Modals
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositInitialData, setDepositInitialData] = useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('habitoo_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('habitoo_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('habitoo_city', JSON.stringify(activeCity));
  }, [activeCity]);

  useEffect(() => {
    localStorage.setItem('habitoo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('habitoo_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('habitoo_visits', JSON.stringify(scheduledVisits));
  }, [scheduledVisits]);

  // User Published Properties
  const [userProperties, setUserProperties] = useState(() => {
    const saved = localStorage.getItem('habitoo_user_properties');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('habitoo_user_properties', JSON.stringify(userProperties));
  }, [userProperties]);

  const addUserProperty = (property) => {
    const newProp = {
      ...property,
      id: property.id === 'preview-card' ? `prop-pub-${Date.now().toString().slice(-4)}` : property.id,
      publishedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'En ligne'
    };
    setUserProperties(prev => [newProp, ...prev]);
    return newProp;
  };

  const deleteUserProperty = (propertyId) => {
    setUserProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const boostUserProperty = (propertyId, days = 7) => {
    const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
    setUserProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return {
          ...p,
          isBoosted: true,
          boostDays: days,
          boostedUntil: until,
          status: 'Boostée'
        };
      }
      return p;
    }));
  };

  // Vitrines des Professionnels (Démarcheurs & Agences) avec synchronisation de version
  const PRO_PROFILES_VERSION = "v3_demarcheurs_simulation";
  const [proProfiles, setProProfiles] = useState(() => {
    try {
      const storedVersion = localStorage.getItem('habitoo_pro_profiles_version');
      if (storedVersion !== PRO_PROFILES_VERSION) {
        localStorage.setItem('habitoo_pro_profiles_version', PRO_PROFILES_VERSION);
        localStorage.setItem('habitoo_pro_profiles', JSON.stringify(INITIAL_PRO_PROFILES));
        return INITIAL_PRO_PROFILES;
      }
      const saved = localStorage.getItem('habitoo_pro_profiles');
      return saved ? JSON.parse(saved) : INITIAL_PRO_PROFILES;
    } catch (e) {
      console.warn("Erreur lecture proProfiles localStorage, fallback INITIAL_PRO_PROFILES:", e);
      return INITIAL_PRO_PROFILES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('habitoo_pro_profiles', JSON.stringify(proProfiles));
      localStorage.setItem('habitoo_pro_profiles_version', PRO_PROFILES_VERSION);
    } catch (e) {
      console.error("Erreur sauvegarde proProfiles localStorage:", e);
    }
  }, [proProfiles]);

  const addProReview = (proId, reviewData) => {
    const newReview = {
      id: `rev-usr-${Date.now().toString().slice(-4)}`,
      author: reviewData.author?.trim() || 'Client Vérifié Habitoo',
      date: 'Aujourd\'hui',
      score: Number(reviewData.score) || 5,
      criteria: {
        punctuality: Number(reviewData.criteria?.punctuality) || 5,
        professionalism: Number(reviewData.criteria?.professionalism) || 5,
        compliance: Number(reviewData.criteria?.compliance) || 5
      },
      comment: reviewData.comment?.trim() || 'Avis certifié suite à une visite effectuée.',
      verifiedVisit: true,
      propertyTitle: reviewData.propertyTitle || 'Bien immobilier vérifié'
    };

    setProProfiles(prev => prev.map(pro => {
      if (pro.id === proId) {
        return {
          ...pro,
          reviews: [newReview, ...(pro.reviews || [])]
        };
      }
      return pro;
    }));

    return newReview;
  };

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('habitoo_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('habitoo_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notifId) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const updateUserProfile = (updates) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      return updated;
    });
  };

  const deleteAccount = () => {
    setCurrentUser(null);
    setUserProperties([]);
    setFavorites([]);
    setScheduledVisits([]);
    setNotifications([]);
    localStorage.removeItem('habitoo_user');
    localStorage.removeItem('habitoo_user_properties');
    localStorage.removeItem('habitoo_favorites');
    localStorage.removeItem('habitoo_visits');
    localStorage.removeItem('habitoo_notifications');
    localStorage.removeItem('habitoo_preview_property');
  };

  // Toggle Favorite
  const toggleFavorite = (propertyId) => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const isFavorite = (propertyId) => favorites.includes(propertyId);

  // Format Price based on active currency
  const formatPrice = (priceXOF, priceUSD, priceXAF, period = "") => {
    if (activeCity.currency === "USD") {
      const val = priceUSD || Math.round(priceXOF / 600);
      return `$ ${val.toLocaleString('en-US')}${period}`;
    }
    const val = activeCity.currency === "XAF" ? (priceXAF || priceXOF) : priceXOF;
    return `${val.toLocaleString('fr-FR')} ${activeCity.symbol}${period}`;
  };

  // Convert raw FCFA to active currency
  const formatCurrencyAmount = (amountFCFA) => {
    if (activeCity.currency === "USD") {
      return `$ ${(Math.round(amountFCFA / 600)).toLocaleString('en-US')}`;
    }
    return `${amountFCFA.toLocaleString('fr-FR')} ${activeCity.symbol}`;
  };

  // Book Escrow Visit
  const bookVisit = (property, date, time, paymentMethod) => {
    const fee = 10000;
    const visitId = `vis-${Date.now().toString().slice(-4)}`;
    const newVisit = {
      id: visitId,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyAddress: property.address,
      date: date,
      time: time,
      status: "Confirmé",
      fee: fee,
      escrowStatus: "Séquestre actif (10 000 FCFA bloqués)",
      agentName: property.agent.name,
      paymentMethod: paymentMethod
    };

    setScheduledVisits(prev => [newVisit, ...prev]);

    // Add transaction
    const newTx = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      type: "ESCROW_VISIT",
      title: `Frais de visite séquestre — ${property.title}`,
      amount: -fee,
      currency: "FCFA",
      date: "À l'instant",
      status: "Sous séquestre",
      ref: `ESC-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setTransactions(prev => [newTx, ...prev]);

    return newVisit;
  };

  // Notation d'une visite effectuée
  const rateVisit = (visitId, ratingData) => {
    setScheduledVisits(prev => {
      const updated = prev.map(v => {
        if (v.id === visitId) {
          return {
            ...v,
            rating: {
              ...ratingData,
              ratedAt: new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            }
          };
        }
        return v;
      });
      localStorage.setItem('habitoo_visits', JSON.stringify(updated));
      return updated;
    });
  };

  // Authentication: Google Login (direct pass, simulation)
  const loginWithGoogle = () => {
    const googleUser = {
      id: "usr-google-88219",
      name: "Marc-Aurèle Kouassi",
      email: "m.kouassi@gmail.com",
      phone: "+225 07 78 92 14 00",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      authMethod: "google",
      isVerified: true,
      memberId: "CI-88219",
      role: "Locataire / Investisseur",
      joinedDate: "Membre depuis Janvier 2025"
    };
    localStorage.removeItem('habitoo_logged_out');
    setCurrentUser(googleUser);
    setIsAuthModalOpen(false);
    setPendingAuth(null);
    if (postAuthCallbackRef.current) {
      postAuthCallbackRef.current();
      postAuthCallbackRef.current = null;
    }
    return googleUser;
  };

  // Authentication: Request OTP for Email or Phone
  const requestOtp = (identifier, method = 'email') => {
    // method: 'email' | 'phone'
    const newPending = {
      identifier: identifier.trim(),
      method: method,
      expectedCode: "1111",
      requestedAt: new Date().toISOString()
    };
    setPendingAuth(newPending);
    return newPending;
  };

  // Authentication: Verify OTP (Simulation code: 1111)
  const verifyOtp = (enteredCode) => {
    if (!pendingAuth) {
      return { success: false, message: "Aucune session d'authentification en cours." };
    }

    if (enteredCode === "1111") {
      let displayName = "Membre Habitoo";
      let emailVal = null;
      let phoneVal = null;

      if (pendingAuth.method === 'email') {
        emailVal = pendingAuth.identifier;
        const prefix = pendingAuth.identifier.split('@')[0];
        displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      } else {
        phoneVal = pendingAuth.identifier;
        displayName = `Utilisateur ${pendingAuth.identifier.slice(-4)}`;
      }

      const verifiedUser = {
        id: `usr-${pendingAuth.method}-${Date.now().toString().slice(-4)}`,
        name: displayName,
        email: emailVal,
        phone: phoneVal,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        authMethod: pendingAuth.method,
        isVerified: true,
        memberId: `CI-${Math.floor(10000 + Math.random() * 90000)}`,
        role: "Utilisateur certifié",
        joinedDate: "À l'instant"
      };

      localStorage.removeItem('habitoo_logged_out');
      setCurrentUser(verifiedUser);
      setIsAuthModalOpen(false);
      setPendingAuth(null);
      if (postAuthCallbackRef.current) {
        postAuthCallbackRef.current();
        postAuthCallbackRef.current = null;
      }
      return { success: true, user: verifiedUser };
    } else {
      return { 
        success: false, 
        message: "Code invalide. En mode simulation, veuillez saisir le code 1111." 
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.setItem('habitoo_logged_out', 'true');
    setCurrentUser(null);
    setPendingAuth(null);
  };

  return (
    <HabitooContext.Provider
      value={{
        activeCity,
        setActiveCity,
        favorites,
        toggleFavorite,
        isFavorite,
        transactions,
        scheduledVisits,
        bookVisit,
        rateVisit,
        formatPrice,
        formatCurrencyAmount,
        searchFilters,
        setSearchFilters,
        currentUser,
        setCurrentUser,
        isAuthModalOpen,
        openAuthModal: (callback) => {
          postAuthCallbackRef.current = callback || null;
          setIsAuthModalOpen(true);
        },
        closeAuthModal: () => {
          setIsAuthModalOpen(false);
          setPendingAuth(null);
          postAuthCallbackRef.current = null;
        },
        pendingAuth,
        setPendingAuth,
        loginWithGoogle,
        requestOtp,
        verifyOtp,
        logout,
        userProperties,
        addUserProperty,
        deleteUserProperty,
        boostUserProperty,
        notifications,
        markAllNotificationsRead,
        deleteNotification,
        updateUserProfile,
        deleteAccount,
        isDepositModalOpen,
        depositInitialData,
        openDepositModal: (initialData = null) => {
          setDepositInitialData(initialData);
          setIsDepositModalOpen(true);
        },
        closeDepositModal: () => {
          setIsDepositModalOpen(false);
          setDepositInitialData(null);
        },
        proProfiles,
        addProReview,
        getProProfile: (id) => proProfiles.find(p => p.id === id) || proProfiles[0]
      }}
    >
      {children}
    </HabitooContext.Provider>
  );
};

export const useHabitoo = () => useContext(HabitooContext);
