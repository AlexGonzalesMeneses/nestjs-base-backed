FROM node:14-alpine AS build
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . .
USER node
RUN npm set registry http://repositorio.agetic.gob.bo/nexus/repository/npmjs
RUN npm set strict-ssl false
RUN npm run build
RUN npm ci

FROM node:14-alpine AS production
WORKDIR /home/node/app
COPY --from=build /home/node/app/dist .
USER node
CMD [ "node", "/home/node/app/src/main" ] --only=production
EXPOSE 3000

FROM node:14-alpine AS testing
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --from=build --chown=node:node /home/node/app .
USER node
CMD ["npm", "run", "start:dev"]
EXPOSE 3000

FROM node:14-alpine AS development
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --from=build --chown=node:node /home/node/app .
USER node
CMD ["npm", "run", "start:dev"]
EXPOSE 3000
