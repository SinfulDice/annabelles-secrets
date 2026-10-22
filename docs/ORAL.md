# Préparer l'oral

Pour chaque hook : **où** il est utilisé, **pourquoi**, et **ce qui se passerait sans lui**.
Puis les questions probables du prof, avec une réponse courte.

---

## 1. Les hooks de React

### `useState` : une valeur qui, quand elle change, fait réafficher le composant

| Où | Pourquoi |
| --- | --- |
| `hooks/useProducts.ts` : `state`, `attempt` | L'état de la requête (chargement / succès / erreur) et un compteur de tentatives pour « Réessayer ». |
| `components/products/ProductForm.tsx` : `values`, `failedAttempts` | Le formulaire **contrôlé** : chaque champ affiche `values[champ]` et le modifie à chaque frappe. |
| `hooks/useSearchText.ts` : `searchText` | Le texte tapé, mis à jour à chaque touche (le contexte, lui, ne reçoit la valeur qu'après 300 ms). |
| `ProductGallery`, `ProductReviews`, `Header`, `SearchForm` | Image choisie, filtre d'étoiles, menu ouvert, « Plus de filtres » : un état **local**, car aucun autre composant n'en a besoin. |

**Sans lui** : une variable normale (`let x`) est remise à zéro à chaque rendu et la modifier n'affiche
rien de nouveau. L'écran ne suivrait pas les actions de l'utilisateur.

**À savoir dire** :
- `setValues(previous => ({ ...previous, [field]: value }))` : la forme « fonction » utilise toujours la
  valeur la plus récente ; on crée un **nouvel** objet au lieu de modifier l'ancien (React compare les
  références pour savoir si quelque chose a changé).
- `useState(() => readStoredValue(...))` dans `useLocalStorage` : l'état initial **paresseux** ne lit
  le `localStorage` qu'au premier rendu.

### `useEffect` : synchroniser React avec l'extérieur (réseau, minuteurs, DOM, `localStorage`)

| Où | Ce qu'il synchronise | Le nettoyage (`return () => …`) |
| --- | --- | --- |
| `useProducts.ts` | Lance le `fetch` des produits ; relancé quand `attempt` change (« Réessayer »). | `controller.abort()` : annule la requête si le composant disparaît. |
| `useDebouncedValue.ts` | Lance un minuteur de 300 ms à chaque nouvelle valeur. | `clearTimeout` : chaque frappe **annule** le minuteur précédent. C'est ça, le debounce. |
| `useSearchText.ts` | Envoie la recherche « calmée » au contexte des filtres. | — |
| `useLocalStorage.ts` | Sauvegarde la valeur à chaque changement. | — |
| `usePageTitle.ts` | Met à jour `document.title`. | — |
| `components/ui/Toast.tsx` | Ferme la notification après 4 s. | `clearTimeout` si on la ferme à la main avant. |
| `components/layout/MobileMenu.tsx` | Écoute la touche Échap sur toute la page. | `removeEventListener` : sinon un écouteur de plus à chaque ouverture. |
| `hooks/useFocusTrap.ts` | Piège le focus dans une fenêtre modale. | Rend le focus à l'élément d'avant. |
| `ProductForm.tsx` | Donne le focus au résumé d'erreurs après un envoi raté. | — |
| `useCreateProduct.ts` | Rien au montage ; seulement un nettoyage. | Annule l'envoi si on quitte la page. |
| `useRandomAd.ts` | Lance un `setInterval` qui change la pub toutes les 8 s. | `clearInterval` : voir l'encadré ci-dessous. |
| `AdPopup.tsx` | Ouvre la pop-up 20 s après l'arrivée, puis le compte à rebours de 3 s. | `clearTimeout` si on quitte avant. |

**Le tableau de dépendances** `[a, b]` : l'effet se relance quand `a` ou `b` change. `[]` = une seule
fois, au montage. Le linter (`react-hooks/exhaustive-deps`) vérifie qu'on n'oublie rien : il m'a
d'ailleurs signalé un `[]` recréé à chaque rendu dans `useSelectCategory`.

**Ce que je ne fais PAS avec `useEffect`** : calculer la liste filtrée. Elle est calculée **pendant le
rendu** dans `ProductsPage` (`filterProducts` → `sortProducts` → `paginate`). La stocker dans un état
mis à jour par un effet ferait un rendu en trop et risquerait d'afficher une liste en retard sur les
filtres.

