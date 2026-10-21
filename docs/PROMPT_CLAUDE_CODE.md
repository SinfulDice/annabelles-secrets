# Prompt Claude Code — Projet React « Annabelle's Secrets »

> Copie tout ce qui suit dans Claude Code, à la racine du dépôt (vide ou presque).

---

## 1. Contexte

Tu développes **Annabelle's Secrets** (nom du site et de l'entreprise), une boutique en ligne fictive de bien-être intime (sex toys) avec trois univers : **Femme**, **Homme** et **Goodies** (produits dérivés de la marque). Le site a un ton décalé : de **fausses publicités parodiques** de sites de rencontre, un **mode SFW / NSFW**, une **newsletter** et un **compte** factices.

C'est un projet de cours individuel, noté sur le respect du cahier des charges, la qualité du code, l'interface et un oral où je devrai expliquer chaque hook et chaque choix. Le code doit donc rester **lisible, simple et explicable** : pas d'abstraction gratuite, pas de bibliothèque que je ne pourrais pas justifier.

Ressources dans le dépôt :

- `docs/projet-react.md` : le cahier des charges officiel. **Lis-le en entier avant de commencer**, il fait foi en cas de doute.
- `docs/*.pdf` : les maquettes de chaque écran (desktop + mobile). Respecte-les fidèlement (structure, couleurs, typographie, textes, états).
- `data/products.json` : le jeu de données (45 produits : 20 femme, 20 homme, 5 goodies) publié via DummyJSON Custom Response. C'est une **copie de sauvegarde** pour régénérer l'endpoint s'il expire (90 jours) : l'application ne doit **jamais l'importer**.
- `src/data/reviews.json` : banque de **500 avis** (`kind: "toy"` pour les ids 1–400, `kind: "goodies"` pour 401–500), importée statiquement par l'app (voir § 3, Avis clients).

**Délai : rendu dans 2 jours.** Priorité absolue au cahier des charges obligatoire (liste, recherche/filtres/pagination, fiche, favoris, création, états, accessibilité, lint/format, README). Les extras (pubs, SFW/NSFW, newsletter, compte, admin, thème sombre, CRUD complet) viennent ensuite, dans l'ordre du § 10. Si une étape prend trop de temps, dis-le-moi plutôt que de bâcler les obligatoires.

Écrans de la maquette → routes :

| Maquette | Route / emplacement |
| --- | --- |
| 01 Accueil | `/` |
| 02 Vérification d'âge | modale affichée par-dessus toute l'app tant que non confirmée |
| 03 Boutique + 04 États (chargement, erreur, vide, toasts) | `/produits` |
| 05 Fiche produit (+ 14 mobile) | `/produits/:id` |
| 06 Favoris (rempli + vide) | `/favoris` |
| 07 Création | `/produits/nouveau` |
| 08 Modification + suppression | `/produits/:id/modifier` (la suppression se lance aussi depuis la fiche) |
| 09 Fausses pubs | composants `AdBanner`, `AdSquare`, `AdPopup` (accueil, boutique, fiche) |
| 10 Newsletter | `/newsletter` |
| 11 Compte | `/compte` |
| 12 Mode NSFW | bascule SFW / NSFW dans l'en-tête, appliquée à toutes les images produits |
| 13 Boutique mobile, thème sombre | version mobile + dark de `/produits` |
| — | `*` → page 404 avec lien vers l'accueil |

## 2. Stack imposée

- **Vite + React + TypeScript** en mode `strict` (aucun `any`, aucun `@ts-ignore`).
- **Tailwind CSS v4** via `@tailwindcss/vite`. Déclare les design tokens dans `@theme` (voir § 8) et le dark mode par classe (`@custom-variant dark (&:where(.dark, .dark *));`).
- **React Router** (mode data : `createBrowserRouter` + `RouterProvider`).
- **fetch natif + hooks maison** pour les requêtes. Pas de TanStack Query, Redux ni Zustand : je dois pouvoir expliquer `useState`, `useEffect`, `useRef`, `useContext`, `useReducer` sur mon propre code.
- **ESLint** (flat config) : `typescript-eslint` (recommended-type-checked), `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-plugin-jsx-a11y`.
- **Prettier** + `prettier-plugin-tailwindcss` ; `eslint-config-prettier` pour éviter les conflits.
- Scripts `package.json` obligatoires : `dev`, `build`, `preview`, `lint`, `format`, `format:check`, `typecheck`. À la fin, `npm run lint`, `npm run format:check`, `npm run typecheck` et `npm run build` doivent passer **sans erreur ni warning**.
- Déploiement **Vercel** (bonus) : ajoute un `vercel.json` qui réécrit toutes les routes vers `index.html` pour que l'accès direct à une URL et le rechargement fonctionnent.

