FROM hub.agcs.agetic.gob.bo/dockerhub-proxy/library/node:16 AS build
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node . .

USER node
RUN npm set registry https://registry.agcs.agetic.gob.bo/
RUN npm set strict-ssl false

RUN npm ci --legacy-peer-deps     
RUN npm run build 
RUN npm ci --production --no-optional --legacy-peer-deps

FROM hub.agcs.agetic.gob.bo/dockerhub-proxy/library/node:16-alpine AS release
RUN mkdir -p /home/node/app/node_modules && mkdir -p /home/node/app/dist  && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY  --from=build --chown=node:node /home/node/app/node_modules ./node_modules
COPY  --from=build --chown=node:node /home/node/app/dist ./dist

USER node
ARG CI_COMMIT_SHORT_SHA
ARG CI_COMMIT_MESSAGE
ARG CI_COMMIT_REF_NAME
ENV CI_COMMIT_SHORT_SHA=${CI_COMMIT_SHORT_SHA} \
    CI_COMMIT_MESSAGE=${CI_COMMIT_MESSAGE} \
    CI_COMMIT_REF_NAME=${CI_COMMIT_REF_NAME}

CMD  ["sh", "-c",  "node dist/main"]
EXPOSE 3000
