# Arborescence du projet

À quoi sert chaque dossier et chaque fichier, et comment ils sont reliés.
Pour les hooks et les questions de l'oral, voir `docs/ORAL.md`. Pour les règles (`R12`…), voir `SPEC.md`.

---

## 1. Vue d'ensemble

```
projet-b3-front-end/
├── index.html            ← la seule page HTML ; React s'y installe dans <div id="root">
├── src/                  ← TOUT le code de l'application (TypeScript + React)
├── public/               ← fichiers copiés tels quels (favicons)
├── data/                 ← copie de sauvegarde des 45 produits (jamais importée)
├── docs/                 ← cahier des charges, maquettes, préparation de l'oral
│
├── package.json          ← dépendances + commandes npm (dev, build, test…)
├── package-lock.json     ← versions exactes installées (généré par npm)
├── vite.config.ts        ← config de Vite (plugins React + Tailwind) et de Vitest
├── tsconfig*.json        ← config de TypeScript (3 fichiers, voir §6)
├── eslint.config.js      ← règles du linter (ESLint)
├── .prettierrc.json      ← règles de mise en forme (Prettier)
├── .prettierignore       ← dossiers que Prettier ne touche pas
├── vercel.json           ← config de l'hébergement Vercel
├── .env.example          ← modèle du fichier .env (variables d'environnement)
├── .gitignore            ← ce que Git ne doit jamais enregistrer
├── README.md             ← présentation du projet, installation, limites
└── SPEC.md               ← les règles numérotées (R1, R2…), source de vérité
│
├── .env                  ← (pas sur GitHub) l'URL réelle de l'API
├── node_modules/         ← (pas sur GitHub) les bibliothèques installées par npm
└── dist/                 ← (pas sur GitHub) le site compilé par `npm run build`
```

Les trois derniers sont dans `.gitignore` : ils sont **générés** ou **secrets**, donc jamais envoyés sur GitHub.

---

## 2. Comment l'application démarre

Dans l'ordre :

```
index.html
  └─ <script src="/src/main.tsx">
       main.tsx            crée la racine React dans #root et affiche <App />
         └─ app/App.tsx    met les contextes autour du routeur
              ├─ app/providers.tsx   tous les contextes (thème, favoris, compte…)
              └─ app/router.tsx      quelle URL affiche quelle page
                   └─ components/layout/Layout.tsx   en-tête + pied de page communs
                        └─ <Outlet />  ← ici s'affiche la page de l'URL actuelle (pages/…)
```

- `index.html` contient aussi un petit script qui applique le thème sombre **avant** React,
  pour éviter un flash blanc au chargement.
- `providers.tsx` est **au-dessus** du routeur : les favoris, les filtres, etc. ne sont donc pas
  remis à zéro quand on change de page.

---

## 3. Le dossier `src/`, rangé par rôle

Chaque dossier a **un seul rôle**. C'est ce qui permet de retrouver un fichier sans chercher.

```
src/
├── main.tsx          point d'entrée (voir §2)
├── index.css         Tailwind + les couleurs/polices des maquettes (@theme) + mode sombre
├── vite-env.d.ts     dit à TypeScript que import.meta.env.VITE_PRODUCTS_URL existe
│
├── app/              assemblage de l'appli : App, providers, router
├── pages/            une page = une route (une URL)
├── routes/           protections de routes (RequireAdmin)
├── components/       les morceaux d'interface, rangés par thème
├── contexts/         les données partagées entre plusieurs pages
├── hooks/            hooks maison (logique React réutilisable)
├── services/         les appels réseau (fetch) et les données livrées avec l'appli
├── utils/            fonctions pures (calculs, validation, formatage) + leurs tests
├── constants/        valeurs fixes (URLs, clés localStorage, textes, réglages)
├── types/            les types TypeScript (Product, Review…)
├── data/             reviews.json : les 500 avis clients
└── test/             petites fabriques de données pour les tests
```

### `app/`