## 3. Données et API

### Lecture (GET)

- L'URL de l'endpoint Custom Response est lue depuis `import.meta.env.VITE_PRODUCTS_URL` (typer la variable dans `src/vite-env.d.ts`). Fournis un `.env.example` avec `VITE_PRODUCTS_URL=` suivi d'un commentaire indiquant d'y coller l'URL générée sur https://dummyjson.com/custom-response. Si la variable est absente, l'app affiche une erreur claire au lieu de planter.
- La réponse a la forme `{ products: Product[], total, skip, limit }`. Crée le type `Product` à partir de `data/products.json`, champs optionnels inclus : `batteryLife` et `noiseLevel` peuvent être `null`, `sizes` n'existe que pour certains goodies (`string[] | null`), `nsfwImages` contient les images du mode NSFW.
- `category` vaut `"femme"`, `"homme"` ou `"goodies"` ; l'affichage utilise « Femme », « Homme », « Goodies ».

### Recherche, filtres, pagination : côté client

L'endpoint Custom Response renvoie un JSON statique : il ne sait ni chercher, ni filtrer, ni paginer. On charge donc **une fois** les 45 produits, puis recherche + filtres + tri + pagination sont des **fonctions pures** appliquées sur la liste complète (jamais seulement sur la page visible). Ce choix est à expliquer dans le README.

- Recherche texte (insensible à la casse et aux accents) sur `title`, `brand`, `type`, `material`.
- Filtres : catégorie (Tous / Femme / Homme / Goodies), type de produit (liste déduite des données, dépendante de la catégorie choisie), prix maximum (Tous, ≤ 30 €, ≤ 50 €, ≤ 80 €, ≤ 120 €), case « Étanche uniquement ».
- Tri : mieux notés (défaut), prix croissant, prix décroissant, nouveautés (id décroissant).
- Pagination : 12 produits par page, boutons Précédent / numéros / Suivant, indication « Page X sur Y », bouton courant avec `aria-current="page"`.
- Tous les critères se cumulent (ET logique). **Toute modification d'un critère remet la page à 1** : c'est le reducer qui le garantit, pas les composants.
- Recherche automatique **debounce 300 ms** (bonus) via un hook `useDebouncedValue` basé sur `useEffect` + `setTimeout` + nettoyage.
- Chips « Filtres actifs » cliquables pour retirer un critère + bouton « Réinitialiser les filtres ».

### Écriture (POST / PUT / DELETE) : DummyJSON products

DummyJSON simule les écritures sans rien enregistrer. On utilise les endpoints produits officiels et on met à jour **l'état local** avec la réponse :

- Création : `POST https://dummyjson.com/products/add`, body JSON, header `Content-Type: application/json`. La réponse renvoie l'objet avec un nouvel `id` (195+).
- Modification : `PUT https://dummyjson.com/products/{id}`. Les ids 1 à 45 existent aussi chez DummyJSON, donc l'appel réussit ; mais la réponse contient leurs données à eux fusionnées avec ce qu'on envoie → n'utilise de la réponse que le statut et les champs envoyés.
- Suppression : `DELETE https://dummyjson.com/products/{id}` → réponse avec `isDeleted: true`.
- **Limite connue** : un produit créé localement (id ≥ 195) n'existe pas chez DummyJSON, PUT/DELETE renverraient 404. Pour ces produits (flag `isLocal: true`), applique la modification/suppression localement sans appel réseau. À documenter dans le README.
- Les créations, modifications et suppressions vivent dans un `ProductsContext` (liste chargée + overlay des mutations) et sont perdues au rechargement, comme le cahier des charges l'autorise. Une suppression retire aussi le produit des favoris.

### Avis clients (sélection déterministe)

