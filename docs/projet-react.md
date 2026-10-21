# Projet React

L'objectif de ce projet est de réaliser une interface qui utilise une API publique. Il doit être réalisé individuellement.

## Choix de l'API

Vous devez utiliser l'api [DummyJSON](https://dummyjson.com/) pour faire ce projet. C'est une API de données fictives qui permet de réaliser de nombreux types de projets, comme un livre de recettes, un faux réseau social, un faux site de commerce en ligne... ou même tout en même temps. Vous êtes libre de faire à peu près ce que vous voulez avec l'api donc soyez original et faites un projet qui vous plait.

## Cahier des charges

### Pages et navigation

- Une page d'accueil avec un en-tête et une navigation permettant d'accéder à la liste et aux éléments sauvegardés ;
- Une liste de plusieurs éléments, avec au minimum une image et trois informations textuelles pertinentes par carte.
- Une page de détail accessible depuis chaque carte, avec au moins cinq informations pertinentes sur l'élément, dont au moins deux qui ne figurent pas sur la carte ;
- Une page pour visualiser les éléments sauvegardés ;
- La page de détail et la page des éléments sauvegardés doivent avoir des URL distinctes. La navigation entre les pages doit se faire dans l'application. L'accès direct à une URL et le rechargement d'une page doivent fonctionner.

### Recherche, filtres et pagination

- La liste doit être paginée, avec des commandes permettant de changer de page et une indication de la page courante ;
- Un formulaire de recherche avec un champ de saisie stylisé et au moins deux filtres distincts, adaptés aux données de l'API ;
- Le texte de recherche et les deux filtres doivent pouvoir être utilisés simultanément : chaque résultat doit respecter tous les critères sélectionnés ;
- La pagination doit s'appliquer aux résultats de la recherche et des filtres. La recherche et les filtres doivent porter sur l'ensemble des résultats concernés, pas uniquement sur les éléments de la page visible ;
- Toute modification de la recherche ou d'un filtre doit ramener à la première page des résultats ;
- Les critères de recherche et de filtrage doivent être conservés dans un contexte React pendant la navigation, notamment lors d'un aller-retour entre la liste et une fiche de détail. Leur conservation après un rechargement du navigateur n'est pas obligatoire.

Vous pouvez effectuer la recherche, le filtrage et la pagination côté API ou côté client, selon les possibilités de l'API. Vous devrez expliquer ce choix à l'oral.

Pour le contexte React, vous pouvez consulter cette documentation : <https://react.dev/learn/scaling-up-with-reducer-and-context>. L'utilisation de `useReducer` présentée dans cet exemple n'est pas obligatoire.

### Éléments sauvegardés

- On doit pouvoir ajouter et retirer des éléments sauvegardés dans l'application : mettre un livre en favori, sauvegarder une recette etc. ;
- Un même élément ne doit pas être ajouté plusieurs fois ;
- Les éléments sauvegardés doivent être conservés dans le `localStorage` et restaurés après un rechargement de la page ou une nouvelle ouverture de l'application ;
- La page des éléments sauvegardés doit permettre de consulter leurs fiches de détail et de les retirer de la sélection.

### Création d’un élément avec un formulaire

- Un formulaire de création doit être accessible depuis l’application, avec des champs adaptés aux éléments manipulés : produit, recette, publication, etc. ;
- Les champs doivent être contrôlés avec React. Les champs obligatoires et les formats attendus doivent être vérifiés avant l’envoi, avec des messages de validation compréhensibles ;
- La soumission doit envoyer une requête `POST` à l’endpoint de création correspondant dans DummyJSON, avec les données du formulaire au format JSON et le header `Content-Type: application/json` ;
- Pendant l’envoi, affichez un indicateur et désactivez le bouton de soumission pour éviter les envois multiples ;
- Vérifiez le succès de la réponse HTTP. En cas d’échec, affichez un message et permettez de réessayer sans perdre les valeurs saisies ;
- En cas de succès, affichez une confirmation et les informations de l’élément créé à partir de la réponse de l’API.