| Fichier | Rôle |
| --- | --- |
| `App.tsx` | Composant racine : `<AppProviders>` autour du `<RouterProvider>`. |
| `providers.tsx` | Empile les 10 contextes. **L'ordre compte** : un contexte ne peut utiliser que ceux placés au-dessus de lui (ex. les favoris affichent des toasts, donc `FavoritesProvider` est sous `ToastProvider`). |
| `router.tsx` | La table des URLs : `/`, `/produits`, `/produits/:id`, `/produits/nouveau`, `/favoris`, `/compte`, `/newsletter`, et `*` (page 404). |

### `pages/`

Une page par URL. Une page **assemble** des composants ; elle contient peu de logique elle-même.

| Fichier | URL |
| --- | --- |
| `HomePage.tsx` | `/` |
| `ProductsPage.tsx` | `/produits` (liste, recherche, filtres, pagination) |
| `ProductDetailRoute.tsx` | `/produits/:id` : charge `ProductDetailPage` **à la demande** (`lazy`, voir §7) |
| `ProductDetailPage.tsx` | la fiche produit elle-même |
| `ProductCreatePage.tsx` | `/produits/nouveau` (admin) |
| `ProductEditPage.tsx` | `/produits/:id/modifier` (admin) |
| `FavoritesPage.tsx` | `/favoris` |
| `AccountPage.tsx` | `/compte` |
| `NewsletterPage.tsx` | `/newsletter` |
| `NotFoundPage.tsx` | toute autre URL |

### `routes/`

`RequireAdmin.tsx` entoure les pages admin dans `router.tsx` : si on n'est pas admin, il affiche
« Réservé à l'administratrice » à la place de la page. Ça **cache** l'interface, ce n'est pas une
vraie sécurité (tout tourne dans le navigateur).

### `components/`

Rangés par **thème** (la partie du site où ils servent) :

| Sous-dossier | Contenu |
| --- | --- |
| `layout/` | Le cadre commun : `Layout`, `Header`, `Footer`, `MainNav`, `MobileMenu`, `Logo`, `ThemeToggle`, `AgeGate` (« As-tu 18 ans ? »)… |
| `home/` | Les blocs de la page d'accueil : `HeroSection`, `UniverseTiles`, `ProductShowcase`… |
| `products/` | Tout ce qui touche aux produits : cartes, grille, recherche, filtres, pagination, galerie, avis, formulaire, favoris… |
| `account/` | Connexion, inscription, profil client et admin. |
| `ads/` | Les fausses pubs (bannière, carré, pop-up) et la blague quand on clique dessus. |
| `newsletter/` | Formulaires d'inscription et de désinscription. |
| `content-mode/` | Le bouton SFW / NSFW et sa fenêtre de confirmation. |
| `ui/` | Les briques **génériques**, sans lien avec le thème du site : `Modal`, `Tabs`, `Select`, `TextField`, `Spinner`, `Toast`, `Stars`, les icônes… On pourrait les réutiliser dans un autre projet. |

Les fichiers `.ts` (et pas `.tsx`) comme `buttonClasses.ts` ou `categoryStyles.ts` ne contiennent
pas de JSX : seulement des classes Tailwind partagées.

### `contexts/`

Un contexte = une donnée que **plusieurs composants éloignés** doivent lire, sans la passer de
parent en enfant à la main (*prop drilling*). Chaque fichier contient le `Provider` et un hook
pour le lire (ex. `useProductsContext()`).

