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
      security: "Poste de garde H24 et clôture électrifiée"
    },
    amenities: [
      "Groupe électrogène automatique (60 kVA)",
      "Forage et Réserve d'eau 5 000L",
      "Gardiennage H24",
      "Piscine à débordement",
      "Entièrement meublé haut de gamme",
      "Climatisation intégrale inverter",
      "Domotique et Caméras IA",
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
    auditStatus: "Audit physique certifié Habitoo — Titre foncier validé et conformité technique certifiée",
    chargesBreakdown: {
      copropriete: "250 000 FCFA / mois",
      securite: "Inclus (Gardiennage armé H24)",
      depotGarantie: "2 mois de caution sous séquestre",
      energie: "Quote-part groupe + compteur individuel CIE"
    },
    agent: {
      name: "Jean-Marc Kouassi",
      agency: "Démarcheur Indépendant Agréé",
      title: "Démarcheur Immobilier Agréé",
      proType: "DEMARCHEUR",
      proId: "demarcheur-kouassi",
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
      security: "Sas blindé, bunker certifié et vidéosurveillance 360°"
    },
    amenities: [
      "Groupe électrogène automatique (100 kVA)",
      "Forage et Réserve d'eau",
      "Gardiennage H24",
      "Piscine olympique",
      "Spa et Hammam privé",
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
      agency: "Particulier",
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
      security: "Gardiennage H24 et système d'alarme télésurveillé"
    },
    amenities: [
      "Groupe électrogène automatique (45 kVA)",
      "Forage et Réserve d'eau",
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
      "Forage et Réserve d'eau 10 000L",
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
      agency: "Particulier",
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
      security: "Poste de garde blindé et barrières infrarouges"
    },
    amenities: [
      "Groupe électrogène automatique (50 kVA)",
      "Forage et Réserve d'eau",
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
      agency: "Démarcheur Indépendant Agréé",
      title: "Démarcheur Immobilier Agréé",
      proType: "DEMARCHEUR",
      proId: "demarcheur-kouassi",
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
      security: "Gardiennage H24 et ascenseur codé"
    },
    amenities: [
      "Groupe électrogène automatique",
      "Forage et Réserve d'eau",
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
      agency: "Particulier",
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
      security: "Contrôle d'accès biométrique et conciergerie"
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
    auditStatus: "Audit physique certifié Habitoo — Contrôle sécuritaire et normes incendie conformes",
    chargesBreakdown: {
      copropriete: "180 000 FCFA / mois",
      securite: "Inclus (Accès biométrique)",
      depotGarantie: "2 mois",
      energie: "Groupe centralisé immeuble"
    },
    agent: {
      name: "Sarah Bamba",
      agency: "Ivoire Prestige Properties",
      title: "Agence Immobilière Agréée",
      proType: "AGENCE",
      proId: "agence-ivoire",
      certified: true,
      phone: "+225 07 08 09 10 11",
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
      security: "Poste de garde renforcé H24 et protocole diplomatique"
    },
    amenities: [
      "Groupe électrogène automatique (100 kVA redondant)",
      "Forage et Réserve d'eau 15 000L",
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
      agency: "Particulier",
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
      security: "Société internationale de sécurité H24 et sas blindé"
    },
    amenities: [
      "Groupe électrogène automatique (Double secours)",
      "Forage et Réserve d'eau (Station d'épuration UV)",
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
      security: "Gardiennage H24 et barrière levante"
    },
    amenities: [
      "Groupe électrogène automatique",
      "Forage et Réserve d'eau",
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
      name: "Aminata Traoré",
      agency: "Démarcheur Indépendant",
      title: "Démarcheur Indépendant Accrédité",
      proType: "DEMARCHEUR",
      proId: "demarcheur-nouveau",
      certified: true,
      phone: "+225 07 88 99 00 11",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    description: "Situé au cœur de la vie gastronomique et festive de Marcory Zone 4, cet appartement meublé avec des œuvres d'artistes ivoiriens contemporains offre un confort hôtelier 5 étoiles.",
    destination: "HABITATION"
  },
  {
    id: "hab-pro-01",
    destination: "PRO",
    proCategory: "BUREAU",
    isPro: true,
    advertiserType: "PRO",
    title: "Plateau d'Affaires Haussmannien Moderne — Le Plateau",
    type: "Bureaux",
    category: "LOCATION",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    neighborhood: "Le Plateau",
    address: "Avenue Chardy, Le Plateau, Abidjan",
    priceXOF: 4800000,
    priceXAF: 4800000,
    priceUSD: 8000,
    period: "/mois",
    leaseType: "Bail commercial 3-6-9",
    specs: {
      area: 320,
      offices: 8,
      workstations: 35,
      restrooms: 4,
      floor: 5,
      parkingSpaces: 4,
      windowDisplay: null,
      loadingDock: false,
      security: "Contrôle d'accès biométrique, SAS d'accueil et gardiennage H24"
    },
    amenities: [
      "Fibre optique très haut débit dédiée",
      "Groupe électrogène automatique (150 kVA)",
      "Climatisation intégrale multizone",
      "Gardiennage H24 & Vidéosurveillance",
      "Ascenseur privatif sécurisé",
      "Salle de serveurs climatisée (Baie 19 pouces)",
      "Kitchenette d'entreprise équipée",
      "4 Places de parking souterrain"
    ],
    coordinates: [5.3260, -4.0197],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "22 Février 2025",
    auditStatus: "Audit technique ERP & Sécurité incendie conforme — Titre foncier commercial validé",
    chargesBreakdown: {
      copropriete: "450 000 FCFA / mois",
      securite: "Inclus dans les charges d'immeuble",
      depotGarantie: "3 mois de loyer sous séquestre notarié",
      energie: "Compteur divisionnaire triphasé"
    },
    agent: {
      name: "Ivoire Prestige Properties",
      agency: "Agence Immobilière Agréée",
      title: "Pôle Immobilier d'Entreprise",
      proType: "AGENCE",
      proId: "agence-ivoire",
      certified: true,
      phone: "+225 27 20 22 23 24",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
    },
    description: "Plateau de bureaux contemporain situé en plein cœur financier d'Abidjan. Aménagement rationnel comprenant 8 bureaux fermés de direction, un open-space modulable pour 25 collaborateurs, une grande salle de conseil et une salle d'archives sécurisée."
  },
  {
    id: "hab-pro-02",
    destination: "PRO",
    proCategory: "COMMERCE",
    isPro: false,
    advertiserType: "PARTICULIER",
    title: "Boutique d'Angle & Emplacement Stratégique — Zone 4",
    type: "Commerce",
    category: "LOCATION",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    neighborhood: "Marcory Zone 4",
    address: "Boulevard de Marseille angle Rue Pierre et Marie Curie, Abidjan",
    priceXOF: 2600000,
    priceXAF: 2600000,
    priceUSD: 4330,
    period: "/mois",
    leaseType: "Bail commercial 3-6-9",
    specs: {
      area: 145,
      offices: 1,
      workstations: null,
      restrooms: 2,
      floor: 0,
      parkingSpaces: 5,
      windowDisplay: "Linéaire vitrine de 14 mètres en angle",
      loadingDock: false,
      security: "Rideau métallique motorisé et système alarme téléconnecté"
    },
    amenities: [
      "Linéaire vitrine de 14 mètres sur grand axe",
      "Climatisation intégrale inverter",
      "Accès PMR de plain-pied",
      "Groupe électrogène automatique",
      "Réserve de stockage attenante 30 m²",
      "Parking clientèle direct 5 véhicules"
    ],
    coordinates: [5.2915, -3.9850],
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "15 Février 2025",
    auditStatus: "Emplacement no 1 validé — Tous commerces autorisés hors nuisances sonores",
    chargesBreakdown: {
      copropriete: "150 000 FCFA / mois",
      securite: "Gardiennage commun de rue inclus",
      depotGarantie: "2 mois sous séquestre",
      energie: "Compteur individuel CIE"
    },
    agent: {
      name: "Dr. Patrick Ahoua",
      agency: "Propriétaire Particulier",
      title: "Bailleur Privé",
      certified: false,
      phone: "+225 05 06 07 08 09",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    description: "Rare opportunité d'implantation commerciale sur le Boulevard de Marseille. Visibilité maximale avec un linéaire vitré de 14 mètres en angle. Idéal enseigne premium, agence bancaire, showroom de design ou franchise internationale."
  },
  {
    id: "hab-pro-03",
    destination: "PRO",
    proCategory: "LOCAL_PRO",
    isPro: true,
    advertiserType: "PRO",
    title: "Cabinet Professionnel d'Exercice Libéral — Vallon",
    type: "Local professionnel",
    category: "VENTE",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    neighborhood: "Deux Plateaux",
    address: "Rue des Jardins, Deux Plateaux Vallon, Abidjan",
    priceXOF: 240000000,
    priceXAF: 240000000,
    priceUSD: 400000,
    period: "",
    leaseType: "Vente en pleine propriété commerciale",
    specs: {
      area: 210,
      offices: 5,
      workstations: 10,
      restrooms: 3,
      floor: 1,
      parkingSpaces: 3,
      windowDisplay: null,
      loadingDock: false,
      security: "Interphone vidéo, SAS d'accueil et gardiennage d'immeuble"
    },
    amenities: [
      "Salle d'attente patientèle / clientèle séparée",
      "5 Cabinets de consultation ou bureaux indépendants",
      "Climatisation intégrale",
      "Normes d'accessibilité PMR",
      "Groupe électrogène de secours",
      "Fibre optique professionnelle"
    ],
    coordinates: [5.3620, -3.9980],
    images: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "08 Février 2025",
    auditStatus: "Titre Foncier vérifié et acte notarié disponible sans hypothèque",
    chargesBreakdown: {
      copropriete: "180 000 FCFA / trimestre",
      securite: "Inclus",
      depotGarantie: "Compte séquestre notarié 10%",
      energie: "Autonome"
    },
    agent: {
      name: "Jean-Marc Kouassi",
      agency: "Démarcheur Indépendant Agréé",
      title: "Démarcheur Immobilier Agréé",
      proType: "DEMARCHEUR",
      proId: "demarcheur-kouassi",
      certified: true,
      phone: "+225 07 08 09 10 11",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    description: "Local professionnel agencé sur mesure pour profession libérale (cabinet médical, cabinet d'avocats, étude notariale ou cabinet d'expertise comptable). Environnement calme et prestigieux à proximité immédiate de la Rue des Jardins."
  },
  {
    id: "hab-pro-04",
    destination: "PRO",
    proCategory: "ENTREPOT",
    isPro: true,
    advertiserType: "PRO",
    title: "Entrepôt Logistique Hauteur 9m avec Quai — Limete",
    type: "Entrepôt et local d'activité",
    category: "LOCATION",
    city: "Kinshasa",
    country: "RDC",
    neighborhood: "Kinshasa Gombe",
    address: "Zone d'Activité Poids Lourds, Limete, Kinshasa",
    priceXOF: 5700000,
    priceXAF: 5700000,
    priceUSD: 9500,
    period: "/mois",
    leaseType: "Bail commercial d'activité",
    specs: {
      area: 1250,
      offices: 3,
      workstations: 12,
      restrooms: 4,
      floor: 0,
      parkingSpaces: 10,
      windowDisplay: null,
      loadingDock: true,
      security: "Guérite de contrôle poids lourds, barbelés et caméras thermique"
    },
    amenities: [
      "Quai de déchargement double porte sectionnelle",
      "Hauteur sous poutre utile de 9 mètres",
      "Dalle béton traitée anti-poussière (charge 5T/m²)",
      "Poste transformateur électrique MT dédié 250 kVA",
      "Bureaux d'exploitation climatisés (90 m²)",
      "Aire de giration semi-remorques"
    ],
    coordinates: [-4.3500, 15.3400],
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "12 Février 2025",
    auditStatus: "Audit technique structurel et autorisation d'exploitation industrielle valide",
    chargesBreakdown: {
      copropriete: "N/A — Parcelle autonome",
      securite: "Gardiennage privatif sur site",
      depotGarantie: "3 mois de loyer sous séquestre",
      energie: "Ligne directe SNEL + cuve fioul 5000L"
    },
    agent: {
      name: "Kabila & Partners Immobilier",
      agency: "Agence Agréée Kinshasa",
      title: "Département Industriel & Logistique",
      certified: true,
      phone: "+243 81 22 33 444",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    description: "Bâtiment d'activité logistique aux normes internationales, conçu pour transit et stockage de marchandises sous température contrôlée. Accès aisé vers le port fluvial et les axes majeurs de Kinshasa."
  },
  {
    id: "hab-pro-05",
    destination: "PRO",
    proCategory: "COWORKING",
    isPro: true,
    advertiserType: "PRO",
    title: "Espace Coworking & Bureaux Prêts à l'Emploi — Gombe",
    type: "Coworking",
    category: "LOCATION",
    city: "Kinshasa",
    country: "RDC",
    neighborhood: "Kinshasa Gombe",
    address: "Boulevard du 30 Juin, Gombe, Kinshasa",
    priceXOF: 2100000,
    priceXAF: 2100000,
    priceUSD: 3500,
    period: "/mois",
    leaseType: "Contrat prestation coworking",
    specs: {
      area: 340,
      offices: 6,
      workstations: 40,
      restrooms: 4,
      floor: 3,
      parkingSpaces: 6,
      windowDisplay: null,
      loadingDock: false,
      security: "Badge électronique crypté et gardiennage 24/7"
    },
    amenities: [
      "Double liaison fibre optique redondante",
      "3 Salles de réunion avec visioconférence 4K",
      "Cabines acoustiques insonorisées (Phone booths)",
      "Espace cafétéria et lounge networking",
      "Climatisation réversible inverter",
      "Imprimantes d'entreprise sécurisées"
    ],
    coordinates: [-4.3050, 15.2950],
    images: [
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "20 Février 2025",
    auditStatus: "Espace plug & play certifié Habitoo — Services et connectivité audités",
    chargesBreakdown: {
      copropriete: "Inclus dans la formule globale",
      securite: "Inclus",
      depotGarantie: "1 mois de caution sous séquestre",
      energie: "Inclus"
    },
    agent: {
      name: "Kabila & Partners Immobilier",
      agency: "Agence Agréée Kinshasa",
      title: "Conseil Espaces de Travail",
      certified: true,
      phone: "+243 81 22 33 444",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    description: "Espace de travail partagé haut de gamme au cœur du quartier des affaires de la Gombe. Conçu pour startups en hyper-croissance, filiales internationales et équipes agiles avec flexibilité contractuelle totale."
  },
  {
    id: "hab-pro-06",
    destination: "PRO",
    proCategory: "BUREAU",
    isPro: false,
    advertiserType: "PARTICULIER",
    title: "Siège d'Entreprise Indépendant & Showroom — Centre-Ville",
    type: "Bureaux",
    category: "VENTE",
    city: "Brazzaville",
    country: "Congo",
    neighborhood: "Centre-Ville",
    address: "Avenue Amilcar Cabral, Centre-Ville, Brazzaville",
    priceXOF: 520000000,
    priceXAF: 520000000,
    priceUSD: 865000,
    period: "",
    leaseType: "Vente en pleine propriété",
    specs: {
      area: 580,
      offices: 12,
      workstations: 50,
      restrooms: 6,
      floor: 0,
      parkingSpaces: 12,
      windowDisplay: "Hall vitré showroom 80 m²",
      loadingDock: false,
      security: "Clôture sécurisée, poste de garde et vidéosurveillance"
    },
    amenities: [
      "Showroom commercial au rez-de-chaussée",
      "12 Bureaux et 2 salles de conférence",
      "Cour pavée privative avec 12 places de parking",
      "Groupe électrogène automatique 80 kVA",
      "Forage et bâche à eau 10 000L",
      "Climatisation intégrale"
    ],
    coordinates: [-4.2720, 15.2810],
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=85"
    ],
    floorPlan: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=85",
    auditDate: "16 Février 2025",
    auditStatus: "Titre Foncier notarié certifié — Propriété d'entreprise libre de toute occupation",
    chargesBreakdown: {
      copropriete: "N/A — Bâtiment individuel",
      securite: "Privative",
      depotGarantie: "Compte séquestre notarié 10%",
      energie: "Autonome groupe + SNE"
    },
    agent: {
      name: "Alain Gnahoré",
      agency: "Propriétaire",
      certified: false,
      phone: "+242 06 12 34 56",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    description: "Immeuble commercial et tertiaire indépendant idéal pour siège de banque, compagnie d'assurance ou multinationale à Brazzaville. Bénéficie d'une visibilité d'angle exceptionnelle et d'un stationnement privé rare en centre-ville."
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

export const PRO_CATEGORIES = [
  { id: "BUREAU", label: "Bureaux", shortLabel: "Bureaux" },
  { id: "COMMERCE", label: "Commerces & Boutiques", shortLabel: "Commerces" },
  { id: "LOCAL_PRO", label: "Locaux professionnels", shortLabel: "Locaux pro" },
  { id: "ENTREPOT", label: "Entrepôts & Activité", shortLabel: "Entrepôts" },
  { id: "COWORKING", label: "Coworking & Espaces partagés", shortLabel: "Coworking" },
  { id: "SPECIFIQUE", label: "Activités spécifiques", shortLabel: "Spécifique" },
  { id: "AUTRE", label: "Autres biens professionnels", shortLabel: "Autres" }
];

export const PRO_LEASE_TYPES = [
  "Bail commercial 3-6-9",
  "Bail professionnel",
  "Bail dérogatoire / précaire",
  "Contrat prestation coworking",
  "Vente en pleine propriété"
];

export const PRO_AMENITIES_FILTERS = [
  "Fibre optique très haut débit",
  "Groupe électrogène automatique",
  "Climatisation intégrale",
  "Gardiennage H24 & Vidéosurveillance",
  "Parking privé ou clientèle",
  "Vitrine sur rue",
  "Accès PMR",
  "Quai de déchargement",
  "Salles de réunion équipées"
];

export const LUXURY_AMENITIES_FILTERS = [
  "+ Groupe Électrogène",
  "+ Forage / Réserve d'eau",
  "+ Gardiennage H24",
  "+ Piscine",
  "+ Entièrement Meublé"
];