**Pourquoi les effets tournent deux fois en développement ?** `<StrictMode>` (dans `main.tsx`) monte,
démonte puis remonte chaque composant pour vérifier que les nettoyages sont corrects. En production,
une seule fois.

### `useRef` : garder une valeur ou un élément HTML **sans** provoquer de rendu

| Où | Pourquoi |
| --- | --- |
| `hooks/useRandomAd.ts` : `previousIndexRef` | Index de la pub affichée, lu par le `setInterval` pour ne jamais tirer deux fois la même (voir l'encadré). |
| `contexts/ToastContext.tsx` : `nextId` | Compteur pour donner un id unique à chaque notification. Le modifier n'a pas besoin de réafficher quoi que ce soit. |
| `hooks/useCreateProduct.ts` : `controllerRef` | Garde l'`AbortController` de l'envoi en cours d'un rendu à l'autre, pour pouvoir l'annuler au démontage. |
| `AgeGate`, `Modal`, `ProductForm`, `FavoritesPage`, `CreatedProductSummary` | Accès direct à un élément du DOM pour appeler `.focus()` (le bouton « Entrer », le résumé d'erreurs, un titre…). |

**Différence avec `useState`** : changer `ref.current` ne réaffiche rien. Si `nextId` était un état,
chaque notification provoquerait un rendu inutile de plus. Inversement, une valeur **affichée** à
l'écran doit être un état, pas une ref : l'écran ne se mettrait pas à jour.

**Sans `useRef` pour le focus** : React ne fournit pas d'autre moyen propre d'appeler `.focus()` sur un
élément précis ; `document.querySelector` marcherait mais contourne React.

### Encadré : `useRandomAd`, le `useRef` et le nettoyage du `setInterval`

```ts
const [ad, setAd] = useState(() => drawAd(null))
const previousIndexRef = useRef(ad.index)

useEffect(() => {
  const timer = window.setInterval(() => {
    const next = drawAd(previousIndexRef.current) // jamais le même que le précédent
    previousIndexRef.current = next.index
    setAd(next)
  }, intervalMs)
  return () => window.clearInterval(timer)
}, [intervalMs])
```

- **Pourquoi l'effet ne dépend que de `intervalMs`** : on veut **un seul** minuteur pendant toute la
  vie du composant. Si `ad` était dans les dépendances, l'intervalle serait détruit et recréé à
  chaque nouvelle pub.
- **Pourquoi un `useRef` et pas `ad`** : la fonction passée à `setInterval` est créée une seule fois.
  Elle « capture » les variables du premier rendu : si elle lisait `ad`, elle verrait **toujours la
  première pub** (on appelle ça une *closure périmée*, « stale closure ») et pourrait répéter la pub
  affichée. Le ref est une boîte partagée par tous les rendus : la fonction lit toujours la dernière
  valeur. Et modifier `ref.current` ne provoque pas de rendu en plus (`setAd` s'en charge).
- **Sans le nettoyage `clearInterval`** : chaque visite d'une page avec une pub ajouterait un
  intervalle de plus, qui continuerait à tourner après avoir quitté la page (fuite de mémoire, et
  React avertirait d'une mise à jour sur un composant démonté). En développement, `StrictMode`
  monte deux fois le composant : sans nettoyage, on aurait déjà deux pubs qui changent en même temps.
- **« Jamais deux fois la même »** est garanti par `pickNextAdIndex` (fonction pure, testée R122) : on
  tire parmi les **autres** messages seulement, avec un décalage de 1 à 7.

### `useContext` : lire une valeur partagée sans la passer de parent en enfant

Utilisé à l'intérieur de chaque hook de contexte (`useFilters`, `useFavorites`, `useProductsContext`,
`useToast`). Chacun vérifie qu'il est bien sous son Provider et lève une erreur claire sinon.

**Sans lui** : il faudrait passer `filters`, `favorites`, etc. en props à travers toutes les couches
(« prop drilling »), y compris des composants qui ne s'en servent pas, comme le `Layout`.

### `useReducer` : un état avec plusieurs façons de changer

Dans `contexts/FiltersContext.tsx`, avec le reducer `contexts/filtersReducer.ts`.

- Le **reducer** est une fonction pure `(état, action) → nouvel état`, testée sans React.
- Les composants envoient des **actions** qui disent ce qui s'est passé :
  `dispatch({ type: 'queryChanged', query: 'wand' })`.
- **Avantage clé** : « tout changement de critère remet la page à 1 » est écrit **une seule fois**
  dans le reducer (`changeCriteria`). Avec des `useState` séparés, chaque composant devrait penser à
  remettre la page à 1, et un oubli créerait un bug.
- Si la valeur ne change pas (retour d'une fiche), le reducer renvoie le **même** état : la page
  courante n'est pas perdue.

### `useMemo` et `useCallback` : garder la même valeur / la même fonction d'un rendu à l'autre

- `useMemo` sur la **valeur des contextes** (`ProductsContext`, `FiltersContext`, `FavoritesContext`,
  `ToastContext`) : sans lui, un nouvel objet `{ ... }` serait créé à chaque rendu du Provider et
  **tous** les composants qui lisent le contexte se réafficheraient.
- `useCallback` sur les fonctions données aux contextes ou utilisées dans des dépendances d'effets
  (`retry`, `toggleFavorite`, `closeMenu`…). Exemple : `MobileMenu` a un effet qui dépend de
  `onClose` ; si `closeMenu` changeait à chaque rendu, l'écouteur Échap serait retiré et remis en
  boucle.
- Je n'utilise **pas** `useMemo` pour filtrer les 45 produits : c'est instantané, l'optimisation serait
  inutile.

### Le thème sombre : des variables CSS plutôt que `dark:` partout

- Toutes les couleurs sont des variables (`--color-page`, `--color-ink`…) déclarées dans
  `src/index.css`. Sous la classe `.dark`, on leur donne d'autres valeurs : **toutes** les classes
  Tailwind (`bg-page`, `text-ink`…) changent d'un coup, sans écrire `dark:` dans chaque composant.
- `ThemeContext` met la classe `dark` sur `<html>` avec un `useEffect` (`<html>` est en dehors de
  React : c'est une synchronisation avec l'extérieur, le vrai rôle d'un effet).
- On ne sauvegarde que le **choix** de l'utilisateur. Sans choix, on suit `prefers-color-scheme`, et
  un second effet écoute les changements du réglage système (avec nettoyage de l'écouteur).
- Un petit script dans `index.html` applique le thème **avant** que React démarre : sinon la page
  s'afficherait en blanc une fraction de seconde (« flash ») avant de passer en sombre.
- Les contrastes de la palette sombre ont tous été vérifiés (≥ 4,5:1 pour le texte).

### `lazy` + `Suspense` (pas des hooks, mais à connaître)

`pages/ProductDetailRoute.tsx` : la fiche produit et ses 500 avis forment un fichier séparé, téléchargé
à la première fiche ouverte. `Suspense` affiche « Chargement du produit… » pendant ce temps.
**Pourquoi** : sans ça, le build signalait un fichier de plus de 500 Ko.

### Les hooks maison (`src/hooks/`)

Un hook maison est une fonction qui commence par `use` et qui utilise d'autres hooks. Il sert à sortir
la logique des composants pour la réutiliser et la nommer.

| Hook | Ce qu'il fait |
| --- | --- |
| `useProducts` | Charge les produits, état en union discriminée, `retry`, annulation. |
| `useDebouncedValue` | Renvoie une valeur seulement après 300 ms sans changement. |
| `useSearchText` | Texte du champ de recherche + envoi retardé au contexte. |
| `useLocalStorage` | Comme `useState`, mais restauré et sauvegardé dans le `localStorage` (valeur vérifiée). |
| `useFocusTrap` | Focus piégé dans une modale. |
| `usePageTitle` | Titre de l'onglet. |
| `useSelectCategory` | Règle la catégorie des filtres avant d'ouvrir la boutique. |
| `useCreateProduct` | Envoi du formulaire de création, états envoi / succès / erreur. |
| `useEditProduct` / `useDeleteProduct` | `PUT` / `DELETE`, mise à jour de la boutique et des favoris. |
| `useRandomAd` | Pub parodique qui change toutes les 8 s, jamais deux fois la même. |

Autres contextes ajoutés avec les extras : `AccountContext` (comptes et session), `AgeGateContext`
(réponse 18+), `ContentModeContext` (SFW / NSFW), `AdsContext` (pubs fermées, blague),
`NewsletterContext` (abonnés), `ThemeContext` (thème). Même schéma partout : Provider + hook qui
lève une erreur hors du Provider, valeur mémorisée avec `useMemo`.

---

## 2. La stack : ce qu'on a ajouté à React et TypeScript

Tout est dans `package.json`. Une seule bibliothèque part dans le site final, le reste sert à coder.

### Envoyé au navigateur (`dependencies`)

| Paquet | Rôle |
| --- | --- |
| `react` | Composants et hooks. |
| `react-dom` | Affiche React dans la page HTML (`createRoot` dans `src/main.tsx`). |
| `react-router` | Associe une URL à une page sans recharger le site : `createBrowserRouter`, `<Link>`, `<Outlet>`, `useParams` (`src/app/router.tsx`). |

### Outils de développement (`devDependencies`, absents du site final)

| Outil | Rôle |
| --- | --- |
| Vite (+ `@vitejs/plugin-react`) | Serveur de dev avec rechargement instantané (`npm run dev`) et build vers `dist/` (`npm run build`). Le plugin lui apprend le JSX. |
| Tailwind CSS (+ `@tailwindcss/vite`) | Le style par classes dans le JSX. Les couleurs des maquettes sont définies une fois dans `src/index.css` (`@theme`). |
| Vitest | Les tests (`npm test`) : les `*.test.ts` de `src/utils/` et `src/contexts/`. |
| ESLint (+ plugins) | Repère les erreurs sans lancer le code (`npm run lint`) : `react-hooks` (règles des hooks), `jsx-a11y` (accessibilité), `typescript-eslint`, `react-refresh`. |
| Prettier (+ `prettier-plugin-tailwindcss`) | Met le code en forme (`npm run format`) et trie les classes Tailwind. `eslint-config-prettier` évite qu'ESLint et Prettier se contredisent. |
| `@types/react`, `@types/react-dom`, `@types/node` | Les types TypeScript de ces bibliothèques. |
| `globals` | La liste des variables globales (`window`, `document`…) pour ESLint. |

### Services externes (rien à installer)

DummyJSON (l'API imposée : Custom Response pour les 45 produits, `POST` / `PUT` / `DELETE`
simulés), Vercel (hébergement), Google Fonts (Inter, Space Grotesk, JetBrains Mono), Unsplash
(photos du mode NSFW).

### Questions probables sur la stack

**Pourquoi pas Redux, Zustand, TanStack Query ou Axios ?**
Choix volontaire (R2). Les données partagées passent par les contextes, les requêtes par `fetch` et
des hooks maison. À cette taille (45 produits, une dizaine de pages), ces bibliothèques ajouteraient
des concepts sans rien résoudre de plus, et je peux expliquer chaque ligne du code.

**Pourquoi React Router ?**
React seul n'a pas de notion d'URL. Le routeur affiche la bonne page pour chaque adresse, gère les
paramètres (`:id`) et le bouton Retour du navigateur, sans recharger le site.

**Pourquoi Tailwind plutôt que des fichiers CSS ?**
Le style est à côté du JSX qu'il décore, donc pas de noms de classes à inventer ni de CSS mort. Les
couleurs des maquettes sont des variables (`@theme`) : `bg-page` change seul en mode sombre.

**Quelle différence entre ESLint et Prettier ?**
Prettier s'occupe de la forme (espaces, guillemets, longueur des lignes). ESLint s'occupe du fond
(« ce hook est appelé dans un `if` », « cette image n'a pas d'`alt` »).

**Pourquoi Vite ?**
Le démarrage et le rechargement sont quasi instantanés en dev. Au build, il produit des fichiers
minifiés, avec un hash dans le nom pour le cache, et découpés : la fiche produit est un fichier à part
grâce à `lazy`.

**Que fait `tsc -b` dans `npm run build` ?**
Il vérifie les types avant le build. Vite ne vérifie pas les types : il enlève seulement le TypeScript.
Sans `tsc -b`, une erreur de type pourrait partir en production.

---

## 3. Questions probables du prof

**Pourquoi filtrer côté client et pas côté API ?**
Mon endpoint Custom Response renvoie un JSON figé : il ignore `?q=`, `?limit=`, `?skip=`. Je charge
donc les 45 produits une fois et j'applique des fonctions pures sur toute la liste. C'est instantané à
cette taille. Avec 10 000 produits, il faudrait une API qui pagine et filtre côté serveur.

**Quel est le rôle de chaque contexte ?**
Produits (chargés une fois, + produits créés), Filtres (critères + page, avec un reducer), Favoris
(sauvegardés dans le `localStorage`), Notifications. Ils sont placés au-dessus du routeur, donc ils
survivent aux changements de page.

**Comment les filtres sont-ils conservés entre la liste et la fiche ?**
Ils sont dans `FiltersContext`, au-dessus de `RouterProvider`. Quand on change de page, seul le contenu
de `<Outlet />` change ; le contexte reste. « Retour aux résultats » est un simple lien vers
`/produits`.

**Expliquez le debounce.**
`useDebouncedValue` : à chaque nouvelle valeur, l'effet lance un `setTimeout` de 300 ms ; le
nettoyage annule le minuteur précédent. Tant qu'on tape, le minuteur est sans cesse annulé ; il ne va
au bout que 300 ms après la dernière frappe. Entrée lance la recherche tout de suite.

**Comment gérez-vous les erreurs de requête ?**
`httpRequest` vérifie `response.ok` (`fetch` ne lève pas d'erreur sur un 404 ou un 500), lève une
`HttpError` avec le code et un message en français. Une coupure réseau donne le code 0. Une requête
annulée (`AbortError`) est ignorée. L'interface affiche le message et un bouton « Réessayer ».

**Pourquoi un `AbortController` ?**
Si on quitte la page avant la réponse, la requête est annulée dans le nettoyage de l'effet. Sinon, une
réponse tardive pourrait mettre à jour un composant qui n'existe plus, ou écraser une réponse plus
récente.

**Pourquoi une union discriminée plutôt que `isLoading` / `isError` ?**
Avec trois booléens, des combinaisons impossibles existent (« en chargement ET en erreur »). Avec
`status`, un seul cas à la fois, et TypeScript sait que `products` n'existe que si `status` vaut
`'success'`.

**Comment évitez-vous les doublons dans les favoris ?**
`addFavorite` ne change rien si l'id est déjà présent, et `parseFavorites` dédoublonne ce qui est lu
dans le `localStorage` (qui peut avoir été modifié à la main). Testé (R60, R61).

**Comment fonctionne la création ?**
Formulaire contrôlé → `validateProductForm` (fonction pure) → `POST` JSON avec
`Content-Type: application/json` → pendant l'envoi, un `fieldset disabled` verrouille tout → en cas
d'échec, les valeurs restent et on peut réessayer → en cas de succès, récapitulatif tiré de la réponse
de l'API et produit ajouté au contexte.

**Pourquoi les avis sont-ils toujours les mêmes ?**
`mulberry32(product.id)` est un générateur pseudo-aléatoire : la même graine donne toujours la même
suite de nombres. `Math.random()` changerait à chaque visite.

**Quelles sont les limites du projet ?**
Endpoint qui expire après 90 jours ; produits créés perdus au rechargement ; DummyJSON renvoie
toujours l'id 195 (je prends le premier id libre) ; bug de cache CORS de DummyJSON contourné avec
`?origin=` ; pas de paiement. Voir le README.

**Qu'est-ce que le bug CORS que vous avez rencontré ?**
DummyJSON gardait en cache 24 h la réponse avec l'autorisation CORS du premier site qui l'avait
demandée. Mon navigateur, sur un autre port, était bloqué. J'ai ajouté l'adresse du site dans l'URL :
chaque site a sa propre entrée de cache.

**Pourquoi un `key` sur la galerie et les avis de la fiche ?**
En passant d'un produit à un autre, React réutilise les mêmes composants et garde leur état local
(image choisie, filtre d'étoiles). Changer la `key` force un composant neuf.

**Pourquoi des clés `key={product.id}` et pas l'index dans les listes ?**
Si la liste est filtrée ou triée, l'index d'un produit change ; React associerait l'état d'un élément
au mauvais produit. L'id est stable.

---

## 4. Modifications qu'on pourrait me demander

| Demande | Où modifier |
| --- | --- |
| 9 produits par page | `PAGE_SIZE` dans `src/constants/config.ts` |
| Délai de recherche de 500 ms | `DEBOUNCE_MS` dans `src/constants/config.ts` |
| Un prix maximum de 200 € | `PRICE_OPTIONS` dans `src/constants/config.ts` |
| Chercher aussi dans la description | `matchesQuery` dans `src/utils/filterProducts.ts` (+ un test) |
| Un nouveau tri « Remise » | `SortOption` (`types/filters.ts`), `SORT_LABELS` (config), `comparators` (`filterProducts.ts`) |
| Un nouveau filtre « En promotion » | 1. champ dans `Filters` ; 2. action + `case` dans `filtersReducer.ts` ; 3. condition dans `filterProducts` ; 4. une `Checkbox` dans `SearchForm` ; 5. une puce dans `activeFilters.ts` ; 6. des tests |
| Description de 30 caractères minimum | `MIN_DESCRIPTION_LENGTH` dans `src/constants/config.ts` |
