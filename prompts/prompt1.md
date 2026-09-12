Contexte & Rôle :

Nouvelle session de travail sur notre plateforme immobilière d'exception Habitoo (React / Vite / Vanilla CSS). Nous concevons le parcours d'onboarding PRO : le Tunnel d'inscription KYC multi-étapes (`/pro/inscription`) et l'Écran d'attente de validation 48h (`/pro/en-attente`).

Exigence Visuelle & "Facteur Waouw" :
Nous refusons catégoriquement les formulaires d'inscription génériques ou monotones (pas de simple succession de champs dans une boîte blanche centrée). Nous visons une expérience visuelle  
La composition doit être spectaculaire : asymétrie maîtrisée, typographie sculptée (Playfair Display pour les titres majestueux, Quicksand pour la rigueur des données), micro-interactions fluides, jeu de profondeurs (ombres subtiles multi-couches, bordures ultra-fines 1px, accents rouge signature Habitoo vibrants mais dosés avec parcimonie) et hiérarchie d'information limpide.

Consigne d'exécution :

Respecte impérativement le protocole pas-à-pas. Ne modifie et ne crée aucun fichier pour l'instant. Propose d'abord l'architecture des composants, le concept visuel du layout et le state management, puis attends mon accord explicite avant de générer le code.

Spécifications Produit & Direction Artistique

1. Architecture du Layout — Le Split-Screen Immersif (Desktop) & Expérience App (Mobile PWA) :
Ne pas faire un simple conteneur centré. Mettre en place un layout en deux volets sur grand écran :
- Volet Gauche (Hero Showcase immersif, ~40% de largeur) :
  • Fond sombre architectural ou teinté chaud avec texture minérale légère.
  • Présentation dynamique du "Pass PRO" : une carte interactive façon badge virtuel haut de gamme qui se met à jour en direct selon les choix de l'utilisateur (nom de l'agence, statut "Candidat PRO", ville d'exercice, badge en cours d'attribution).
  • Argumentaire visuel flottant : 3 micro-preuves de prestige (ex: « Vérification officielle par juriste », « Encaissement Mobile Money instantané », « Accès prioritaire marché fermé »).
- Volet Droit (Workspace & Formulaire Interactif, ~60% de largeur) :
  • Stepper ultra-moderne façon timeline chirurgicale (numéros stylisés, transitions d'états actives avec lueur subtile).
  • Espace de saisie aéré, composants UI sur mesure avec transitions d'étapes sans rechargement brutal.
- Sur Mobile : Transition élégante vers une expérience fluide plein écran avec bandeau supérieur rétractable et actions ancrées ergonomiquement au pouce.

2. Les 4 Étapes du Formulaire — Composants UI hors pair :

Étape 1 — Sélection de Profil (Visual Role Pickers) :
- Bannir les simples boutons radio. Proposer 2 grands blocs tactiles interactifs richement mis en page :
  • Démarcheur Indépendant : Iconographie fine, badge "Terrain & Agilité", texte d'impact sur la liberté et les commissions directes.
  • Agence Immobilière : Iconographie architecturale corporate, badge "Multi-collaborateurs & Flotte de biens", accent sur la puissance de diffusion.
  • Au survol et à la sélection : bordure signature fine rouge intense, subtile élévation et coche animée de validation.

Étape 2 — Données Pro & Dropzone KYC Haute Précision :
- Champs de formulaire flottants avec labels animés et focus micro-stylisé (pas de bordures épaisses ou grossières).
- Sélecteur de ville sous forme de chips interactives (Abidjan, Brazzaville, Kinshasa, Dakar, Autre) avant d'affiner le quartier.
- Dropzone KYC repensée comme un coffre-fort numérique :
  • Conteneur au design soigné avec icône d'empreinte/sécurité, mention de chiffrement bancaire et drag-and-drop interactif.
  • Dès qu'un fichier est déposé : animation de scan réussie avec aperçu miniature stylisé, jauge de poids et badge vert de conformité.

Étape 3 — Sélection de Forfait (Cartes Tarifaires Dynamiques) :
- Trois cartes aux finitions distinctes disposées avec un jeu de profondeur :
  • Starter (0 FCFA) : Finition épurée, sobre.
  • PRO (15 000 FCFA) : Surélevée, halo signature rouge, ruban "Recommandé pour se démarquer".
  • Premium (35 000 FCFA) : Finition noire intense avec reflets dorés/bronze pour l'aspect prestige.
- Toggle visuel ou sélecteur interactif qui actualise instantanément le badge sur le volet gauche.

Étape 4 — Règlement & Confirmation Mobile Money :

- pour ce step inspire toi de la logique de paiement de la partie reserve au particulier. il ya une route /checkout

3. Écran d'Attente 48h (/pro/en-attente) — Le "Credential Boarding Pass" :
Transformer ce qui est d'ordinaire une page d'attente ennuyeuse en une véritable consécration d'inscription :
- Composant central façon « Certificat d'adhésion en cours de certification » :
  • Aspect carte de membre prestige avec numéro de dossier unique stylisé (ex: `HAB-PRO-8492`).
  • Statut dynamique avec pulse lumineux ambre : « Dossier transmis au comité de validation ».
- Tracker de validation en 3 étapes interactives :
  • [Étape 1 - Validée ✅] Dossier & CNI déposés.
  • [Étape 2 - En cours d'audit ⏳] Contrôle de conformité et attribution du matricule PRO (engagement 24h-48h).
  • [Étape 3 - Prochaine 🚀] Envoi du SMS d'activation et ouverture du Dashboard.
- Section d'immersion immédiate ("Ne perdez pas une minute") :
  • Présentation du premier module vidéo teaser de l'Académie Habitoo (« Les 5 angles photo qui déclenchent une visite en 24h ») pour donner immédiatement de la valeur sans attendre la fin des 48h.
  • Bouton VIP d'accès direct WhatsApp avec un gestionnaire de compte Habitoo.

Directives Techniques & CSS Scoped :
- Découpage modulaire strict : `ProRegisterPage.jsx`, `StepPersona.jsx`, `StepKyc.jsx`, `StepPlans.jsx`, `StepCheckout.jsx`, `ProPendingPass.jsx`.
- Styles scoped dédiés (`ProOnboarding.module.css` ou préfixage rigoureux `.habitoo-reg-*`).
- Animations CSS subtiles (fade-in, transform translateY doux de 8px pour l'arrivée des étapes, zéro saccade).
- Performance et responsive irréprochables : aucune barre de défilement horizontale parasite, respect absolu des safe-areas mobiles et cibles tactiles confortables (min 48px).

Ce que tu dois faire maintenant :
1. Décris la structure UX du Split-Screen retenue et le mécanisme interactif de synchronisation entre les étapes et la carte "Pass PRO" virtuelle.
2. Présente le plan de découpage des composants et le modèle de données du formulaire.
3. Montre la palette de styles et de micro-détails (ombres, bordures, typographies) prévus pour garantir l'effet "waouw".

Arrête-toi là et attends mon accord explicite avant de générer ou modifier le moindre fichier de code.

