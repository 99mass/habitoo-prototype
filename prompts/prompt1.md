Contexte & Rôle :

Nouvelle session de travail sur notre prototype d'agence immobilière de prestige (React / Vite / Vanilla CSS). Nous entamons l'étape finale d'audit et d'adaptation mobile en adoptant les codes ergonomiques d'une Web App Progressive (PWA) haut de gamme.

Applique scrupuleusement les règles de rules.md ainsi que les skills vanilla-css-scoped et browser-visual-audit : design architectural épuré, zéro effet gadget IA, polices respectées (Playfair Display pour les titres et Quicksand pour le corps de texte).

Consigne d'exécution :

Respecte impérativement le protocole pas-à-pas. Ne modifie aucun fichier pour l'instant. Propose d'abord une checklist ordonnée par page/vue et attends mon accord avant de traiter la première.

Spécifications du Design PWA & Ergonomie Mobile (375px - 428px)
1. Standards PWA Mobile :

Navigation basse (Bottom Navigation Bar) : Barre d'onglets fixe en bas d'écran (position: fixed; bottom: 0), ultra-fine et épurée (Accueil, Explorer/Recherche, Publier, Favoris/Profil) avec icônes sobres.

Zones de sécurité (Safe Areas) : Prise en compte des marges physiques mobiles (padding-bottom: env(safe-area-inset-bottom)).

Comportement tactile : Cibles tactiles d'au moins 44x44px pour les boutons et filtres, sans effet de zoom intempestif sur les formulaires.

2. Audit des Débordements (Anti-Overflow) :

Élimination stricte de tout défilement horizontal parasite (overflow-x: hidden au niveau racine et vérification des largeurs fixes width: 100vw ou conteneurs non contraints).

Adaptation des grilles en colonnes simples (1fr) et fluidité des conteneurs d'images avec ratio préservé.

3. Protocole d'Audit Visuel Page par Page :
Pour chaque vue de l'application (Accueil, Annonces, Détail du bien, Publication, Checkout, À Propos) :

Prendre une capture d'écran mobile via le navigateur headless/intégré.

Analyser le rendu : alignements des cartes, lisibilité des typographies, absence de texte tronqué ou d'icône décalée.

Corriger immédiatement les anomalies de style avant de passer à la vue suivante.

Ce que tu dois faire maintenant :
Analyse la structure globale actuelle et liste les composants transversaux à introduire (ex: barre de navigation basse mobile).

Découpe cet audit en une checklist séquentielle ordonnée page par page (Composants globaux PWA ➔ Homepage ➔ Liste & Détail du bien ➔ Page Publication ➔ Checkout & À Propos).

Arrête-toi là et attends mon feu vert explicite avant de modifier le moindre fichier.