`products.json` ne contient pas d'avis. Chaque fiche tire ses avis dans `src/data/reviews.json`, **toujours les mêmes pour un même id** (le produit 21 affiche les mêmes avis à chaque visite, sur chaque navigateur) :

- Fonction pure `getProductReviews(product, allReviews): Review[]` dans `src/utils/productReviews.ts`.
- Générateur pseudo-aléatoire **seedé par l'id** (`mulberry32(product.id)`, ~6 lignes, dans `src/utils/seededRandom.ts`) : jamais `Math.random()` ici.
- Pool : avis `kind: "goodies"` pour la catégorie goodies, `kind: "toy"` sinon.
- Nombre d'avis : entre 4 et 12, tiré avec le même générateur.
- Les notes suivent la note du produit : pour chaque avis, on tire une note autour de `product.rating` (par exemple 4,6 → surtout des 5 et des 4, parfois un 3), puis un avis de cette note pas encore choisi pour ce produit. Pas de doublon dans une même fiche.
- Tri par date décroissante ; la fiche affiche le nombre d'avis, la moyenne réelle des avis tirés à côté de la note produit, un filtre « Toutes / 5★ / 4★ / 3★ et moins » et un badge « Achat vérifié » (`verifiedPurchase`).
- Les cartes de la liste n'affichent que la note produit (pas de calcul d'avis dans la liste).
- Teste à la main que deux rechargements de `/produits/21` donnent exactement les mêmes avis.

### Gestion des requêtes

- Une seule fonction `httpRequest<T>()` dans `src/services/http.ts` : vérifie `response.ok`, lève une `HttpError` (status + message lisible en français), gère `AbortController`.
- Un hook `useProducts()` expose `{ status: 'idle' | 'loading' | 'success' | 'error', products, error, retry }`. Utilise une union discriminée pour l'état, pas trois booléens.
- Chaque requête annulable dans `useEffect` doit être annulée au démontage.

## 4. Fonctionnalités par écran

### En-tête (toutes les pages)
Logo « Annabelle's Secrets. », navigation (Accueil, Boutique, Femme, Homme, Goodies), puis : « Ajouter un produit » (**visible uniquement pour l'admin connecté**, voir Compte), Favoris avec compteur, Compte (initiales si connecté), bascule SFW / NSFW (pastille verte « SFW » ou rouge « NSFW »), bascule thème. Sur mobile, tout passe dans un menu burger sauf le logo et les favoris.

### Vérification d'âge
Modale bloquante (`role="dialog"`, `aria-modal`, focus piégé, focus initial sur « Entrer »). Choix mémorisé dans `localStorage`. « Quitter » redirige hors du site.

### Accueil
Hero, bandeau d'engagements, trois tuiles Femme / Homme / Goodies, une bannière de fausse pub, les 4 produits les mieux notés, une section « Les goodies de la maison » (les 5 goodies), un bloc « La lettre d'Annabelle » qui mène à `/newsletter`. Les tuiles mettent la catégorie dans le contexte des filtres puis naviguent vers `/produits`.

### Boutique
Formulaire de recherche stylisé avec label visible, filtres, tri, chips, bannière de fausse pub, compteur de résultats (`aria-live="polite"`), grille responsive de cartes, pagination. Chaque carte : image (`alt` pertinent), catégorie, type, nom (lien vers la fiche), prix, note, bouton favori (`aria-pressed`, `aria-label` explicite). Les goodies ont un visuel beige (`#EDE6DC`). États : skeleton + « Chargement des produits… » (`role="status"`), erreur avec « Réessayer », aucun résultat avec rappel des critères et réinitialisation.

### Fiche produit
« Retour aux résultats » (filtres et page conservés grâce au contexte), fil d'Ariane, galerie, catégorie, type, nom, marque, SKU, note + nombre d'avis, prix, prix barré et remise si `discountPercentage > 0`, disponibilité, description, favori, Modifier / Supprimer (**admin uniquement**), caractéristiques (matériau, dimensions, poids, étanchéité, autonomie, niveau sonore, garantie, expédition, retour ; « Tailles disponibles » pour les goodies qui ont `sizes`), avis clients, encart carré de fausse pub. Gère : chargement, produit introuvable et accès direct à l'URL.

