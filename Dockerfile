FROM node:14-alpine AS build
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . .
USER node
ARG CI_COMMIT_SHORT_SHA
ARG CI_COMMIT_MESSAGE
ARG CI_COMMIT_REF_NAME
ENV CI_COMMIT_SHORT_SHA=${CI_COMMIT_SHORT_SHA} \
    CI_COMMIT_MESSAGE=${CI_COMMIT_MESSAGE} \
    CI_COMMIT_REF_NAME=${CI_COMMIT_REF_NAME}
RUN npm set registry http://repositorio.agetic.gob.bo/nexus/repository/npmjs
RUN npm set strict-ssl false
RUN npm run build
RUN npm ci

FROM build AS production
WORKDIR /home/node/app
COPY --from=build --chown=node:node /home/node/app/dist .
USER node
RUN env
CMD ["node", "/home/node/app/dist/src/main.js"]
EXPOSE 3000

FROM build AS testing
WORKDIR /home/node/app
USER node
RUN env
CMD ["npm", "run", "start:dev"]
EXPOSE 3000

FROM build AS development
WORKDIR /home/node/app
USER node
RUN env
RUN echo "variables dev"
CMD ["npm", "run", "start:dev"]
EXPOSE 3000
