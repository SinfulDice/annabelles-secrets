# SPEC — Annabelle's Secrets

Source de vérité du projet. Chaque règle a un numéro (`R12`) repris dans les tests.
**[V1]** = obligatoire (cahier des charges, bloc 1). **[EX]** = extra (bloc 2, dans l'ordre de la section).
Références : `docs/projet-react.md` (cahier des charges), `docs/PROMPT_CLAUDE_CODE.md` (prompt), maquettes `docs/*.png`.

## 0. Décisions générales

- R1 [V1] Quand la maquette et les données se contredisent (nombre d'avis, remise, stock, caractéristiques), **les données de `products.json` font foi** ; la maquette sert pour le visuel.
- R2 [V1] Stack : Vite + React + TypeScript `strict` (aucun `any`, aucun `@ts-ignore`), Tailwind CSS v4, React Router (mode data), `fetch` + hooks maison. Pas de TanStack / Redux / Zustand.
- R3 [V1] `npm run lint`, `format:check`, `typecheck`, `test` et `build` passent sans erreur ni warning avant chaque commit.
- R4 [V1] Tests automatiques avec **Vitest** sur les fonctions pures (utils, reducers) ; chaque test cite le numéro de règle.
- R5 [V1] Favicon : « A. » bordeaux `#8A2846` sur un rond rose pâle `#F3E3E8`, en SVG (`/favicon.svg`) + PNG 32×32 et `apple-touch-icon` 180×180.
- R6 [V1] Code et identifiants en anglais, textes d'interface en français. Clés `localStorage` préfixées `annabelle:` et centralisées dans `STORAGE_KEYS`.
- R7 [V1] Titre d'onglet mis à jour à chaque route : « Page – Annabelle's Secrets ».
- R8 [V1] Toute URL inconnue affiche une page 404 avec un lien vers l'accueil.
- R9 [V1] Déploiement Vercel ; `vercel.json` réécrit toutes les routes vers `index.html` (accès direct et rechargement fonctionnent).

## 1. Données et requêtes

- R10 [V1] La liste vient de `VITE_PRODUCTS_URL` (DummyJSON Custom Response). Si la variable est absente, l'app affiche une erreur claire au lieu de planter. Un `.env.example` est fourni. L'URL reçoit `?origin=<adresse du site>` pour contourner le cache CORS de DummyJSON (décision du 2026-10-21).
- R11 [V1] Les 45 produits sont chargés **une seule fois** ; l'app n'importe jamais `data/products.json` (copie de sauvegarde seulement).
- R12 [V1] `httpRequest<T>()` vérifie `response.ok` ; sinon il lève une `HttpError` avec le code HTTP et un message en français.
- R13 [V1] Les requêtes lancées dans un `useEffect` sont annulées (`AbortController`) au démontage ; une annulation n'est pas affichée comme une erreur.
- R14 [V1] `useProducts()` expose un état en union discriminée `idle | loading | success | error`, et une fonction `retry`.
- R15 [V1] Catégories `femme | homme | goodies`, affichées « Femme », « Homme », « Goodies ».
- R16 [V1] Les prix sont formatés en euros à la française (`89,00 €`) via `Intl.NumberFormat('fr-FR')`.

## 2. Recherche, filtres, tri, pagination (côté client)

- R20 [V1] La recherche ignore la casse et les accents, et porte sur `title`, `brand`, `type`, `material`.
- R21 [V1] Filtre catégorie : Tous / Femme / Homme / Goodies.
- R22 [V1] Filtre type : liste déduite des données, limitée à la catégorie choisie ; changer de catégorie remet le type à « Tous les types » si le type n'existe plus dans cette catégorie.
- R23 [V1] Filtre prix maximum : Tous, ≤ 30 €, ≤ 50 €, ≤ 80 €, ≤ 120 €.
- R24 [V1] Case « Étanche uniquement ».
- R25 [V1] Tri : mieux notés (défaut), prix croissant, prix décroissant, nouveautés (id décroissant).
- R26 [V1] Tous les critères se cumulent (ET logique) et portent sur **toute** la liste, jamais seulement la page visible.
- R27 [V1] 12 produits par page ; Précédent / numéros / Suivant ; « Page X sur Y » ; bouton courant avec `aria-current="page"` ; Précédent désactivé en page 1, Suivant sur la dernière.
- R28 [V1] **Toute modification d'un critère remet la page à 1**, garanti par le reducer des filtres.
- R29 [V1] Les critères vivent dans `FiltersContext` et sont conservés lors d'un aller-retour liste ↔ fiche (pas après rechargement).
- R30 [V1] La page demandée est ramenée dans les bornes si elle dépasse le nombre de pages (ex. après une suppression).
- R31 [V1] Recherche automatique 300 ms après la dernière frappe (`useDebouncedValue`) ; chaque frappe relance le délai.
- R32 [V1] Chips « Filtres actifs » : un clic retire le critère ; bouton « Réinitialiser les filtres ».
- R33 [V1] Compteur de résultats annoncé (`aria-live="polite"`).

## 3. Boutique (`/produits`)

- R40 [V1] Carte : image (`alt` pertinent), catégorie, type, nom (lien vers la fiche), prix, note, bouton favori (`aria-pressed`, `aria-label` explicite). Goodies sur fond beige `#EDE6DC`.
- R41 [V1] Chargement : skeletons + « Chargement des produits… » (`role="status"`).
- R42 [V1] Erreur : message compréhensible + bouton « Réessayer » qui relance la requête.
- R43 [V1] Aucun résultat : message, rappel des critères, bouton de réinitialisation.

## 4. Fiche produit (`/produits/:id`)

- R50 [V1] Affiche : retour aux résultats (filtres et page conservés), fil d'Ariane, galerie, catégorie, type, nom, marque, SKU, note + nombre d'avis, prix, disponibilité, description, bouton favori, caractéristiques (matériau, dimensions, poids, étanchéité, autonomie, niveau sonore, garantie, expédition, retour).
- R51 [V1] Prix barré et pourcentage de remise seulement si `discountPercentage > 0` ; prix d'origine = `price / (1 - remise/100)` arrondi au centime.
- R52 [V1] Les champs `null` (autonomie, niveau sonore) ne sont pas affichés ; « Tailles disponibles » seulement si `sizes` existe.
- R53 [V1] États : chargement, produit introuvable (id inconnu ou invalide), accès direct à l'URL.
- R54 [V1] Avis : `getProductReviews(product, allReviews)` est **déterministe** (même id → mêmes avis, générateur `mulberry32(id)`, jamais `Math.random`).
- R55 [V1] Pool d'avis `goodies` pour les goodies, `toy` sinon.
- R56 [V1] Entre 4 et 12 avis par produit, sans doublon.
- R57 [V1] Les notes des avis suivent la note du produit (ex. 4,6 → surtout des 5 et des 4).
- R58 [V1] Avis triés par date décroissante ; affichage du nombre, de la moyenne réelle, filtre « Toutes / 5★ / 4★ / 3★ et moins », badge « Achat vérifié ».

## 5. Favoris (`/favoris`)

- R60 [V1] Ajouter / retirer un favori depuis la carte et la fiche ; un même produit n'est jamais en double.
- R61 [V1] Favoris stockés dans `localStorage` (`annabelle:favorites`) et restaurés au démarrage ; une valeur corrompue donne une liste vide sans planter.
- R62 [V1] On stocke un instantané (id, titre, type, catégorie, prix, note, thumbnail) : la page s'affiche même si l'API est indisponible.
- R63 [V1] Page : image, infos, « Voir la fiche », « Retirer », « Tout retirer » ; état vide avec lien vers la boutique.
- R64 [V1] Compteur de favoris dans l'en-tête ; toast à l'ajout et au retrait (`role="status"`).

## 6. Création (`/produits/nouveau`)

- R70 [V1] Formulaire contrôlé : nom*, catégorie*, type*, marque, prix*, remise %, stock*, matériau, étanche, description*, URL d'image.
- R71 [V1] `validateProductForm` : champs obligatoires remplis ; prix nombre > 0 (virgule acceptée) ; remise 0–90 ; stock entier ≥ 0 ; description ≥ 20 caractères (compteur affiché) ; URL vide ou commençant par `https://`.
- R72 [V1] Erreurs sous chaque champ (`aria-invalid`, `aria-describedby`) + résumé en tête (`role="alert"`) qui reçoit le focus après une soumission invalide.
- R73 [V1] Envoi : `POST https://dummyjson.com/products/add`, JSON, header `Content-Type: application/json`.
- R74 [V1] Pendant l'envoi : bouton désactivé, spinner, « Envoi en cours… », champs en lecture seule ; impossible d'envoyer deux fois.
- R75 [V1] Échec : message avec le code HTTP, valeurs conservées, « Réessayer l'envoi ».
- R76 [V1] Succès : confirmation + récapitulatif construit à partir de la **réponse de l'API** (id inclus), « Voir la fiche », « Créer un autre produit ».
- R77 [V1] Le produit créé (flag `isLocal: true`) apparaît dans la boutique et sa fiche jusqu'au rechargement.
- R78 [V1] DummyJSON renvoie toujours l'id 195 : le produit créé garde l'id de la réponse s'il est libre, sinon il prend le premier id libre au-dessus (deux produits créés n'ont jamais la même adresse). Les champs absents de la réponse (type, matériau, étanche) sont repris du formulaire. (Décision du 2026-10-21.)
- R79 [V1] Un produit créé n'a ni note ni avis : « Pas encore noté », « Aucun avis pour le moment » ; ses caractéristiques inconnues (dimensions, poids, garantie…) ne sont pas affichées ou valent « Non renseignée ». (Décision du 2026-10-21.)

## 7. Mise en page, responsive, accessibilité

- R80 [V1] En-tête : logo, navigation (Accueil, Boutique, Femme, Homme, Goodies), favoris avec compteur, compte, bascules ; menu burger sur mobile (sauf logo et favoris).
- R81 [V1] Les liens Femme / Homme / Goodies et les tuiles d'accueil règlent la catégorie dans le contexte puis ouvrent `/produits`.
- R82 [V1] Accueil : hero, engagements, tuiles d'univers, 4 produits les mieux notés, les 5 goodies, bloc newsletter.
- R83 [V1] Aucun débordement horizontal de 320 px à 1440 px ; grille 2 colonnes sur mobile ; filtres secondaires derrière « Plus de filtres ».
- R84 [V1] Tous les champs ont un label ; radios et cases groupées dans `fieldset` + `legend`.
- R85 [V1] Focus visible partout, navigation complète au clavier, lien « Aller au contenu ».
- R86 [V1] Boutons icônes avec `aria-label` ; SVG décoratifs en `aria-hidden` ; contraste ≥ 4.5:1.
- R87 [V1] Vérification d'âge : modale bloquante (`role="dialog"`, `aria-modal`, focus piégé, focus initial sur « Entrer »), choix mémorisé dans `localStorage`, « Quitter » sort du site.

## 8. README et oral

- R90 [V1] README en français : encadré admin en tête (si le compte existe), sujet et API, prérequis (Node 24), installation, configuration, choix techniques, bibliothèques, fonctionnalités, bonus, limites, usage de l'IA, lien Vercel.
- R91 [V1] `docs/ORAL.md` : pour chaque hook, où, pourquoi, et ce qui se passerait sans lui ; questions probables du prof avec réponses.

## 9. Extras (dans cet ordre, seulement après le bloc V1 commité)

### Compte et admin

- R100 [EX] Au premier lancement, un compte admin est créé (`admin@annabelles-secrets.fr` / `P4ssw0rd`) s'il n'existe pas ; il ne peut pas être supprimé.
- R101 [EX] Inscription : prénom*, nom, e-mail*, mot de passe* (8 caractères min. dont un chiffre), confirmation*, date de naissance* (18 ans min.), case newsletter. Un seul compte client par navigateur.
- R102 [EX] Connexion par e-mail + mot de passe ; message d'erreur générique en cas d'échec ; session dans `annabelle:session`.
- R103 [EX] Profil : infos, mot de passe masqué / affiché, modifier, se déconnecter, supprimer (avec confirmation).
- R104 [EX] Mot de passe stocké en clair (faille volontaire, signalée dans le README) ; bandeau « N'utilisez jamais un vrai mot de passe ici ».
- R105 [EX] Onglets accessibles « Se connecter » / « Créer un compte » (flèches clavier).
- R106 [EX] `RequireAdmin` protège création et modification ; non-admin → écran « Réservé à l'administratrice » + connexion puis retour à la page demandée. « Ajouter un produit », Modifier et Supprimer ne sont visibles que pour l'admin.
- Note : depuis ce bloc (2026-10-21), la création (R70–R79) est réservée à l'admin.

### Modification et suppression

- R110 [EX] Formulaire prérempli (`ProductForm` partagé), `PUT /products/{id}`, mêmes états que la création ; de la réponse on ne garde que le statut et les champs envoyés.
- R111 [EX] Suppression avec modale de confirmation (`role="alertdialog"`, focus sur « Annuler », Échap ferme), `DELETE`, toast puis redirection vers `/produits`.
- R112 [EX] Produit local (`isLocal`) : modification / suppression appliquées localement sans appel réseau.
- R113 [EX] Supprimer un produit le retire aussi des favoris.

### Fausses publicités

- R120 [EX] Les encarts sont en texte seulement, sans lien réel ; étiquette « Pub » et mention « Publicité parodique ». (Seule la blague R126 montre une image.)
- R121 [EX] `fillAdTemplate` remplace `{ville}` (liste de villes) et `{n}` (entier entre 3 et 27).
- R122 [EX] `useRandomAd` change de message toutes les 8 s, jamais deux fois le même d'affilée ; intervalle nettoyé au démontage.
- R123 [EX] Formats `AdBanner`, `AdSquare`, `AdPopup` (une fois par session, après 20 s, fermable après 3 s).
- R124 [EX] « × » masque l'encart jusqu'au rechargement ; le bouton d'action lance la blague R126.
- R126 [EX] (Décision du 2026-10-21, à la demande de Pierre-Antoine.) Un clic sur le bouton d'une pub affiche d'abord une **fausse** demande d'accès à la caméra, imitant celle des navigateurs (« <site> souhaite : Utiliser vos caméras », Autoriser / Bloquer, Échap = Bloquer). L'application n'appelle **jamais** la vraie caméra. Quelle que soit la réponse, une fenêtre montre ensuite un GIF des Muppets et « C'était une fausse pub », puis se ferme.
- R125 [EX] Jamais de pub avant la vérification d'âge ; pas d'`aria-live` sur la rotation.

### Mode SFW / NSFW

- R130 [EX] `ContentModeContext`, SFW par défaut, persistant (`annabelle:content-mode`).
- R131 [EX] Passage en NSFW seulement après la vérification d'âge, via une modale de confirmation (focus sur « Rester en SFW »).
- R132 [EX] NSFW : `nsfwImages` floutées par défaut, bouton « Afficher l'image » / « Masquer », « Tout afficher » ; crédit « Photo : … sur Unsplash ».
- R133 [EX] Seul `ProductImage` connaît le mode ; goodies identiques dans les deux modes ; repli sur la thumbnail si l'image ne charge pas.

### Newsletter

- R140 [EX] Inscription : prénom, e-mail* (validé), intérêts, fréquence, consentement 18+ obligatoire ; e-mail déjà inscrit → préférences mises à jour et message.
- R141 [EX] Désinscription : e-mail* + raison ; « Adresse introuvable » si absent ; « Annuler et me réabonner ».
- R142 [EX] Latence simulée de 600 ms ; e-mail prérempli si connecté ; stockage `annabelle:newsletter`.

### Thème sombre

- R150 [EX] `ThemeContext`, stocké dans `annabelle:theme`, par défaut `prefers-color-scheme`, classe `dark` sur `<html>`, palette de la maquette 13.

## Plus tard (hors délai)

- `POST /users/add` à l'inscription pour simuler un serveur.
