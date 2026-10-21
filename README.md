# Annabelle's Secrets

Boutique en ligne **fictive** de bien-être intime (projet de cours React, B3 front-end).
Trois univers : **Femme**, **Homme** et **Goodies** (produits dérivés de la marque).
Aucun paiement, aucune vraie commande : c'est une démonstration.

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

Le site utilise l'API [DummyJSON](https://dummyjson.com/) de deux façons :

| Besoin               | Endpoint                                                                       | Pourquoi                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Lire les 45 produits | [Custom Response](https://dummyjson.com/custom-response) (`VITE_PRODUCTS_URL`) | Les produits de DummyJSON (téléphones, parfums…) ne collent pas au thème : j'ai publié mon propre jeu de données (`data/products.json`). |
| Créer un produit     | `POST https://dummyjson.com/products/add`                                      | Endpoint de création officiel ; DummyJSON simule l'enregistrement et renvoie le produit avec un id.                                      |
| Modifier / supprimer | `PUT` / `DELETE https://dummyjson.com/products/{id}`                           | Endpoints officiels ; DummyJSON simule la modification et la suppression.                                                                |

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
cp .env.example .env        # puis coller l'URL de l'API dans .env (voir Configuration)
npm run dev                 # http://localhost:5173
```

| Commande                          | Rôle                                                  |
| --------------------------------- | ----------------------------------------------------- |
| `npm run dev`                     | Serveur de développement                              |
| `npm run build`                   | Vérifie les types puis construit le site dans `dist/` |
| `npm run preview`                 | Sert la version construite                            |
| `npm run lint`                    | ESLint (échoue au moindre avertissement)              |
| `npm run format` / `format:check` | Prettier : corrige / vérifie la mise en forme         |
| `npm run typecheck`               | Vérification TypeScript                               |
| `npm test`                        | Tests Vitest (322 tests)                              |

## Configuration

Une seule variable d'environnement, dans `.env` :

```bash
VITE_PRODUCTS_URL=https://dummyjson.com/c/76f2-b083-42df-a6fa
```

Sans elle, l'application affiche un message clair au lieu de planter.

**L'endpoint Custom Response expire après 90 jours.** Pour en créer un nouveau :

1. Ouvrir <https://dummyjson.com/custom-response>.
2. Coller le contenu de `data/products.json` et valider.
3. Copier l'URL obtenue dans `.env` (et dans les variables d'environnement Vercel).

`data/products.json` n'est **jamais importé** par l'application : c'est seulement la copie de
sauvegarde qui sert à régénérer l'endpoint.

**Changer les images du mode NSFW** (mode prévu en extra) : modifier les tableaux `nsfwImages` et
`nsfwImageCredits` de `data/products.json`, puis régénérer l'endpoint (voir `docs/NSFW_IMAGES.md`).

## Choix techniques

**Recherche, filtres, tri et pagination côté client.** L'endpoint Custom Response renvoie un JSON
figé : il ne sait ni chercher, ni filtrer, ni paginer. L'application charge donc **une seule fois** les
45 produits, puis applique des **fonctions pures** (`utils/filterProducts.ts`, `utils/paginate.ts`) sur
la liste complète, jamais seulement sur la page visible. Avec 45 produits, c'est instantané. Ces
résultats sont calculés pendant le rendu (pas stockés dans un état), donc toujours à jour.

**Contextes React** (dans `src/contexts/`, chacun avec son hook qui lève une erreur hors du Provider) :

| Contexte           | Rôle                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ProductsContext`  | Charge les produits une fois pour toute l'app, expose l'état (chargement / succès / erreur), `retry`, et applique par-dessus les créations, modifications et suppressions de la session (un `useReducer` testé à part).              |
| `FiltersContext`   | Recherche, catégorie, type, prix, étanche, tri et page, gérés par un `useReducer`. Placé au-dessus du routeur : les critères survivent à un aller-retour liste ↔ fiche. Le reducer remet la page à 1 à chaque changement de critère. |
| `AccountContext`   | Comptes de démonstration et session, dans `localStorage` (`annabelle:accounts`, `annabelle:session`) ; expose `currentUser`, `isAdmin`, inscription, connexion, modification, suppression.                                           |
| `FavoritesContext` | Favoris sans doublon, sauvegardés dans `localStorage` (`annabelle:favorites`) sous forme d'instantanés : la page Favoris fonctionne même si l'API est en panne.                                                                      |
| `ToastContext`     | Notifications temporaires (`role="status"`).                                                                                                                                                                                         |

**Requêtes** : une seule fonction `httpRequest` (`services/http.ts`) vérifie `response.ok`, transforme
les échecs en `HttpError` (code + message en français) et accepte un `AbortController`. Les requêtes
lancées dans un `useEffect` sont annulées au démontage. L'état de chargement est une **union
discriminée** (`idle | loading | success | error`) plutôt que plusieurs booléens.

**Pas de TanStack Query, Redux ni Zustand** : le besoin est petit (une requête de lecture, une
création), et les hooks de React suffisent. Le cours demande de savoir expliquer `useState`,
`useEffect`, `useRef` et `useContext` sur son propre code. Les explications de chaque hook sont dans
[`docs/ORAL.md`](docs/ORAL.md).

**Découpage du code** : la fiche produit (avec les 500 avis) est chargée à la demande
(`React.lazy` + `Suspense`), ce qui garde le fichier principal sous 500 Ko.

**Structure** :

```
src/
  app/          routeur, empilement des contextes
  pages/        une page par route
  components/   layout/, products/, home/, ui/ (composants génériques sans logique métier)
  contexts/     contextes + reducer des filtres
  hooks/        hooks maison (useProducts, useDebouncedValue, useLocalStorage, useFocusTrap…)
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
  récapitulatif construit à partir de la réponse de l'API. Le produit apparaît ensuite dans la boutique.
- États : chargement (squelettes), erreur avec « Réessayer », aucun résultat, aucun favori, produit
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
  (une fois par session, 20 s après l'arrivée, fermable après 3 s). Texte seulement, aucun lien ni
  image ; le message change toutes les 8 s sans jamais répéter le précédent (`useRandomAd`), avec une
  ville et un nombre tirés au hasard. « × » les masque jusqu'au rechargement ; un clic sur le bouton
  affiche « C'était une fausse pub ». Jamais avant la vérification d'âge, et pas d'`aria-live` pour ne
  pas les annoncer en boucle aux lecteurs d'écran.

- **Mode SFW / NSFW** (bouton « ● SFW » dans l'en-tête, SFW par défaut, choix mémorisé) : le passage
  en NSFW demande une confirmation (focus sur « Rester en SFW ») et n'est possible qu'après la
  vérification d'âge. En NSFW, les vraies photos produits (`nsfwImages`) s'affichent **floutées**
  avec « Contenu adulte · Afficher l'image », puis « Masquer » ; un bandeau propose « Tout afficher »
  et « Revenir en SFW ». Le texte alternatif reste neutre ; si une photo ne charge pas, l'image SFW
  la remplace. Les goodies sont identiques dans les deux modes. Un seul composant (`ProductImage`)
  connaît le mode.

**Bonus réalisés** : TypeScript, recherche automatique 300 ms après la dernière frappe (debounce),
déploiement Vercel (`vercel.json` réécrit toutes les routes vers `index.html`).

**Prévus ensuite (extras)** : newsletter, thème sombre.

## Limites et problèmes connus

- **L'endpoint Custom Response expire après 90 jours** : il faut alors le régénérer (voir Configuration).
- **Bug de cache CORS de DummyJSON** : les réponses Custom Response sont mises en cache 24 h avec
  l'autorisation CORS du _premier_ site qui les a demandées ; les autres sites étaient bloqués
  (« Impossible de joindre le serveur »). Contournement : l'adresse du site est ajoutée à l'URL
  (`?origin=…`), ce qui donne une entrée de cache par site.
- **Créations non persistées** : DummyJSON simule l'enregistrement ; les produits créés disparaissent
  au rechargement (autorisé par le cahier des charges).
- **DummyJSON renvoie toujours l'id 195** à la création : l'application donne au produit le premier
  id libre (195, 196…) pour que deux produits créés n'aient pas la même adresse. Le récapitulatif
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
