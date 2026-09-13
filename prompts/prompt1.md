Contexte & Rôle :

Nouvelle session de travail sur notre plateforme immobilière d'exception Habitoo (React / Vite / Vanilla CSS). Nous abordons une phase critique d'ingénierie front-end : l'audit et l'implémentation de la Responsivité Globale et de l'expérience PWA (Progressive Web App) pour l'ensemble de l'Espace PRO (`/pro/*`).

Objectif Produit & Ergonomie :
La majorité des professionnels sur le terrain (notamment les Démarcheurs indépendants) utiliseront l'Espace PRO depuis leur smartphone. Nous refusons catégoriquement le rendu d'un « site web de bureau simplement rétréci ». Nous exigeons une expérience digne d'une application mobile native de standing international (type Revolut Pro, Airbnb Host ou Stripe Mobile) : gestuelle naturelle au pouce, fluidité 60 FPS, zéro saut d'interface, et gestion rigoureuse des conditions de mobilité réelles en Afrique (zones à faible débit, écrans 375px à 430px).

Consigne d'exécution :

Respecte impérativement le protocole pas-à-pas. Ne modifie et ne crée aucun fichier pour l'instant. Établis d'abord un plan d'audit architectural et une checklist séquentielle d'adaptation, puis attends mon accord explicite avant d'intervenir sur le code.

Spécifications PWA & Standards d'Ergonomie Mobile (375px - 430px)

1. Shell PWA & Gestion des Zones Physiques (Safe Areas) :
- Configuration du viewport moderne avec prise en compte des encoches (`viewport-fit=cover`).
- Intégration rigoureuse des variables d'environnement physiques :
  • `padding-top: env(safe-area-inset-top)` pour les en-têtes sous les barres d'état/îlots dynamiques.
  • `padding-bottom: env(safe-area-inset-bottom)` pour préserver la barre de navigation basse des gestes de balayage système.
- Sensation tactile native : désactivation du tap highlight grisâtre parasite (`-webkit-tap-highlight-color: transparent`) et interdiction du zoom intempestif sur les champs de saisie (taille de police minimale de 16px sur tous les `input` et `select`).

2. Mutation de la Navigation : Du TabView Desktop à la PWA Mobile :
Sur grand écran, nous avons notre TabView horizontal. Sur mobile, la navigation mute intelligemment pour s'adapter à la main :
- Topbar Mobile Compacte (Hauteur fixe 56px) :
  • Logo Habitoo PRO simplifié + pastille discrète du pays/devise.
  • Avatar agent avec micro-badge PRO vert ou bleu.
  • Accès rapide notifications / solde crédits.
- Barre de Navigation Basse Native (PWA Bottom Bar, position: fixed; bottom: 0) :
  • Fond dépoli ultra-élégant (`backdrop-filter: blur(16px); background: rgba(255,255,255,0.85)`).
  • 4 onglets majeurs + 1 déclencheur central surélevé :
    1. [📊 Accueil / Dashboard]
    2. [📋 Annonces]
    3. [➕ Bouton Central Surélevé "Publier"] : Accès réflexe immédiat pour capturer un bien sur le terrain.
    4. [📅 Visites]
    5. [☰ Plus] : Déclenche une "Bottom Sheet" (tiroir modal montant au pouce) pour accéder à : *Portefeuille*, *Académie*, *Profil public* et *Paramètres*.
- Conservation d'un sous-défilement horizontal fluide pour les filtres de données (pills/chips scrollables horizontalement avec masquage de la barre de défilement : `scrollbar-width: none`).

3. Responsivité des Graphiques SVG & Densité de Données :
- Refonte des grilles Bento en colonne unique fluide (1fr) sans débordement horizontal (`overflow-x: hidden`).
- Adaptation des composants de Data Viz :
  • L'Area Chart (Courbe d'audience) : adaptation dynamique de la `viewBox` SVG pour rester parfaitement lisible sur 360px de large, réduction du nombre de labels de dates sur l'axe X pour éviter les chevauchements, et activation du tooltip au toucher (`onTouchStart`).
  • Le Funnel de conversion & le Donut Chart : empilement vertical fluide avec légendes repositionnées sous le graphique pour une lecture instantanée.
  • Cartes KPI : transformation en grille 2x2 compacte avec micro-sparklines préservées.

4. Formulaires de Mobilité & Prises de Photos :
- Optimisation du formulaire de publication PRO et du tunnel KYC pour le terrain :
  • Claviers virtuels adaptés aux types de données (`inputMode="numeric"` ou `inputMode="tel"` pour les prix, téléphones et superficies).
  • Zone d'upload photos calibrée pour l'utilisation directe de l'appareil photo du smartphone (`accept="image/*" capture="environment"`).
  • Boutons d'action principaux sticky en bas d'écran (juste au-dessus de la zone de sécurité) pour validation sans effort du pouce.


Ce que tu dois faire maintenant :
1. Analyse l'état actuel des composants de l'Espace PRO et identifie les ruptures de mise en page existantes sur écran mobile (375px).
2. Propose une checklist séquentielle d'implémentation (1. Shell & Bottom Nav PWA ➔ 2. Dashboard & Refonte mobile des SVG ➔ 3. Formulaires KYC & Publication ➔ 4. Tiroir "Plus" & Micro-interactions tactiles).
3. Présente les variables CSS et breakpoints utilisés (ex: Mobile < 768px, Tablette 768-1024px, Desktop > 1024px).

Arrête-toi là et attends mon feu vert explicite avant de modifier ou créer le moindre fichier.