FROM node:14-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app && \
    mkdir -p /var/log/iop && chown -R node:node /var/log/iop
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm set registry http://repositorio.agetic.gob.bo/nexus/repository/npmjs
RUN npm set strict-ssl false
RUN npm ci
RUN npm run build
COPY --chown=node:node . .
EXPOSE 3000
CMD [ "node", "dist/src/main" ]

