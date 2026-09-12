Contexte & Rôle :

Tu interviens sur notre prototype d'agence immobilière de standing (React / Vite / Vanilla CSS).  Nous devons restructurer la page de détails d'une annonce (PropertyDetail) et implémenter une page dédiée de passerelle de paiement multi-moyens (Checkout).

Applique scrupuleusement la règle de direction artistique définie dans rules.md : style architectural épuré, typographie sobre (Playfair Display pour les montants/titres, Quicksand pour les formulaires/labels), zéro effet glossy/dégradé IA, bordures ultra-fines et respiration par l'espace.

Consigne d'exécution :

Applique scrupuleusement notre protocole pas-à-pas et le skill vanilla-css-scoped. Ne modifie aucun fichier pour l'instant. Propose d'abord une checklist numérotée et attends ma validation avant de démarrer la première tâche.

Spécifications des modifications
1. Réagencement de la page Détails du bien :

Inversion des colonnes :

Colonne gauche : Module de réservation / paramétrage du séjour ou de l'acquisition.

Colonne droite : Informations détaillées du bien, description, équipements et profil de l'agent / propriétaire.

Comportement Sticky : Fixe le module de réservation de la colonne gauche (position: sticky; top: ...) pour qu'il reste visible tout au long du défilement de la page, sans casser le layout responsive sur mobile (où il repasse en flux standard ou barre basse).

Déclenchement : Le bouton principal « Réserver » ou « Poursuivre la transaction » redirige vers la route de paiement dédiée (ex: /checkout ou /reservation/paiement).

2. Nouvelle page de Passerelle de Paiement (Checkout Prototype) :

Sélection du moyen de paiement : Présente une sélection par onglets ou cartes radio sobres inspirée des vraies passerelles (Wave / Orange Money / Mobile Money local, Carte bancaire, PayPal).

Formulaires selon la méthode choisie :

Carte bancaire : Champs réalistes (Numéro de carte, Date d'expiration, CVC, Nom du titulaire).

Mobile Money : Champ de saisie du numéro de téléphone et sélection du fournisseur.

PayPal : Bouton direct d'authentification simulée.

Comportement prototype (Sans validation complexe) :

Pas de validation stricte de format ni de persistance en base de données.

Au clic sur le bouton de confirmation final, affichage immédiat d'un écran / encart de confirmation net et élégant : « Votre paiement a bien été pris en compte » avec un résumé succinct de la transaction et un bouton de retour à l'accueil.

Contraintes Techniques & Style

Layout CSS propre en Grid ou Flexbox avec gap sans décalage horizontal.

Aucun rechargement de page brutal ; intégration fluide dans l'arborescence React Router du projet.

Ce que tu dois faire maintenant :
Découpe cette implémentation en une checklist séquentielle de 4 tâches (Inversion & Sticky sur la page détails ➔ Structure et routage de la page Checkout ➔ Implémentation des 3 vues de paiement ➔ Écran de confirmation & test de fluidité).

Arrête-toi là et attends mon feu vert explicite avant d'écrire le code. 