### Favoris
- `FavoritesContext` persistant dans `localStorage` (`annabelle:favorites`), restauré au démarrage, **sans doublon** (dédupliqué par id).
- Stocke un instantané minimal (id, titre, type, catégorie, prix, note, thumbnail) pour afficher la page même si l'API est indisponible.
- Page : liste avec image, infos, « Voir la fiche », « Retirer », « Tout retirer ». État vide avec lien vers la boutique. Toast à l'ajout et au retrait (`role="status"`).

### Accès admin
- Un composant de route `RequireAdmin` protège `/produits/nouveau` et `/produits/:id/modifier` : si l'utilisateur n'est pas admin, il affiche l'écran « Réservé à l'administratrice » (maquette 11) avec un bouton « Se connecter » qui mène à `/compte` puis ramène à la page demandée après connexion.
- La suppression vérifie aussi le rôle avant d'appeler `DELETE`.
- C'est une protection d'interface uniquement (tout est côté client) : à mentionner dans les limites du README.

### Création
Formulaire **contrôlé** : nom*, catégorie* (Femme / Homme / Goodies), type*, marque, prix*, remise %, stock*, matériau, étanche, description*, URL d'image.
- Validation dans une fonction pure `validateProductForm(values): FormErrors` : obligatoires, prix nombre > 0 (accepte la virgule), remise 0–90, stock entier ≥ 0, description ≥ 20 caractères (compteur), URL commençant par `https://`.
- Erreurs sous chaque champ (`aria-invalid`, `aria-describedby`) + résumé en tête (`role="alert"`) qui reçoit le focus à la soumission ratée.
- Envoi : bouton désactivé, spinner, « Envoi en cours… », champs en lecture seule.
- Échec : message avec le code HTTP, **valeurs conservées**, « Réessayer l'envoi ».
- Succès : confirmation + récapitulatif construit à partir de la **réponse de l'API** (id inclus), « Voir la fiche » et « Créer un autre produit » ; le produit apparaît dans la boutique.
- Le même composant `ProductForm` sert à la création et à la modification.

### Modification et suppression (bonus CRUD)
Formulaire prérempli, `PUT`, mêmes états envoi / succès / erreur. Suppression avec modale de confirmation (`role="alertdialog"`, focus initial sur « Annuler », Échap ferme), `DELETE`, puis toast et redirection vers `/produits`.

### Fausses publicités
Parodie des pubs de sites adultes. **Aucun lien réel, aucune image** : texte uniquement, style jaune criard avec bordure rouge pointillée, étiquette « Pub » et mention « Publicité parodique ».
- Messages dans `src/constants/ads.ts` (titre, sous-titre, bouton, badge), avec les variables `{ville}` (ville française tirée au hasard dans une liste) et `{n}` (nombre entre 3 et 27). Liste de départ : « MILF près de chez vous », « Femmes hot dans ta région », « Célibataires matures à {n} km », « Couguars en manque d'aventure », « Ton voisin a déjà trouvé », « Papas célibataires à {ville} », « Vous êtes notre 1 000 000e visiteur ! », « Augmentez votre… confiance en vous » (sous-titres : voir maquette 09).
- Hook `useRandomAd(intervalMs = 8000)` : tire un message au hasard **différent du précédent** (index précédent gardé dans un `useRef`), le renouvelle avec `setInterval` dans un `useEffect` (nettoyé au démontage). Les variables sont résolues au tirage.
- Trois formats : `AdBanner` (accueil, boutique), `AdSquare` (fiche produit), `AdPopup` (une fois par session, 20 s après l'arrivée, fermeture possible après un compte à rebours de 3 s, mémorisé dans `sessionStorage`).
- Bouton « × » (`aria-label="Fermer la publicité"`) qui masque l'encart jusqu'au prochain rechargement. Un clic sur le bouton d'action affiche un toast « C'était une fausse pub ».
- Les pubs n'apparaissent jamais avant la vérification d'âge et ne sont pas annoncées en boucle aux lecteurs d'écran (pas d'`aria-live` sur la rotation).

