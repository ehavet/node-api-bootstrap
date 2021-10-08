ARG NODE_VERSION="14.4.0"

FROM ${IMAGE_REPO}node:${NODE_VERSION}-alpine AS build
ARG NPM_REGISTRY="https://registry.npmjs.org/"
ARG NPM_MAX_SOCKETS=50

COPY . /api
WORKDIR /api

ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY}
ENV NPM_CONFIG_STRICT_SSL=true
ENV NPM_CONFIG_MAXSOCKETS=${NPM_MAX_SOCKETS}

RUN npm ci && npm run build && npm prune --production

FROM ${IMAGE_REPO}node:${NODE_VERSION}-alpine AS run

RUN mkdir /api

COPY --from=build /api/dist /api/dist
COPY --from=build /api/node_modules /api/node_modules
COPY --from=build /api/package.json /api/package.json
COPY --from=build /api/db/sequelize /api/db/sequelize
COPY --from=build /api/.sequelizerc /api/.sequelizerc
WORKDIR /api

EXPOSE 8080
ENV API_PORT=8080
ENV NODE_ENV="production"
USER 65534

CMD [ "npm", "start" ]