DummyJSON simule les créations, modifications et suppressions sans les enregistrer sur le serveur. Utilisez les réponses de l’API pour mettre à jour l’état local de l’interface ; ces changements n’ont pas à être conservés après un rechargement. Cette limite concerne aussi le bonus CRUD. Voir les exemples de [création, modification et suppression de produits](https://dummyjson.com/docs/products#products-add).

### Interface et gestion des états

- L'interface doit être responsive et utilisable sur mobile comme sur ordinateur, sans débordement horizontal gênant ;
- Un indicateur de chargement doit être affiché pendant la récupération des données ;
- En cas d'échec d'une requête, un message compréhensible doit être affiché et l'utilisateur doit pouvoir réessayer ;
- Un message adapté doit être affiché lorsqu'une recherche ne renvoie aucun résultat ou lorsqu'aucun élément n'a encore été sauvegardé ;
- Les champs de formulaire doivent avoir des labels associés, les images informatives des textes alternatifs pertinents et les actions être accessibles au clavier avec un focus visible.

### Qualité du code

- Vous devez utiliser un linter, par exemple ESLint, et un outil de formatage du code, par exemple Prettier ;
- Le lint et la vérification du formatage doivent passer sans erreur au moment du rendu.

## Bonus

Les bonus sont facultatifs. Ils ne dispensent pas de respecter les exigences obligatoires.

- Un CRUD complet (Create, Read, Update, Delete) : complétez la lecture avec `GET` et la création avec `POST` par un formulaire de modification prérempli utilisant `PUT` ou `PATCH`, et une action de suppression utilisant `DELETE`, avec confirmation avant suppression. Gérez les états d’envoi, de succès et d’erreur, puis mettez à jour l’interface après chaque opération réussie ;
- Un dark sombre dont le thème est partagé par un contexte React et sauvegardé dans le `localStorage`, puis restauré à l'ouverture de l'application ;
- Une recherche automatique déclenchée après un délai sans nouvelle saisie, par exemple 300 ms. Chaque nouveau caractère doit relancer ce délai afin d'éviter un appel à chaque frappe ;
- Un projet en TypeScript ;
- Publier votre projet sur [Vercel](https://vercel.com/home) ;

Évidemment, si vous pouvez aller au-delà du cahier des charges, faites-le.

## Stack

Vous pouvez faire le projet en JavaScript ou en TypeScript.

Vous pouvez utiliser Tailwind à la place du CSS classique.

Vous êtes libres d'utiliser des bibliothèques de composants comme [shadcn/ui](https://ui.shadcn.com/), [React Aria](https://react-aria.adobe.com/), [Material UI](https://mui.com/material-ui/)...

Vous pouvez utiliser [TanStack](https://tanstack.com/) pour gérer les requêtes et les données de l'API, ou réaliser vos appels avec `fetch` et les hooks React.

Vous pouvez utiliser [Redux](https://redux.js.org/) ou [Zustand](https://zustand.docs.pmnd.rs/) seulement si vous maîtrisez les contextes React.

Si vous utilisez ces bibliothèques, vous devez être capables de justifier leur utilité dans votre projet et d'expliquer leur fonctionnement.

## Utilisation de l'IA

Vous pouvez utiliser l'IA pour vous aider à comprendre une notion, générer des maquettes, corriger du texte ou écrire du code.

Si vous n'avez pas la fibre artistique, vous pouvez utiliser des outils d'IA pour générer des maquettes avant de commencer, par exemple [Stitch](https://stitch.withgoogle.com/).

## À savoir pour l'oral

Vous devez connaître les hooks suivants : `useState`, `useEffect`, `useRef`, `useContext`, et être capables d'expliquer ceux utilisés dans votre projet.

Je vous interrogerai sur votre code et sur vos choix d'architecture et d'implémentation.

Une courte modification du code pourra vous être demandée pour vérifier votre compréhension.

## Notation

Le projet est évalué sur 20 points, avant l'ajout éventuel des bonus.

| Catégorie | Critères | Points |
| --- | --- | --- |
| Respect du cahier des charges | Le cahier de charge est implémenté dans son intégralité (hors bonus) | /5 |
| Qualité du code | Découpage en composants et organisation ; utilisation appropriée des hooks et gestion de l'état ; gestion des requêtes et des erreurs ; configuration et utilisation du linter et du formateur | /5 |
| Oral | Compréhension du code et des hooks ; justification des choix techniques ; capacité à expliquer comment adapter le code ; identification des limites du projet | /5 |
| Qualité de l'interface | Cohérence visuelle et lisibilité ; ergonomie de la navigation et des actions ; adaptation mobile et ordinateur ; accessibilité demandée ; présentation claire des états de chargement, d'erreur et des listes vides | /5 |

## Livrables

Le projet doit être déposé sur GitHub. Le lien du dépôt doit être rendu sur Cesar.

Le dépôt doit contenir le code source et un README précisant :

- Le sujet du projet et l'API utilisée ;
- Les prérequis et les commandes d'installation et de lancement ;
- La configuration nécessaire, notamment les éventuelles variables d'environnement ;
- Les principaux choix techniques et les bibliothèques utilisées ;
- Les fonctionnalités réalisées, les bonus et les limites ou problèmes connus ;
- Les outils d'IA utilisés et leurs usages, ou l'absence d'utilisation de l'IA ;
- Le lien de l'application déployée, si vous réalisez le bonus de publication.

Le projet doit pouvoir être installé et lancé en suivant uniquement les instructions du README.
