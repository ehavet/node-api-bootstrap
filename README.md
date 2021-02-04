# node-api-bootstrap

[![pipeline status](https://gitlab.com/appenin/falco-api/badges/master/pipeline.svg)](https://gitlab.com/%{project_path}/-/commits/%{default_branch})
[![coverage report](https://gitlab.com/appenin/falco-api/badges/master//coverage.svg)](https://gitlab.com/%{project_path}/-/commits/%{default_branch})

## Prerequisites

Before starting to work on the API, you will first need to install the following :

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (see [package.json](/package.json) "engine.node" field for the version to use, and we advise to manage NodeJS versions locally with [n](https://github.com/tj/n))
* [Docker](https://docs.docker.com/get-docker/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install)

And make sure that :

* You have been granted an access to the [Appenin falco-api gitlab repository](https://gitlab.com/appenin/falco-api)  
* You have [added your ssh key to gitlab](https://docs.gitlab.com/ee/ssh/)
* You have a `.env` file at the root of the project (you can take the `.env.example` as an example)
* You will need to use your own Stripe/HelloSign API Key and replace it in your `.env`. See `.env.example` for more details in order to set `FALCO_API_STRIPE_API_KEY`, `FALCO_API_HELLO_SIGN_API_KEY`, `FALCO_API_HELLO_SIGN_CLIENT_ID`      

## Installation

```bash
git clone git@gitlab.com:appenin/falco-api.git
cd node-api
yarn install --frozen-lockfile
```

## Usage

### Server

For the API to work properly, you need to have a database running. You can run one locally in Docker with the following command :

```bash
yarn containers:db:start
```

Then, you can launch the API :

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


If you already have launched the database locally and need to apply newly created migrations, run :

```bash
yarn db:migrate
```

Or 

```bash
yarn db:undo
```

if you need to revert the last migration

### Tests

The automated tests can be launched with the command :

```bash
yarn test
```

This will run all the automated tests and generate the appropriate coverage report.

Ah, by the way, you need to have the database running locally before launching the automated tests !

## Contributing

Please refer to [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for contribution guidelines.
