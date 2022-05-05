
Le code contient 2 projets séparés :

-   client : le site Web fait avec le cadriciel(_framework_) **Angular**.
-   serveur : le serveur dynamique bâti avec la librairie **Express**.

# Commandes npm

Les commandes commençant par `npm` devront être exécutées dans les dossiers `client` et `server`. Les scripts non standard doivent être lancés en lançant `npm run myScript`.

## Installation des dépendances de l'application

1. Installer `npm`. `npm` vient avec `Node` que vous pouvez télécharger [ici](https://nodejs.org/en/download/)

2. Lancer `npm ci` (Continuous Integration) pour installer les versions exactes des dépendances du projet. Ceci est possiblement seulement si le fichier `package-lock.json` existe. Ce fichier vous est fourni dans le code de départ.

## Ajout de dépendances aux projets

Vous pouvez ajouter d'autres dépendances aux deux projets avec la commande `npm install nomDependance`.

Pour ajouter une dépendance comme une dépendance de développement (ex : librairie de tests, types TS, etc.) ajoutez l'option `--save-dev` : `npm install nomDependance --save-dev`.

Un ajout de dépendance modifiera les fichiers `package.json` et `package-lock.json`.

**Important** : assurez-vous d'ajouter ces modifications dans votre Git. N'installez jamais une dépendance du projet globalement.

# Client

## Développement local

Lorsque la commande `npm start` est lancée dans le dossier _/client_, le script suivant (disponible dans `package.json`) est exécuté : `ng serve --open` qu exécute les 2 étapes suivantes :

1. **Bundle generation** : Traduire le code TypeScript et la syntaxe Angular en JavaScript standard. À la fin de cette étape, vous verrez que les fichiers suivants sont générés : `vendor.js`,`polyfills.js`, `main.js`,`runtime.js` et `styles.css`. Ces fichiers continent le code de votre application ainsi que le CSS des différents Components.

    **Note** : ceci est un _build_ de développement : la taille des fichiers est très grande et le code n'est pas minifié. Vous pouvez accéder à votre code à travers les outils de développement de votre navigateur et déboguer avec des _breaking points_ par exemple. Une configuration de _debugger_ pour VSCode est également disponible. Voir la section _Debugger_ pour plus d'informations.

2. **Development Server** : un serveur web statique sera lancé sur votre machine pour pouvoir servir votre application web. Le serveur est lancé sur le port 4200 et est accessible à travers `http://localhost:4200/` ou `127.0.0.1:4200`. Une page web avec cette adresse s'ouvrira automatiquement.

    **Note** : le serveur de développement n'est accessible qu'à partir de votre propre machine. Vous pouvez le rendre disponible à tous en ajoutant `--host 0.0.0.0` dans la commande `npm start`. Le site sera donc accessible dans votre réseau local à partir de votre adresse IP suivie du port 4200. Par exemple : `132.207.5.35:4200`. Notez que le serveur de développement n'est pas fait pour un déploiement ouvert et vous recevrez un avertissement en le lançant.

### Génération de composants du client

Pour créer de nouveaux composants, nous vous recommandons l'utilisation d'angular CLI. Il suffit d'exécuter `ng generate component component-name` pour créer un nouveau composant.

Il est aussi possible de générer des directives, pipes, services, guards, interfaces, enums, modules, classes, avec cette commande `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Documentation du serveur

La documentation de votre serveur est disponible en format OpenAPI sur la route suivante : `/api/docs`
Pour y accéder, vous pouvez aller à `http://localhost:3000/api/docs` une fois le serveur démarré.

Cette page décrit les différentes routes accessibles sur le serveur ainsi qu'une possibilité de les tester en envoyer des requêtes au serveur. Vous n'avez qu'à choisir une des routes et appuyer sur le bouton "Try it out" et lancer la requête avec "Execute".

# Outils de développement et assurance qualité

## Tests unitaires et couverture de code

Les deux projets viennent avec des tests unitaires et des outils de mesure de la couverture du code.
Les tests se retrouvent dans les fichiers `*.spec.ts` dans le code source des deux projets. Le client utilise la librairie _Jasmine_ et le serveur utilise _Mocha_,_Chai_, _Sinon_ et _Supertest_.

Les commandes pour lancer les tests et la couverture du code sont les suivantes. Il est fortement recommandé de les exécuter souvent, s'assurer que vos tests n'échouent pas et, le cas échéant, corriger les problèmes soulevés par les tests.

-   Exécuter `npm run test` pour lancer les tests unitaires.

-   Exécuter `npm run coverage` pour générer un rapport de couverture de code.
    -   Un rapport sera généré dans la sortie de la console.
    -   Un rapport détaillé sera généré dans le répertoire `/coverage` sous la forme d'une page web. Vous pouvez ouvrir le fichier `index.html` dans votre navigateur et naviguer à travers le rapport. Vous verrez les lignes de code non couvertes par les tests.

## Linter et règles d'assurance qualité

Les deux projets viennent avec un ensemble de règles d'assurance qualité pour le code et son format. L'outil ESLint est un outil d'analyse statique qui permet de détecter certaines odeurs dans le code.

Les règles pour le linter sont disponibles dans le fichier `eslintrc.json` dans le dossier de chaque projet.

**Note** : un _linter_ ne peut pas prévenir toutes les odeurs de code possibles. Faites attention à votre code et utilisez des révisions manuelles par les pairs le plus possible.

Le _linter_ peut être lancé avec la commande `npm run lint`. La liste de problèmes sera affichée directement dans votre console.

**Note** : on vous recommande de lancer le _linter_ souvent lorsque vous écrivez du code. Idéalement, assurez-vous qu'il n'y a aucune erreur de lint avant de faire un _commit_ sur Git.

