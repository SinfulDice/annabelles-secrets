# Annabelle's Secrets

Boutique en ligne **fictive** de bien-être intime (projet de cours React, B3 front-end).
Trois univers : **Femme**, **Homme** et **Goodies** (produits dérivés de la marque).
Aucun paiement, aucune vraie commande : c'est une démonstration.

> **Branche `feat/server-side-api` : ajouts faits après l'oral**
>
> La version rendue est sur `main`. Cette branche répond à la remarque de l'oral : « imagine
> 25 000 produits, tu ne vas pas tout télécharger pour trier dessus ».
>
> - **Notre propre API** (fonctions Vercel en TypeScript, dossiers `api/` et `server/`) remplace la
>   lecture DummyJSON. Le **serveur** cherche, filtre, trie et découpe le catalogue ; le navigateur ne
>   reçoit que **la page affichée** (12 produits) :
>   - `GET /api/products?q=…&category=…&type=…&maxPrice=…&waterproof=true&sort=…&page=…` → une page
>     et le total ;
>   - `GET /api/products/{id}` → un produit (404 s'il n'existe pas) ;
>   - `GET /api/catalog` → nombre de produits et types par catégorie (accueil, filtre « Type »).
> - Le serveur ne fait pas confiance à l'URL : une valeur invalide prend sa valeur par défaut, et
>   une page fait 48 produits au maximum.
> - Chaque changement de filtre ou de page envoie une requête ; la précédente est annulée. Pendant le
>   chargement, l'ancienne page reste affichée, grisée, avec « Mise à jour… ».
> - Plus de variable d'environnement : `npm run dev` sert aussi l'API (plugin dans `vite.config.ts`).
> - Les produits créés par l'admin s'affichent dans un encart « Ajoutés pendant cette session ».
> - Tests : 381 tests Vitest (dont 33 pour l'API) et 33 tests Playwright (`npm run test:e2e`).
>
> Les règles modifiées sont dans `SPEC.md` (R10, R11, R17 à R19, R41, R53, R77, R82, R114) ; le
> détail est plus bas dans « Choix techniques » et « Limites ».

> **Tester l'accès admin**
>
> Page **Mon compte** (icône en haut à droite) → onglet « Se connecter » :
>
> - e-mail : `admin@annabelles-secrets.fr`
> - mot de passe : `P4ssw0rd`
>
> Ce compte existe dès le premier lancement. Il débloque l'**ajout** de produits (bouton
> « Ajouter un produit » dans l'en-tête), puis la modification et la suppression.

- **Site en ligne** : <https://annabelles-secrets.vercel.app>
- **Dépôt** : <https://github.com/SinfulDice/annabelles-secrets>

## Sujet et API

Le site lit ses produits avec **sa propre petite API** (fonctions Vercel en TypeScript), et utilise
[DummyJSON](https://dummyjson.com/) pour simuler les écritures :

| Besoin               | Endpoint                                             | Pourquoi                                                                                                                     |
| -------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Une page de produits | `GET /api/products?q=…&category=…&page=…` (la nôtre) | Le serveur cherche, filtre, trie et découpe en pages : le navigateur ne reçoit que les 12 produits affichés.                 |
| Un produit           | `GET /api/products/{id}` (la nôtre)                  | La fiche charge son produit (accès direct à l'URL) ; 404 si l'id est inconnu.                                                |
| Résumé du catalogue  | `GET /api/catalog` (la nôtre)                        | Nombre de produits par catégorie et liste des types (accueil, filtre « Type ») : petit, quel que soit le nombre de produits. |
| Créer un produit     | `POST https://dummyjson.com/products/add`            | Endpoint de création officiel ; DummyJSON simule l'enregistrement et renvoie le produit avec un id.                          |
| Modifier / supprimer | `PUT` / `DELETE https://dummyjson.com/products/{id}` | Endpoints officiels ; DummyJSON simule la modification et la suppression.                                                    |

Les produits de DummyJSON (téléphones, parfums…) ne collent pas au thème : notre API lit notre propre
jeu de données, `data/products.json` (45 produits).

Les **500 avis clients** (`src/data/reviews.json`) sont livrés avec l'application et répartis de façon
déterministe : un même produit affiche toujours les mêmes avis.

## Prérequis

- **Node.js** 20.19+ ou 22.12+ (testé avec Node 24) et **npm**.
- Un navigateur récent.

## Installation et lancement

```bash
git clone https://github.com/SinfulDice/annabelles-secrets.git
cd annabelles-secrets
npm install
npm run dev                 # http://localhost:5173 (le site ET l'API /api/…)
```

| Commande                          | Rôle                                                  |
| --------------------------------- | ----------------------------------------------------- |
| `npm run dev`                     | Serveur de développement                              |
| `npm run build`                   | Vérifie les types puis construit le site dans `dist/` |
| `npm run preview`                 | Sert la version construite                            |
| `npm run lint`                    | ESLint (échoue au moindre avertissement)              |
| `npm run format` / `format:check` | Prettier : corrige / vérifie la mise en forme         |
| `npm run typecheck`               | Vérification TypeScript                               |
| `npm test`                        | Tests Vitest (381 tests)                              |
| `npm run test:e2e`                | Tests Playwright de bout en bout (33 tests)           |

## Configuration

**Aucune variable d'environnement.** En production, Vercel transforme les fichiers de `api/` en
adresses `/api/…`. En développement, un petit plugin Vite (dans `vite.config.ts`) sert les mêmes
adresses avec le même code (`server/routes.ts`) : `npm run dev` suffit.

Pour changer les produits, modifier `data/products.json` puis redéployer. Ce fichier est lu par le
serveur uniquement : le code du navigateur (`src/`) ne l'importe jamais.

**Changer les images du mode NSFW** (mode prévu en extra) : modifier les tableaux `nsfwImages` et
`nsfwImageCredits` de `data/products.json`, puis redéployer (voir `docs/NSFW_IMAGES.md`).

## Choix techniques

**Recherche, filtres, tri et pagination côté serveur.** Dans la première version, l'application
chargeait les 45 produits une seule fois et filtrait dans le navigateur. À l'oral, la remarque a été :
« imagine 25 000 produits ». Tout télécharger serait alors lent et lourd. Maintenant :

- les filtres du contexte deviennent une adresse (`utils/productQuery.ts`) :
  `/api/products?category=femme&page=2` ;
- le serveur (`server/catalog.ts`) filtre, trie et découpe **tout** le catalogue avec les mêmes
  fonctions pures qu'avant (`utils/filterProducts.ts`, `utils/paginate.ts`), puis renvoie **une seule
  page** (12 produits, 48 au maximum) avec le total. Avec une vraie base de données, ce serait une
  requête SQL (`WHERE … ORDER BY … LIMIT 12 OFFSET 12`) ;
- le serveur ne fait jamais confiance à l'URL : une valeur invalide prend sa valeur par défaut ;
- chaque changement de critère ou de page envoie une requête ; la précédente est annulée
  (`AbortController`), donc une vieille réponse n'écrase jamais une plus récente. La recherche texte
  attend 300 ms après la dernière frappe ;
- pendant le chargement de la page suivante, l'ancienne reste affichée, grisée, avec « Mise à jour… »
  (les squelettes ne servent qu'au tout premier chargement).

**Contextes React** (dans `src/contexts/`, chacun avec son hook qui lève une erreur hors du Provider) :

| Contexte                 | Rôle                                                                                                                                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CatalogContext`         | Charge une fois le petit résumé du catalogue (`/api/catalog`) : nombre de produits par catégorie et types, pour l'accueil et le filtre « Type ».                                                                                     |
| `SessionProductsContext` | Garde les créations, modifications et suppressions de l'admin pendant la session (un `useReducer` testé à part) ; elles sont appliquées par-dessus les pages reçues du serveur.                                                      |
| `FiltersContext`         | Recherche, catégorie, type, prix, étanche, tri et page, gérés par un `useReducer`. Placé au-dessus du routeur : les critères survivent à un aller-retour liste ↔ fiche. Le reducer remet la page à 1 à chaque changement de critère. |
| `AccountContext`         | Comptes de démonstration et session, dans `localStorage` (`annabelle:accounts`, `annabelle:session`) ; expose `currentUser`, `isAdmin`, inscription, connexion, modification, suppression.                                           |
| `ThemeContext`           | Thème clair / sombre : choix sauvegardé, sinon réglage du système ; met la classe `dark` sur `<html>`.                                                                                                                               |
| `AgeGateContext`         | Réponse à la vérification d'âge, utilisée par la modale, les pubs et le mode NSFW.                                                                                                                                                   |
| `ContentModeContext`     | Mode SFW / NSFW et images déjà affichées.                                                                                                                                                                                            |
| `AdsContext`             | Formats de pubs fermés et étapes de la blague des pubs.                                                                                                                                                                              |
| `NewsletterContext`      | Abonnés de la newsletter factice dans `localStorage` (`annabelle:newsletter`), avec une attente simulée.                                                                                                                             |
| `FavoritesContext`       | Favoris sans doublon, sauvegardés dans `localStorage` (`annabelle:favorites`) sous forme d'instantanés : la page Favoris fonctionne même si l'API est en panne.                                                                      |
| `ToastContext`           | Notifications temporaires (`role="status"`).                                                                                                                                                                                         |

**Requêtes** : une seule fonction `httpRequest` (`services/http.ts`) vérifie `response.ok`, transforme
les échecs en `HttpError` (code + message en français) et accepte un `AbortController`. Un seul hook,
`useRemoteData(adresse)`, charge une page de produits, un produit ou le catalogue : il relance la
requête quand l'adresse change et annule la précédente. Son état est une **union discriminée**
(`loading | success | error`) plutôt que plusieurs booléens.

**Pas de TanStack Query, Redux ni Zustand** : le besoin reste petit (trois adresses de lecture, trois
écritures simulées), et les hooks de React suffisent. Le cours demande de savoir expliquer `useState`,
`useEffect`, `useRef` et `useContext` sur son propre code. Les explications de chaque hook sont dans
[`docs/ORAL.md`](docs/ORAL.md).

**Découpage du code** : la fiche produit (avec les 500 avis) est chargée à la demande
(`React.lazy` + `Suspense`), ce qui garde le fichier principal sous 500 Ko.

**Structure** :

```
api/            fichiers des fonctions Vercel (une ligne chacun : ils appellent server/)
server/         notre API : routes.ts (requête → réponse) et catalog.ts (filtre, tri, pages), testés
data/           products.json, le catalogue lu par le serveur
src/
  app/          routeur, empilement des contextes
  pages/        une page par route
  components/   layout/, products/, home/, ui/ (composants génériques sans logique métier)
  contexts/     contextes + reducer des filtres
  hooks/        hooks maison (useRemoteData, useDebouncedValue, useLocalStorage, useFocusTrap…)
  services/     appels réseau (http.ts, productsApi.ts)
  utils/        fonctions pures, toutes testées
  types/        types TypeScript
  constants/    valeurs fixes (taille de page, délai, clés localStorage…)
```

Les règles du projet sont numérotées dans [`SPEC.md`](SPEC.md) (R1, R2…) ; chaque test cite la règle
qu'il vérifie.

## Bibliothèques

| Bibliothèque                                                                          | Usage                                                                        |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| React 19 + TypeScript 6 (mode `strict`)                                               | Interface et typage                                                          |
| Vite 8                                                                                | Serveur de développement et build                                            |
| React Router 8 (mode data)                                                            | Routes, accès direct aux URL                                                 |
| Tailwind CSS 4                                                                        | Styles ; les couleurs de la maquette sont des variables dans `src/index.css` |
| ESLint 9 (`typescript-eslint`, `react-hooks`, `react-refresh`, `jsx-a11y`) + Prettier | Qualité et mise en forme                                                     |
| Vitest 5                                                                              | Tests des fonctions pures                                                    |

ESLint reste en version 9 car `eslint-plugin-jsx-a11y` ne supporte pas encore ESLint 10.

## Fonctionnalités

**Cahier des charges obligatoire**

- Accueil avec en-tête, navigation, univers, produits les mieux notés et goodies.
- Boutique : recherche (insensible à la casse et aux accents), filtres catégorie, type, prix maximum,
  « étanche uniquement », tri, puces « filtres actifs », pagination de 12 produits avec « Page X sur Y ».
  Tous les critères se cumulent ; tout changement ramène à la page 1.
- Fiche produit : galerie, prix et remise, disponibilité, caractéristiques, avis clients filtrables,
  fil d'Ariane, « Retour aux résultats » (filtres et page conservés).
- Favoris : ajout / retrait depuis les cartes et la fiche, sans doublon, sauvegardés et restaurés.
- Création d'un produit : formulaire contrôlé, validation avec messages compréhensibles, `POST` en
  JSON, bouton désactivé pendant l'envoi, valeurs conservées et « Réessayer » en cas d'échec,
  récapitulatif construit à partir de la réponse de l'API. Le produit apparaît ensuite dans la boutique,
  dans un encart « Ajoutés pendant cette session ».
- États : chargement (squelettes au premier chargement, puis anciens résultats grisés avec
  « Mise à jour… »), erreur avec « Réessayer », aucun résultat, aucun favori, produit
  introuvable, page 404.
- Responsive de 320 à 1440 px (menu burger, filtres repliables, barre favori collante sur mobile).
- Accessibilité : labels sur tous les champs, textes alternatifs, navigation au clavier, focus
  visible, lien « Aller au contenu », contrastes vérifiés (≥ 4,5:1 pour le texte).
- Vérification d'âge (18+) au premier passage.

**Extras réalisés**

- **Compte (factice)** : inscription (18 ans minimum, mot de passe de 8 caractères avec un chiffre,
  un seul compte client par navigateur), connexion, profil (mot de passe affichable, modification,
  déconnexion, suppression avec confirmation), onglets accessibles au clavier.
- **Compte admin pré-créé** et route protégée `RequireAdmin` : `/produits/nouveau` affiche
  « Réservé à l'administratrice » aux autres, avec un bouton qui ramène à la page demandée après
  connexion. Le bouton « Ajouter un produit » n'apparaît que pour l'admin.

- **CRUD complet** (admin) : boutons « Modifier » / « Supprimer » sur la fiche ; formulaire de
  modification prérempli (le même composant que la création) envoyé en `PUT`, avec les mêmes états
  d'envoi, de succès et d'erreur ; suppression avec fenêtre de confirmation (focus sur « Annuler »,
  Échap ferme), `DELETE`, notification et retour à la boutique. Un produit supprimé disparaît aussi
  des favoris.

- **Fausses publicités parodiques** : bannière (accueil, boutique), encart carré (fiche) et pop-up
  (une fois par session, 20 s après l'arrivée, fermable après 3 s). Texte seulement, aucun lien réel ;
  le message change toutes les 8 s sans jamais répéter le précédent (`useRandomAd`), avec une ville et
  un nombre tirés au hasard. « × » les masque jusqu'au rechargement. Un clic sur le bouton d'une pub
  lance une blague : une **fausse** demande d'accès à la caméra, imitant celle du navigateur (aucune
  caméra n'est jamais activée), puis une fenêtre « C'était une fausse pub » avec un GIF. Jamais avant
  la vérification d'âge, et pas d'`aria-live` pour ne pas les annoncer en boucle aux lecteurs d'écran.

- **Mode SFW / NSFW** (bouton « ● SFW » dans l'en-tête, SFW par défaut, choix mémorisé) : le passage
  en NSFW demande une confirmation (focus sur « Rester en SFW ») et n'est possible qu'après la
  vérification d'âge. En NSFW, les vraies photos produits (`nsfwImages`) s'affichent **floutées**
  avec « Contenu adulte · Afficher l'image », puis « Masquer » ; un bandeau propose « Tout afficher »
  et « Revenir en SFW ». Le texte alternatif reste neutre ; si une photo ne charge pas, l'image SFW
  la remplace. Les goodies sont identiques dans les deux modes. Un seul composant (`ProductImage`)
  connaît le mode.

- **Newsletter (factice)** sur `/newsletter` : inscription (prénom, e-mail, centres d'intérêt,
  fréquence, accord 18+ obligatoire ; une adresse déjà inscrite voit ses préférences mises à jour),
  désinscription (raison facultative, « Adresse introuvable », « Annuler et me réabonner »). Une attente
  de 600 ms simule un serveur. E-mail prérempli si l'on est connecté ; case « M'abonner aussi » à
  l'inscription du compte ; statut affiché dans le profil. Bloc « La lettre d'Annabelle » sur l'accueil.

**Bonus réalisés** : TypeScript ; recherche automatique 300 ms après la dernière frappe (debounce) ;
CRUD complet ; **thème sombre** partagé par un contexte (`ThemeContext`), sauvegardé dans
`localStorage` (`annabelle:theme`) et restauré à l'ouverture, qui suit le réglage du système tant
qu'on n'a rien choisi (un petit script dans `index.html` l'applique avant React pour éviter un flash
blanc) ; déploiement Vercel (`vercel.json` réécrit toutes les routes sauf `/api/…` vers `index.html`) ;
**API maison** avec recherche, filtres et pagination côté serveur ; **33 tests Playwright** de bout en
bout, en plus des tests Vitest.

Tous les extras prévus sont réalisés.

## Limites et problèmes connus

- **Le « serveur » lit un fichier JSON**, pas une base de données : pour 25 000 produits, il faudrait
  une vraie base (PostgreSQL…) avec des index, et la recherche sans accents se ferait en SQL.
- **Créations non persistées** : DummyJSON simule l'enregistrement ; les produits créés disparaissent
  au rechargement (autorisé par le cahier des charges). Notre API ne les connaît pas : ils sont
  montrés à part, dans l'encart « Ajoutés pendant cette session », sans filtre ni pagination.
- **Produit supprimé pendant la session** : il est masqué de la page reçue du serveur, qui montre
  alors une carte de moins, et le nombre de résultats n'est pas corrigé.
- **DummyJSON renvoie toujours l'id 195** à la création : l'application donne au produit le premier
  id libre (195, 196…) parmi les produits créés, pour que deux produits créés n'aient pas la même
  adresse. Avec plus de 195 produits côté serveur, cet id pourrait déjà exister. Le récapitulatif
  affiche l'id renvoyé par l'API et signale l'écart.
- **Réponse de `PUT` ignorée** : pour les ids 1 à 45, DummyJSON renvoie _son_ produit du même id
  (un mascara…) mélangé avec nos champs. L'application ne garde que le statut HTTP et applique ce
  qu'elle a envoyé.
- **Produits créés modifiés et supprimés localement** : DummyJSON ne les connaît pas (`PUT` et
  `DELETE` répondent 404), donc l'application applique le changement sans appel réseau.
- **La réponse de création ne contient pas** le type, le matériau ni l'étanchéité : ils sont repris du
  formulaire. Un produit créé n'a ni note ni avis.
- **Mot de passe stocké en clair dans le navigateur** : c'est une **faille volontaire de
  démonstration**, à ne jamais reproduire en production. N'importe quel script de la page ou personne
  ayant accès à l'ordinateur peut le lire (la page Mon compte l'affiche d'ailleurs). Un vrai site
  enverrait le mot de passe à un serveur, qui le stockerait haché (bcrypt, Argon2).
- **Newsletter et comptes uniquement locaux** : aucun e-mail n'est jamais envoyé, et tout disparaît si
  l'on vide les données du navigateur.
- **La protection admin n'est qu'une protection d'interface** : tout se passe dans le navigateur, on
  peut la contourner en modifiant le `localStorage`. Une vraie protection se ferait côté serveur.
- Les critères de recherche ne survivent pas à un rechargement (non demandé).
- Pas de paiement ni de vraie commande.

## Utilisation de l'IA

- **Maquettes** (`docs/*.png`) : générées avec Claude.
- **Code, tests et documentation** : écrits avec **Claude Code** (Anthropic), étape par étape, à partir
  d'un cahier des charges détaillé (`docs/PROMPT_CLAUDE_CODE.md`) et des règles de `SPEC.md`.
  J'ai relu le code, et chaque fichier m'a été expliqué ; les explications des hooks sont dans
  `docs/ORAL.md`.

## Crédits

- Données produits et avis : fictifs, écrits pour le projet.
- Polices : Space Grotesk, Inter, JetBrains Mono (Google Fonts).
- Photos du mode NSFW : publiées sur [Unsplash](https://unsplash.com) par les marques elles-mêmes,
  sous [licence Unsplash](https://unsplash.com/license) (usage libre, crédit non obligatoire mais
  donné dans l'application sous chaque photo). Détail par produit : `docs/NSFW_IMAGES.md`.

| Photographe / marque   | Page Unsplash                             |
| ---------------------- | ----------------------------------------- |
| Andrey Matveev         | <https://unsplash.com/photos/WydWcF2EPjc> |
| IFONNX Toys            | <https://unsplash.com/photos/BBe9HSHIEiw> |
| IFONNX Toys            | <https://unsplash.com/photos/CSTQ08NXKOE> |
| IFONNX Toys            | <https://unsplash.com/photos/Id_jzYP7h6s> |
| IFONNX Toys            | <https://unsplash.com/photos/Ii43JmypSLY> |
| IFONNX Toys            | <https://unsplash.com/photos/TfCFzMaYaok> |
| IFONNX Toys            | <https://unsplash.com/photos/ZJX8EGDYDd4> |
| IFONNX Toys            | <https://unsplash.com/photos/bW7y5PhWcuQ> |
| IFONNX Toys            | <https://unsplash.com/photos/ck1ZlJbXrlg> |
| IFONNX Toys            | <https://unsplash.com/photos/pi3HvaHRJo4> |
| Lovense Toys           | <https://unsplash.com/photos/K5I89cBdcvM> |
| Lovense Toys           | <https://unsplash.com/photos/Tvc9z5AepWg> |
| Lovense Toys           | <https://unsplash.com/photos/dNfRmv93ztw> |
| My Rose Toy            | <https://unsplash.com/photos/OzI2rMrywUk> |
| Myvelvettouch Official | <https://unsplash.com/photos/hbI9UUaNabU> |
| Tracy's Dog            | <https://unsplash.com/photos/_43ENzvNBYs> |
| Tracy's Dog            | <https://unsplash.com/photos/uXt2OFSPA2s> |
| Womanizer Toys         | <https://unsplash.com/photos/gmFZ0qxd_cg> |
