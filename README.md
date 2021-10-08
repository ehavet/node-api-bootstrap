# node-api-bootstrap

## Prerequisites

### Tools

To work on the API, you will first need to install the following :

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (see [package.json](/package.json) "engine.node" field for the version to use, and we advise to manage NodeJS versions locally with [n](https://github.com/tj/n))
* [Docker](https://docs.docker.com/get-docker/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install)

### Environment variables

Create a `.env` file in the root directory. You can take the `.env.example` as an example.

## Installation

```bash
yarn install --frozen-lockfile
```

## Usage

### Server

launch the API :

```bash
yarn start
```
Or
```
yarn dev
```

to start with watch mode. This can be convenient in development mode to avoid restarting manually the server after each modification in the code.

The API can be accessed at [http://localhost:8080](http://localhost:8080)

For the API documentation, go to [http://localhost:8080/documentation](http://localhost:8080/documentation)

### Tests

The automated tests can be launched with the command :

```bash
yarn test
```

This will run all the automated tests and generate the appropriate coverage report.

## Contributing

Please refer to [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for contribution guidelines.