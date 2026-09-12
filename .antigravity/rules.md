# Directives Globales de Développement — Prototype React (Vite)

## 1. Stack Technique & Périmètre
- **Framework & Outil :** React avec Vite (`.jsx`).
- **Langage :** JavaScript moderne (ES6+), sans TypeScript.
- **Styling :** Vanilla CSS exclusivement (`.css`).
  - Interdiction stricte d'installer ou d'injecter des bibliothèques externes (Tailwind, Bootstrap, Styled-components).
 
- **Architecture des dossiers :**
  - Composants réutilisables : `src/components/`
  - Vues et écrans : `src/pages/`
  - Contextes & State global : `src/context/`
  - Styles globaux : `src/index.css`


---

## 2. Protocole d'Exécution & Autonomie (Plan d'abord)
Tu ne dois **JAMAIS** modifier ou créer de fichiers directement lors de ta première réponse. Tu dois obligatoirement suivre ce flux de travail en 2 étapes :

1. **Phase de cadrage (Attente de validation) :**
   - Inspecte d'abord les fichiers existants concernés avant toute proposition.
   - Fournis un plan succinct contenant :
     - Les fichiers exacts à créer ou modifier.
     - Les classes CSS nécessaires (en vérifiant qu'elles n'existent pas déjà).
     - La logique d'état impactée (Context ou état local).
   - **Termine ta réponse en demandant explicitement ma validation avant d'appliquer les changements.**

2. **Phase d'implémentation (Après confirmation uniquement) :**
   - N'applique que les modifications validées.
   - Ne réécris pas des fichiers entiers si seules quelques lignes changent ; cible précisément les zones modifiées.

---

## 3. Rendu Visuel & Cohérence CSS
- **Anti-redondance CSS :** Avant d'écrire une règle CSS, vérifie si une classe utilitaire ou générique existe déjà dans les fichiers CSS globaux. Ne duplique pas des sélecteurs identiques avec des noms différents.
- **Cohérence des tokens :** Si des variables CSS (`--primary-color`, `--spacing-md`, etc.) sont déclarées dans `:root`, utilise-les systématiquement au lieu de valeurs hexadécimales ou de pixels bruts.
- **Sélecteurs propres :** Nomme les classes de manière claire et scoped (ex: BEM ou préfixe du composant : `.card-header`, `.card-body`) pour éviter les conflits de style globaux non intentionnels.
- **Vérification responsive :** Assure-toi que la mise en page utilise flexbox/grid sans causer de débordement horizontal (`overflow-x`).

---

## 4. Architecture React & Context API
- **Source unique de vérité :** Ce projet est un prototype
  - Ne crée pas d'états locaux dupliquant une donnée déjà présente dans le Context.
  - Ne crée pas de mock data directement dans la vue si un contexte existe déjà pour ce domaine de données.
- **Structure des composants :**
  - Modularité : un composant ne doit avoir qu'une seule responsabilité.
  - Tout composant visuel répété plus de deux fois doit être factorisé dans `src/components/`.

---

## 5. Règles Anti-Hallucination
- Ne présume jamais de l'API d'un hook ou des props d'un composant existant : lis le fichier source avant de l'appeler.
- Ne supprime jamais de code ou de commentaires existants sous prétexte de simplification, sauf demande explicite.
- Après chaque modification, vérifie que le serveur de développement Vite ne remonte pas d'erreur d'import ou de syntaxe.

## 6. Inspection visuelle et navigateur :
   - Ouvre l'URL locale correspondante (ex: `http://localhost:5173/` ou la route spécifique du composant).
   - Prends une capture d'écran de la zone modifiée à deux résolutions :
     - Desktop : 1440x900
     - Mobile : 375x812
   - Inspecte l'image pour vérifier :
     - Pas de débordement horizontal (`overflow-x`).
     - Les ratios des images (pas d'images écrasées ou étirées).
     - L'alignement des éléments (flex/grid, espacements cohérents).

## 7 Vérification console :
   - Récupère les logs de la console du navigateur.
   - S'il y a la moindre erreur (`404` sur une image, warning de clé React `key`, erreur JS), corrige-la immédiatement avant de me répondre.

## 8. Rapport d'auto-évaluation :
   - Résume succinctement ce que tu as vérifié visuellement et confirme l'absence d'erreurs console.

### 9. Bannissement du look "AI-Generated" (Interdictions formelles)
- **Zéro dégradés fluo/futuristes :** Interdiction d'utiliser des dégradés violet/bleu/rose, des halos lumineux (glow effects) ou des fonds "cyber/tech".
- **Zéro fausse complexité :** Pas de bordures irisées, d'effets néon, de cartes semi-transparentes floutées à l'excès (abus de `backdrop-filter: blur()`) ou d'ombres multicolores.
- **Zéro micro-animations gadget :** Pas d'éléments qui flottent au scroll, pas d'effets de cartes qui basculent en 3D (`perspective`), pas d'icônes animées en continu.
- **Typographie et titres naturels :** Ne génère jamais de titres marketing impersonnels façon IA (ex: *"Découvrez le futur de l'immobilier"*, *"Une expérience immersive sans précédent"*). Reste factuel, sobre et ancré dans le métier (ex: *"Sélection de biens d'exception"*, *"Gestion et investissement privé"*).
- **Ne pas utiliser d'émoticones**

### 10. Standards du look "Premium & Épuré"
- **Palette de couleurs restreinte & minérale :**
  - Fond neutre et reposant (blanc cassé, ivoire, beige très subtil ou gris perle, ex: `#FAFAFA`, `#F5F5F7` au lieu d'un blanc pur criard `#FFF` partout).
  - Couleurs d'accent sobres : noir d'encre profond (`#111111`, `#1A1A1A`), bronze/taupe discret ou vert forêt sourd. Maximum 2 couleurs principales.

- **Rigueur typographique :**
  - Hiérarchie claire : titres avec un fort contraste de taille (ex: grands titres très lisibles, sans gras excessif) et paragraphes courts en gris anthracite (`#4A4A4A` ou `#555555`) pour adoucir la lecture.
  - `letter-spacing` subtil sur les sous-titres ou tags en majuscules (ex: `letter-spacing: 0.05em; font-size: 0.75rem; text-transform: uppercase;`).
- **Composants aux lignes franches :**
  - Arrondis légers et discrets (`border-radius: 4px` à `8px` maximum). Bannis les arrondis excessifs (`border-radius: 24px` ou `9999px` sur les cartes).
  - Ombres imperceptibles ou absentes : privilégie des bordures ultra-fines (`1px solid rgba(0, 0, 0, 0.08)`) plutôt que des ombres portées épaisses.