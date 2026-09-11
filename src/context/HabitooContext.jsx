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
    id: "vis-01",
    propertyId: "hab-ci-01",
    propertyTitle: "Villa Signature 'Le Belvédère' — Riviera Golf",
    propertyAddress: "Boulevard de France prolongé, Cocody, Abidjan",
    date: "26 Février 2025",
    time: "15:00 - 16:00",
    status: "Confirmé",
    fee: 10000,
    escrowStatus: "Séquestre actif",
    agentName: "Jean-Marc Kouassi (Ivoire Prestige)",
    paymentMethod: "Portefeuille Habitoo"
  },
  {
    id: "vis-02",
    propertyId: "hab-ci-02",
    propertyTitle: "Penthouse Panoramique 'Laguna Sky' — Plateau",
    propertyAddress: "Avenue Chardy, Le Plateau, Abidjan",
    date: "01 Mars 2025",
    time: "10:30 - 11:30",
    status: "En attente",
    fee: 10000,
    escrowStatus: "Validation créneau agent",
    agentName: "Fatoumata Bamba (Abidjan Prime)",
    paymentMethod: "Orange Money"
  }
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
    id: "notif-02",
    type: "ESCROW",
    title: "Séquestre activé avec succès",
    message: "Les frais de visite (10 000 FCFA) sont conservés en compte tiers de confiance.",
    date: "Hier à 16:20",
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
    return saved ? JSON.parse(saved) : INITIAL_VISITS;
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

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('habitoo_user');
    return saved ? JSON.parse(saved) : null;
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
        }
      }}
    >
      {children}
    </HabitooContext.Provider>
  );
};

export const useHabitoo = () => useContext(HabitooContext);
