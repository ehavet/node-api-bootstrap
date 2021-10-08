# node-api-bootstrap

## Prérequis

### Outils

Installer les outils suivants :

* [Git](https://git-scm.com/book/fr/v2/D%C3%A9marrage-rapide-Installation-de-Git)
* [Node.js](https://nodejs.org/fr/download/package-manager/)
* [Yarn](https://yarnpkg.com/getting-started/install)

### Variables d'environnement

Créer un fichier `.env` à la racine du projet. Vous pouvez prendre exemple sur `.env.example`.

## Installation

```bash
yarn install --frozen-lockfile
```

## Lancement

```bash
yarn start
```
ou
```
yarn dev
```

Pour lancer l'API en mode watch afin d'éviter d'avoir a redémarrer le serveur à chaque modification du code.

Une fois lancée l'API est accessible ici => [http://localhost:8080](http://localhost:8080)

Pour accéder à la documentation => [http://localhost:8080/documentation](http://localhost:8080/documentation)

## Tests

```bash
yarn test
```