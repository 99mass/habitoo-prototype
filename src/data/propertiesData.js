export const PROPERTIES_DATA = [
  {
    id: "hab-ci-01",
    isPro: true,
    advertiserType: "PRO",
    title: "Villa Signature 'Le Belvédère' — Riviera Golf",
    type: "Villa d'architecte",
    category: "LOCATION",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    neighborhood: "Cocody Riviera Golf",
    address: "Boulevard de France prolongé, Cocody, Abidjan",
    priceXOF: 3500000,
    priceXAF: 3500000,
    priceUSD: 5800,
    period: "/mois",
    specs: {
      bedrooms: 5,
      bathrooms: 6,
      area: 650,
      security: "Poste de garde H24 & clôture électrifiée"
    },
    amenities: [
      "Groupe électrogène automatique (60 kVA)",
      "Forage & Réserve d'eau 5 000L",
      "Gardiennage H24",
      "Piscine à débordement",
      "Entièrement meublé haut de gamme",
      "Climatisation intégrale inverter",
      "Domotique & Caméras IA",
      "Garage fermé 4 véhicules"
    ],
    coordinates: [5.3484, -3.9780],
    images: [
      "/assets/villa-abidjan-signature.jpg",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "18 Février 2025",
    auditStatus: "Audit physique certifié Habitoo — Titre foncier validé & conformité technique certifiée",
    chargesBreakdown: {
      copropriete: "250 000 FCFA / mois",
      securite: "Inclus (Gardiennage armé H24)",
      depotGarantie: "2 mois de caution sous séquestre",
      energie: "Quote-part groupe + compteur individuel CIE"
    },
    agent: {
      name: "Jean-Marc Kouassi",
      agency: "Ivoire Prestige Properties",
      certified: true,
      phone: "+225 07 08 09 10 11",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    description: "Chef-d'œuvre contemporain érigé au cœur de la Riviera Golf. Cette demeure d'exception bénéficie d'une double hauteur sous plafond, d'une suite parentale de 90 m² avec terrasse privée donnant sur le parcours, et d'une autonomie totale en énergie et eau potable."
  },
  {
    id: "hab-ci-03",
    isPro: false,
    advertiserType: "PARTICULIER",
    title: "Résidence Privée 'Villa Jade' — Ambassades",
    type: "Villa d'architecte",
    category: "VENTE",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    neighborhood: "Cocody Ambassades",
    address: "Rue des Ambassadeurs, Cocody, Abidjan",
    priceXOF: 950000000,
    priceXAF: 950000000,
    priceUSD: 1575000,
    period: "",
    specs: {
      bedrooms: 6,
      bathrooms: 7,
      area: 920,
      security: "Sas blindé, bunker certifié & vidéosurveillance 360°"
    },
    amenities: [
      "Groupe électrogène automatique (100 kVA)",
      "Forage & Réserve d'eau",
      "Gardiennage H24",
      "Piscine olympique",
      "Spa & Hammam privé",
      "Logement de personnel séparé",
      "Jardin paysager 2 000 m²"
    ],
    coordinates: [5.3421, -3.9982],
    images: [
      "/assets/category-maison.jpg",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "05 Février 2025",
    auditStatus: "Audit notarial et physique certifié Habitoo — Certificat de Propriété Foncière (CPF) vérifié",
    chargesBreakdown: {
      copropriete: "N/A (Propriété individuelle)",
      securite: "Privative",
      depotGarantie: "Compte séquestre notarié 10%",
      energie: "Autonome solaire + groupe"
    },
    agent: {
      name: "Alain Gnahoré",
      agency: "Particulier (Direct Propriétaire)",
      certified: false,
      phone: "+225 01 02 03 04 05",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    description: "Une des adresses les plus exclusives d'Afrique de l'Ouest. Vente directe de particulier à particulier sans frais d'agence. Conçue pour une clientèle diplomatique ou de hauts dirigeants, cette propriété offre un niveau de sécurité maximal et des volumes architecturaux monumentaux."
  },
  {
    id: "hab-cg-01",
    isPro: true,
    advertiserType: "PRO",
    title: "Villa Les Flamboyants — Mpila Fleuve",
    type: "Villa d'architecte",
    category: "LOCATION",
    city: "Brazzaville",
    country: "Congo",
    neighborhood: "Brazzaville Mpila",
    address: "Corniche de Mpila, Brazzaville",
    priceXOF: 2400000,
    priceXAF: 2400000,
    priceUSD: 4000,
    period: "/mois",
    specs: {
      bedrooms: 4,
      bathrooms: 4,
      area: 420,
      security: "Gardiennage H24 & système d'alarme télésurveillé"
    },
    amenities: [
      "Groupe électrogène automatique (45 kVA)",
      "Forage & Réserve d'eau",
      "Gardiennage H24",
      "Piscine avec vue fleuve",
      "Entièrement Meublé",
      "Terrasse lounge en teck",
      "Cuisine américaine équipée"
    ],
    coordinates: [-4.2560, 15.3080],
    images: [
      "/assets/duplex-congo-river.jpg",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "02 Février 2025",
    auditStatus: "Audit physique certifié Habitoo — Audit technique des réseaux et clôtures validé",
    chargesBreakdown: {
      copropriete: "150 000 FCFA / mois",
      securite: "Inclus",
      depotGarantie: "2 mois sous séquestre",
      energie: "Groupe automatisé"
    },
    agent: {
      name: "Rodrigue Ngoma",
      agency: "Brazza Immo Prestige",
      certified: true,
      phone: "+242 06 612 3456",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
    },
    description: "Située le long de la nouvelle corniche de Mpila avec une vue dégagée sur le fleuve Congo. Idéale pour cadres d'entreprises internationales ou diplomates recherchant quiétude et raffinement."
  },
  {
    id: "hab-cd-02",
    isPro: false,
    advertiserType: "PARTICULIER",
    title: "Manoir Colonial Modernisé — Macampagne",
    type: "Villa d'architecte",
    category: "VENTE",
    city: "Kinshasa",
    country: "RDC",
    neighborhood: "Kinshasa Ngaliema",
    address: "Quartier Macampagne, Ngaliema, Kinshasa",
    priceXOF: 1350000000,
    priceXAF: 1350000000,
    priceUSD: 2250000,
    period: "",
    specs: {
      bedrooms: 5,
      bathrooms: 6,
      area: 800,
      security: "Poste de garde blindé H24"
    },
    amenities: [
      "Groupe électrogène automatique (80 kVA)",
      "Forage & Réserve d'eau 10 000L",
      "Gardiennage H24",
      "Piscine",
      "Court de tennis privé",
      "Parc arboré 3 500 m²",
      "Quartier résidentiel calme et boisé"
    ],
    coordinates: [-4.3350, 15.2600],
    images: [
      "/assets/category-appartement.jpg",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "28 Janvier 2025",
    auditStatus: "Audit physique certifié Habitoo — Acte notarié et Certificat d'Enregistrement vérifiés",
    chargesBreakdown: {
      copropriete: "N/A (Propriété privative)",
      securite: "Privative",
      depotGarantie: "Compte séquestre notarié",
      energie: "Installation solaire hybride"
    },
    agent: {
      name: "Sarah Kalala",
      agency: "Particulier (Direct Propriétaire)",
      certified: false,
      phone: "+243 89 987 6543",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    },
    description: "Havre de paix sur les collines de Ngaliema. Vente directe de particulier à particulier. Alliant le charme intemporel de l'architecture coloniale aux technologies vertes contemporaines, cette propriété est un joyau rare à Kinshasa."
  },
  {
    id: "hab-ci-05",
    isPro: true,
    advertiserType: "PRO",
    title: "Manoir Contemporain 'Le Vallon' — 2 Plateaux",
    type: "Villa d'architecte",
    category: "VENTE",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    neighborhood: "Deux Plateaux Vallons",
    address: "Rue des Jardins, Cocody Deux Plateaux, Abidjan",
    priceXOF: 780000000,
    priceXAF: 780000000,
    priceUSD: 1290000,
    period: "",
    specs: {
      bedrooms: 5,
      bathrooms: 5,
      area: 600,
      security: "Poste de garde blindé & barrières infrarouges"
    },
    amenities: [
      "Groupe électrogène automatique (50 kVA)",
      "Forage & Réserve d'eau",
      "Gardiennage H24",
      "Piscine miroir chauffée",
      "Jardin tropical paysager",
      "Salle de cinéma privée"
    ],
    coordinates: [5.3650, -3.9950],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "11 Février 2025",
    auditStatus: "Audit physique certifié Habitoo — Titre foncier validé",
    chargesBreakdown: {
      copropriete: "N/A",
      securite: "Privative",
      depotGarantie: "Compte séquestre notarié",
      energie: "Groupe individuel"
    },
    agent: {
      name: "Jean-Marc Kouassi",
      agency: "Ivoire Prestige Properties",
      certified: true,
      phone: "+225 07 08 09 10 11",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    description: "Une propriété d'exception aux Deux Plateaux Vallons. Conçue avec des lignes contemporaines pures, de grands volumes baignés de lumière et une piscine miroir spectaculaire."
  },
  {
    id: "hab-cg-02",
    isPro: false,
    advertiserType: "PARTICULIER",
    title: "Appartement de Maître 'Le Nabemba' — Centre-Ville",
    type: "Appartement meublé",
    category: "LOCATION",
    city: "Brazzaville",
    country: "Congo",
    neighborhood: "Brazzaville Centre-Ville",
    address: "Avenue Amilcar Cabral, Centre-Ville, Brazzaville",
    priceXOF: 1600000,
    priceXAF: 1600000,
    priceUSD: 2650,
    period: "/mois",
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      area: 210,
      security: "Gardiennage H24 & ascenseur codé"
    },
    amenities: [
      "Groupe électrogène automatique",
      "Forage & Réserve d'eau",
      "Gardiennage H24",
      "Entièrement Meublé",
      "Climatisation intégrale",
      "Parking sous-terrain réservé"
    ],
    coordinates: [-4.2690, 15.2830],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "19 Février 2025",
    auditStatus: "Audit physique certifié Habitoo — Équipements de confort vérifiés",
    chargesBreakdown: {
      copropriete: "100 000 FCFA / mois",
      securite: "Inclus",
      depotGarantie: "2 mois",
      energie: "Compteur individuel"
    },
    agent: {
      name: "Grace Mabiala",
      agency: "Particulier (Direct Propriétaire)",
      certified: false,
      phone: "+242 05 555 4321",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80"
    },
    description: "À proximité immédiate des banques, ministères et ambassades. Décoration épurée, literie hôtelière haut de gamme et luminosité remarquable. Location directe sans intermédiaire."
  },
  {
    id: "hab-ci-02",
    isPro: true,
    advertiserType: "PRO",
    title: "Penthouse Panoramique 'Laguna Sky' — Plateau",
    type: "Penthouse",
    category: "LOCATION",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    neighborhood: "Le Plateau",
    address: "Avenue Chardy, Le Plateau, Abidjan",
    priceXOF: 2800000,
    priceXAF: 2800000,
    priceUSD: 4650,
    period: "/mois",
    specs: {
      bedrooms: 3,
      bathrooms: 4,
      area: 380,
      security: "Contrôle d'accès biométrique & conciergerie"
    },
    amenities: [
      "Groupe électrogène automatique",
      "Gardiennage H24",
      "Piscine sur toit terrasse",
      "Entièrement Meublé",
      "Ascenseur privatif à clé",
      "Vue panoramique lagune Ébrié",
      "Cave à vin climatisée"
    ],
    coordinates: [5.3240, -4.0190],
    images: [
      "/assets/duplex-congo-river.jpg",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "24 Janvier 2025",
    auditStatus: "Audit physique certifié Habitoo — Contrôle sécuritaire & normes incendie conformes",
    chargesBreakdown: {
      copropriete: "180 000 FCFA / mois",
      securite: "Inclus (Accès biométrique)",
      depotGarantie: "2 mois",
      energie: "Groupe centralisé immeuble"
    },
    agent: {
      name: "Fatoumata Bamba",
      agency: "Abidjan Prime Real Estate",
      certified: true,
      phone: "+225 05 44 33 22 11",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    description: "Une vue époustouflante sur la lagune Ébrié et le pont Alassane Ouattara. Ce penthouse d'angle propose des finitions en marbre de Carrare, une cuisine italienne Boffi et une terrasse de 120 m² avec bassin chauffé."
  },
  {
    id: "hab-cd-03",
    isPro: false,
    advertiserType: "PARTICULIER",
    title: "Résidence Diplomatique 'Mont Fleuri' — Ngaliema",
    type: "Résidences sécurisées",
    category: "LOCATION",
    city: "Kinshasa",
    country: "RDC",
    neighborhood: "Kinshasa Mont Fleuri",
    address: "Avenue de la Montagne, Mont Fleuri, Kinshasa",
    priceXOF: 5200000,
    priceXAF: 5200000,
    priceUSD: 8600,
    period: "/mois",
    specs: {
      bedrooms: 5,
      bathrooms: 6,
      area: 720,
      security: "Poste de garde renforcé H24 & protocole diplomatique"
    },
    amenities: [
      "Groupe électrogène automatique (100 kVA redondant)",
      "Forage & Réserve d'eau 15 000L",
      "Gardiennage H24",
      "Piscine",
      "Entièrement Meublé",
      "Héliport d'urgence à proximité",
      "Vue dominante sur tout Kinshasa"
    ],
    coordinates: [-4.3410, 15.2480],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "20 Janvier 2025",
    auditStatus: "Audit physique certifié Habitoo — Normes de sécurité UN / Diplomatiques validées",
    chargesBreakdown: {
      copropriete: "$800 / mois",
      securite: "Inclus",
      depotGarantie: "3 mois",
      energie: "Centrale hybride"
    },
    agent: {
      name: "Christian Mputu",
      agency: "Particulier (Direct Propriétaire)",
      certified: false,
      phone: "+243 81 234 5678",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80"
    },
    description: "Une des plus somptueuses résidences privées de Mont Fleuri. Offrant une sécurité sans compromis et un panorama grandiose sur Kinshasa et le fleuve."
  },
  {
    id: "hab-cd-01",
    isPro: true,
    advertiserType: "PRO",
    title: "Le Grand Fleuve — Duplex d'Exception Gombe",
    type: "Penthouses",
    category: "LOCATION",
    city: "Kinshasa",
    country: "RDC",
    neighborhood: "Kinshasa Gombe",
    address: "Boulevard du 30 Juin, Gombe, Kinshasa",
    priceXOF: 4500000,
    priceXAF: 4500000,
    priceUSD: 7500,
    period: "/mois",
    specs: {
      bedrooms: 4,
      bathrooms: 5,
      area: 480,
      security: "Société internationale de sécurité H24 & sas blindé"
    },
    amenities: [
      "Groupe électrogène automatique (Double secours)",
      "Forage & Réserve d'eau (Station d'épuration UV)",
      "Gardiennage H24",
      "Piscine panoramique",
      "Entièrement Meublé",
      "Fibre optique dédiée",
      "Vue imprenable sur le fleuve Congo"
    ],
    coordinates: [-4.3040, 15.3050],
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "14 Février 2025",
    auditStatus: "Audit physique certifié Habitoo — Double redondance énergétique et eau certifiée",
    chargesBreakdown: {
      copropriete: "$600 / mois",
      securite: "Inclus (Gardiennage armé)",
      depotGarantie: "3 mois sous séquestre",
      energie: "Groupe fuel centralisé"
    },
    agent: {
      name: "Christian Mputu",
      agency: "Congo Luxury Estates",
      certified: true,
      phone: "+243 81 234 5678",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80"
    },
    description: "Une vue saisissante sur les méandres du majestueux fleuve Congo et les lumières de Brazzaville en face. Cette résidence offre une autonomie totale et des standards de sécurité dignes des institutions internationales."
  },
  {
    id: "hab-ci-04",
    isPro: true,
    advertiserType: "PRO",
    title: "Appartement d'Art Déco Meublé — Zone 4",
    type: "Appartement meublé",
    category: "LOCATION",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    neighborhood: "Marcory Zone 4",
    address: "Rue Paul Langevin, Marcory Zone 4, Abidjan",
    priceXOF: 1900000,
    priceXAF: 1900000,
    priceUSD: 3150,
    period: "/mois",
    specs: {
      bedrooms: 2,
      bathrooms: 2,
      area: 165,
      security: "Gardiennage H24 & barrière levante"
    },
    amenities: [
      "Groupe électrogène automatique",
      "Forage & Réserve d'eau",
      "Gardiennage H24",
      "Piscine en rooftop",
      "Entièrement Meublé",
      "Fibre optique haut débit",
      "Ménage hebdomadaire inclus"
    ],
    coordinates: [5.2890, -3.9870],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "10 Février 2025",
    auditStatus: "Audit physique certifié Habitoo — Inventaire mobilier de luxe complet",
    chargesBreakdown: {
      copropriete: "120 000 FCFA / mois",
      securite: "Inclus",
      depotGarantie: "2 mois",
      energie: "Compteur prépayé"
    },
    agent: {
      name: "Aïcha Traoré",
      agency: "Lagune Living",
      certified: false,
      phone: "+225 07 88 99 00 11",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    description: "Situé au cœur de la vie gastronomique et festive de Marcory Zone 4, cet appartement meublé avec des œuvres d'artistes ivoiriens contemporains offre un confort hôtelier 5 étoiles."
  }
];

export const CITIES = [
  { id: "abidjan", name: "Abidjan", country: "Côte d'Ivoire", currency: "XOF", flag: "🇨🇮", symbol: "FCFA", coords: [5.3484, -3.9780] },
  { id: "kinshasa", name: "Kinshasa", country: "RDC", currency: "USD", flag: "🇨🇩", symbol: "$", coords: [-4.3250, 15.3000] },
  { id: "brazzaville", name: "Brazzaville", country: "Congo", currency: "XAF", flag: "🇨🇬", symbol: "FCFA", coords: [-4.2690, 15.2830] }
];

export const PROPERTY_TYPES = [
  "Villas d'architecte",
  "Penthouses",
  "Appartements meublés",
  "Résidences sécurisées"
];

export const LUXURY_AMENITIES_FILTERS = [
  "+ Groupe Électrogène",
  "+ Forage / Réserve d'eau",
  "+ Gardiennage H24",
  "+ Piscine",
  "+ Entièrement Meublé"
];