| Fichier | Ce qu'il partage |
| --- | --- |
| `ProductsContext.tsx` | Les 45 produits chargés + les ajouts/modifs/suppressions de la session |
| `FiltersContext.tsx` + `filtersReducer.ts` | Recherche, catégorie, prix, tri, page. Le reducer est à part pour être testé seul. |
| `FavoritesContext.tsx` | La liste des favoris (sauvegardée dans `localStorage`) |
| `AccountContext.tsx` | Comptes et session (qui est connecté, est-ce l'admin ?) |
| `AgeGateContext.tsx` | L'âge a-t-il été confirmé ? |
| `ContentModeContext.tsx` | Mode SFW ou NSFW |
| `ThemeContext.tsx` | Thème clair ou sombre |
| `AdsContext.tsx` | Quelle pub est ouverte |
| `NewsletterContext.tsx` | Inscrit ou non |
| `ToastContext.tsx` | Les petits messages de confirmation en bas de l'écran |

### `hooks/`

Les hooks maison (leur nom commence toujours par `use`). Ils regroupent de la **logique React**
(état, effets) pour la sortir des composants.

- Réseau : `useProducts` (charger la liste), `useCreateProduct`, `useEditProduct`, `useDeleteProduct`.
- Navigateur : `useLocalStorage`, `usePageTitle` (titre de l'onglet), `useFocusTrap` (garder le
  clavier dans une fenêtre).
- Divers : `useDebouncedValue` (attendre que l'utilisateur arrête de taper), `useSearchText`,
  `useSelectCategory`, `useRandomAd`.

### `services/`

La couche qui parle au **monde extérieur**.

| Fichier | Rôle |
| --- | --- |
| `http.ts` | Le **seul** endroit qui appelle `fetch`. Vérifie `response.ok` et transforme les échecs en `HttpError` avec un message en français. |
| `productsApi.ts` | Une fonction par requête : `fetchProducts` (GET), `createProduct` (POST), `updateProduct` (PUT), `deleteProduct` (DELETE). Toutes passent par `httpRequest`. |
| `reviews.ts` | Importe les 500 avis de `src/data/reviews.json` (livrés avec l'appli, pas de requête). |

### `utils/`

Des **fonctions pures** : même entrée → même sortie, sans React, sans réseau, sans `localStorage`.
C'est pour ça qu'elles sont faciles à tester. Chaque fichier a son test à côté :
`formatPrice.ts` ↔ `formatPrice.test.ts`.

Exemples : `filterProducts` (recherche + filtres + tri), `paginate`, `validateProductForm`,
`validateAccountForm`, `formatPrice`, `formatDate`, `normalizeText` (enlever les accents pour la
recherche), `productMutations` (le reducer des ajouts/modifs/suppressions), `seededRandom`
(un hasard **reproductible** pour répartir les avis toujours de la même façon).

### `constants/`

Les valeurs fixes, pour ne pas les répéter partout :
`config.ts` (URLs de l'API, clés `localStorage` dans `STORAGE_KEYS`, taille de page, délais…),
`navigation.ts` (liens du menu), `ads.ts` (textes des pubs), `admin.ts` (compte admin de démo),
`cities.ts`, `home.ts`.

### `types/`

Les types TypeScript, un fichier par sujet (`product.ts`, `review.ts`, `account.ts`…).
`index.ts` les réexporte tous : on écrit `import type { Product } from '../types'` sans connaître
le fichier exact.

### `test/`

`makeProduct.ts` et `makeFormValues.ts` fabriquent des données de test complètes. Un test ne
précise que ce qui l'intéresse : `makeProduct({ price: 10 })`.

---

## 4. Qui a le droit d'importer qui

Le code va toujours du « haut » (l'écran) vers le « bas » (les calculs), jamais l'inverse :

```
pages/  →  components/  →  contexts/  →  hooks/  →  services/  →  (réseau)
                │               │            │
                └───────────────┴────────────┴──→  utils/, constants/, types/
```

- `utils/`, `constants/` et `types/` n'importent rien de React : n'importe qui peut les utiliser.
- Un composant `ui/` ne connaît pas les produits : il reçoit tout par ses props.
- Seul `http.ts` appelle `fetch`. Si l'API change, on ne modifie qu'un endroit.

### Exemple : le chemin des produits, de l'API à l'écran

```
DummyJSON (URL dans .env)
  → services/http.ts           httpRequest : fetch + gestion des erreurs
  → services/productsApi.ts    fetchProducts
  → hooks/useProducts.ts       état « loading / success / error », bouton Réessayer
  → contexts/ProductsContext   partage la liste + applique les ajouts/modifs de la session
  → pages/ProductsPage.tsx     lit le contexte et les filtres
  → utils/filterProducts.ts    garde les bons produits, dans le bon ordre
  → components/products/ProductGrid → ProductCard   affiche
```

---

## 5. Les données : où sont-elles ?

| Fichier | Utilisé par l'appli ? | Rôle |
| --- | --- | --- |
| `.env` → `VITE_PRODUCTS_URL` | **Oui** | L'adresse d'où l'appli télécharge les 45 produits. |
| `data/products.json` | Non | Copie de sauvegarde : on la recolle sur DummyJSON quand l'URL expire (90 jours). |
| `src/data/reviews.json` | **Oui** | Les 500 avis, intégrés au fichier JS au moment du build. |
| `docs/products.json`, `docs/reviews.json` | Non | Les fichiers fournis au départ avec le prompt. Ils sont **identiques** à `data/products.json` et `src/data/reviews.json`. |

`.env.example` est le **modèle** de `.env` : il est sur GitHub et montre quelle variable remplir,
sans sa vraie valeur. Le préfixe `VITE_` est obligatoire : Vite ne donne au code du navigateur que
les variables qui commencent par `VITE_`.

---

## 6. Les fichiers de configuration

| Fichier | Rôle |
| --- | --- |
| `package.json` | Nom du projet, bibliothèques (`dependencies` : React, React Router ; `devDependencies` : outils utilisés seulement pendant le développement) et commandes (`npm run dev`, `build`, `test`, `lint`, `format`, `typecheck`). |
| `vite.config.ts` | Active les plugins React et Tailwind ; dit à Vitest de lancer les `src/**/*.test.ts`. |
| `tsconfig.json` | Ne fait que pointer vers les deux autres. |
| `tsconfig.app.json` | Règles TypeScript pour le code du **navigateur** (`src/`), en mode `strict`. |
| `tsconfig.node.json` | Règles pour les fichiers qui tournent dans **Node** (comme `vite.config.ts`). |
| `eslint.config.js` | Le linter : il repère les erreurs probables (règles des hooks, accessibilité avec `jsx-a11y`…). |
| `.prettierrc.json` | La mise en forme : pas de `;`, guillemets simples, 100 caractères par ligne, et tri automatique des classes Tailwind. |
| `vercel.json` | Renvoie toutes les URLs vers `index.html`. Sans ça, recharger `/produits/3` donnerait une erreur 404 chez Vercel, car ce fichier n'existe pas sur le serveur : c'est React Router qui gère l'URL dans le navigateur. |

---

## 7. Les dossiers générés (à ne pas modifier)

- **`node_modules/`** : créé par `npm install` à partir de `package.json`. Très lourd, recréable :
  jamais sur GitHub.
- **`dist/`** : créé par `npm run build`. C'est la version finale envoyée sur Vercel : du JavaScript
  minifié (illisible, mais léger). Vite le vide et le recrée à chaque build.
  - `assets/index-<hash>.js` : toute l'appli.
  - `assets/ProductDetailPage-<hash>.js` : la fiche produit à part. Elle n'est téléchargée qu'à
    l'ouverture d'un produit, grâce au `lazy(() => import(...))` de `pages/ProductDetailRoute.tsx`
    (c'est le *code splitting*).
  - Le `<hash>` change quand le contenu change, pour que le navigateur ne garde pas une vieille
    version en cache.

---

## 8. Le dossier `docs/`

| Fichier | Contenu |
| --- | --- |
| `projet-react.md` | Le cahier des charges officiel du cours. |
| `PROMPT_CLAUDE_CODE.md` | Le prompt de départ du projet. |
| `01 · Accueil.png` … `14 · …png` | Les maquettes, écran par écran. Le PDF et le ZIP des maquettes sont ignorés par Git (doublons lourds). |
| `ORAL.md` | La préparation de l'oral : chaque hook et les questions probables. |
| `NSFW_IMAGES.md` | Les sources et licences des photos du mode NSFW. |
| `ARBORESCENCE.md` | Ce fichier. |