### Mode SFW / NSFW
- `ContentModeContext` (`'sfw' | 'nsfw'`), persistant dans `localStorage` (`annabelle:content-mode`), **SFW par défaut**.
- Passage en NSFW uniquement après la vérification d'âge, avec une modale de confirmation (focus initial sur « Rester en SFW »).
- SFW : on affiche `thumbnail` / `images`. NSFW : on affiche `nsfwImages`, **floutées par défaut** (`blur` CSS + voile « Contenu adulte » + bouton « Afficher l'image ») ; « Masquer » les refloute, bouton « Tout afficher » dans le bandeau. Le `alt` reste descriptif et neutre dans les deux modes.
- Un composant unique `ProductImage` choisit la bonne source selon le mode : les autres composants ne connaissent pas le mode.
- Les goodies ont les mêmes images dans les deux modes.
- `nsfwImages` contient de vraies photos produits hébergées sur Unsplash (licence Unsplash), et `nsfwImageCredits` le nom de la marque et la page de chaque photo. En mode NSFW, affiche sous l'image « Photo : {photographer} sur Unsplash » avec un lien vers la page. Ajoute la liste des crédits au README (voir `docs/NSFW_IMAGES.md`).
- Si une image ne charge pas (`onError`), repli sur la `thumbnail` SFW.

### Newsletter (factice)
- `NewsletterContext` persistant dans `localStorage` (`annabelle:newsletter`) : liste d'abonnés `{ email, firstName, interests, frequency, subscribedAt }`.
- Inscription : prénom, e-mail* (format validé), centres d'intérêt (Femme, Homme, Goodies, Codes promo), fréquence (hebdo / mensuelle), case de consentement 18+ obligatoire. Si l'e-mail existe déjà, on met à jour les préférences et on l'indique.
- Désinscription : e-mail* + raison facultative ; message « Adresse introuvable » si absent ; bouton « Annuler et me réabonner ».
- Simule une latence réseau de 600 ms (`setTimeout` dans une `Promise`) pour montrer l'état d'envoi.
- Si l'utilisateur est connecté, l'e-mail est prérempli.

### Compte (factice)
- **Compte admin pré-créé** : au premier lancement, si `annabelle:accounts` n'existe pas, on y écrit le compte `{ firstName: "Annabelle", lastName: "Secrets", email: "admin@annabelles-secrets.fr", password: "P4ssw0rd", role: "admin" }` (valeurs dans `constants/admin.ts`). Il ne peut pas être supprimé depuis l'interface. Profil admin : avatar sombre « AS » avec étiquette jaune « ADMIN », mention « Propriétaire · admin », bouton « Ajouter un produit ».
- Les comptes créés par inscription ont `role: "customer"`. Stockage : une liste `annabelle:accounts` (admin + au plus un client par navigateur) et la session `annabelle:session` (e-mail connecté).
- `AccountContext` expose `currentUser`, `isAdmin`, `signUp`, `signIn`, `signOut`, `updateAccount`, `deleteAccount`. **Mot de passe stocké en clair**, volontairement : c'est une démo, à signaler comme limite (et faille) dans le README. Bandeau d'avertissement permanent : « N'utilisez jamais un vrai mot de passe ici ».
- Onglets accessibles (`role="tablist"`, flèches clavier) « Se connecter » / « Créer un compte ».
- Inscription : prénom*, nom, e-mail*, mot de passe* (8 caractères min. dont un chiffre, bouton Afficher / Masquer), confirmation*, date de naissance* (18 ans minimum), case « M'abonner aussi à la newsletter ». Un seul compte par navigateur.
- Connexion : compare e-mail + mot de passe avec le compte stocké ; message d'erreur générique en cas d'échec. Session dans `localStorage` (`annabelle:session`).
- Profil connecté : initiales, infos, mot de passe masqué avec bouton Afficher, statut newsletter, nombre de favoris, « Modifier mes informations », « Se déconnecter », « Supprimer mon compte » (avec confirmation, efface les clés du compte).
- Facultatif, si le temps le permet : envoyer aussi un `POST https://dummyjson.com/users/add` à l'inscription pour simuler un serveur.

### Thème sombre (bonus)
`ThemeContext` partagé, valeur dans `localStorage` (`annabelle:theme`), restaurée à l'ouverture ; par défaut `prefers-color-scheme`. Applique la classe `dark` sur `<html>`. Palette sombre : voir maquette 13.

## 5. Architecture attendue

```
src/
  app/            router.tsx, providers.tsx (empile les contextes), App.tsx
  pages/          HomePage, ProductsPage, ProductDetailPage, FavoritesPage,
                  ProductCreatePage, ProductEditPage, NewsletterPage, AccountPage, NotFoundPage
  components/
    layout/       Header, MobileMenu, Footer, Layout, AgeGate
    products/     ProductCard, ProductGrid, ProductImage, ProductGallery, ProductSpecs,
                  ProductReviews, ProductForm, SearchForm, FilterChips, Pagination,
                  DeleteProductDialog
    ads/          AdBanner, AdSquare, AdPopup
    content-mode/ ContentModeToggle, NsfwConfirmDialog, NsfwNotice
    newsletter/   SubscribeForm, UnsubscribeForm
    account/      AuthTabs, SignUpForm, SignInForm, ProfileCard
    ui/           Button, IconButton, Input, Select, Checkbox, Field, Badge, Spinner,
                  Skeleton, EmptyState, ErrorState, Toast, Modal, Tabs
  contexts/       FiltersContext, FavoritesContext, ProductsContext, ThemeContext, ToastContext,
                  ContentModeContext, NewsletterContext, AccountContext
  hooks/          useProducts, useProduct, useDebouncedValue, useLocalStorage, useFocusTrap,
                  useRandomAd
  services/       http.ts, productsApi.ts
  routes/         RequireAdmin.tsx
  data/           reviews.json
  utils/          filterProducts.ts, paginate.ts, formatPrice.ts, normalizeText.ts,
                  validateProductForm.ts, validateAccountForm.ts, fillAdTemplate.ts, delay.ts,
                  seededRandom.ts, productReviews.ts
  types/          product.ts, filters.ts, account.ts, newsletter.ts, ad.ts
  constants/      config.ts (PAGE_SIZE, DEBOUNCE_MS, AD_INTERVAL_MS, STORAGE_KEYS, API_URLS,
                  PRICE_OPTIONS…), ads.ts, cities.ts
```

Chaque contexte expose un hook (`useFilters()`, `useFavorites()`, `useAccount()`…) qui lève une erreur explicite s'il est utilisé hors de son Provider. Les reducers sont des fonctions pures exportées séparément. Toutes les clés `localStorage` sont préfixées `annabelle:` et centralisées dans `STORAGE_KEYS`.

## 6. Règles de clean code (à respecter partout)

- Noms explicites et intentionnels ; code et identifiants en **anglais**, textes d'interface en **français**.
- Une responsabilité par fichier et par fonction ; composants courts (≈ 150 lignes max), logique extraite dans des hooks ou des utilitaires purs.
- Pas de nombres ni de chaînes magiques : tout va dans `constants/`.
- Retours anticipés plutôt que conditions imbriquées ; pas de ternaires imbriqués dans le JSX.
- Pas de code mort, pas de `console.log`, pas de commentaires qui paraphrasent le code (seulement le « pourquoi » quand il n'est pas évident).
- Props typées avec des `type`, pas de props « fourre-tout » ; composants d'UI sans connaissance du métier.
- `useEffect` uniquement pour synchroniser avec l'extérieur (réseau, `localStorage`, timers, DOM), jamais pour dériver un état : les listes filtrées/paginées sont calculées pendant le rendu (`useMemo` seulement si justifié).
- Clés de liste stables (id), jamais l'index.
- Formatage des prix via `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })`.

## 7. Accessibilité et responsive

- Tous les champs ont un `<label>` associé ; groupes de radios et cases dans `<fieldset>` + `<legend>`.
- Focus visible partout (`focus-visible:outline-3 outline-offset-2` couleur `#24476B` / `#8FB4DE` en sombre), navigation complète au clavier, lien d'évitement « Aller au contenu ».
- Boutons icônes avec `aria-label` ; SVG décoratifs en `aria-hidden`.
- Contraste ≥ 4.5:1 en clair comme en sombre (y compris les pubs jaunes).
- Mobile-first, aucun débordement horizontal de 320 px à 1440 px : menu burger, filtres secondaires repliés derrière « Plus de filtres », grille 2 colonnes, barre d'action favori collante sur la fiche (maquettes 13 et 14).
- Titre de page (`document.title`) mis à jour à chaque route, au format « Page – Annabelle's Secrets ».

## 8. Design system (issu de la maquette)

- Polices : **Space Grotesk** (titres, 500–700), **Inter** (texte, 400–700), **JetBrains Mono** (aperçu `localStorage` de la page compte), via Google Fonts.
- Clair : fond `#F6F2EF`, surface `#FFFFFF`, texte `#1D1820`, texte secondaire `#5E5662`, bordure `#E4DCD8`, champ `#CFC4BF`.
- Accent Femme / primaire : `#8A2846` (hover `#6B1C35`, fond doux `#F3E3E8`) ; accent Homme : `#24476B` (fond doux `#E1E9F2`) ; Goodies : fond `#EDE6DC`, texte `#5C4A38`.
- États : succès `#2E6B4A` (fond `#E3F1E8`), erreur `#A3242B` (fond `#F7E1E2`), avertissement fond `#FFF4D6` texte `#5A4300`.
- Fausses pubs : fond `#FFE14D`, bordure 3 px pointillée `#D7261E`, titre `#B0141B`, bouton `#D7261E` texte blanc.
- Mode NSFW : pastille et bouton `#A3242B`, fond d'image `#2A2027`.
- Sombre : fond `#141017`, surface `#1F1A23`, texte `#F2ECEF`, secondaire `#B5AAB2`, bordure `#3A3140`, accent `#E58FA9`, accent Homme `#8FB4DE`.
- Rayons : boutons pilule, cartes 20 px, panneaux 24 px, champs 14 px. Cibles tactiles ≥ 44 px.

## 9. README.md (livrable noté)

Rédige-le en français. Tout en haut, un encadré **« Tester l'accès admin »** : e-mail `admin@annabelles-secrets.fr`, mot de passe `P4ssw0rd`, et ce que ce compte débloque (ajout, modification, suppression de produits). Puis : sujet et API (Custom Response + endpoints produits DummyJSON), prérequis (version de Node), installation et lancement, configuration (`VITE_PRODUCTS_URL`, comment régénérer l'endpoint à partir de `data/products.json`, comment remplacer les `nsfwImages`), choix techniques justifiés (filtrage côté client, rôle de chaque contexte, pas de TanStack, structure), bibliothèques utilisées, fonctionnalités et bonus réalisés (y compris pubs, SFW/NSFW, newsletter, compte, goodies), limites connues (endpoint qui expire après 90 jours, mutations non persistées, produits créés non modifiables côté API, newsletter et compte uniquement locaux, **mot de passe en clair dans le navigateur : faille volontaire de démo, à ne jamais reproduire en production**, pas de paiement), usage de l'IA (maquettes et code générés avec Claude / Claude Code, relus et compris par moi), lien Vercel (placeholder à compléter).

## 10. Méthode de travail

1. Lis `docs/projet-react.md` et les PDF de `docs/`, puis propose un plan en étapes et attends ma validation.
2. Étape par étape, en deux blocs (le premier doit être fini et commité avant de toucher au second) :
   - **Bloc obligatoire** : initialisation + outillage (lint/format/typecheck verts) → types, services, utilitaires purs → contextes → layout et routing → Boutique → Fiche (avec avis déterministes) → Favoris → Création → responsive et accessibilité → README de base → déploiement Vercel.
   - **Bloc extras** : compte + admin pré-créé + `RequireAdmin` → modification/suppression → fausses pubs → mode SFW/NSFW → newsletter → thème sombre → README final.
3. Après chaque étape : lance `npm run lint && npm run format:check && npm run typecheck && npm run build`, corrige tout, puis fais un commit clair (Conventional Commits).
4. Pour chaque hook React utilisé, ajoute dans `docs/ORAL.md` une explication courte : où il est utilisé, pourquoi, et ce qui se passerait sans lui (en particulier `useRef` dans `useRandomAd` et le nettoyage du `setInterval`). Liste aussi les questions probables du prof (choix côté client, rôle de chaque contexte, debounce, gestion d'erreurs, pourquoi le mot de passe en clair est une faille) avec une réponse.
5. Ne t'écarte pas de la maquette sans me demander ; en cas d'ambiguïté du cahier des charges, pose la question.
