FROM node:14-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app && \
    mkdir -p /var/log/iop && chown -R node:node /var/log/iop
WORKDIR /home/node/app
COPY --chown=node:node . .
# COPY package*.json ./
USER node
RUN npm set registry http://repositorio.agetic.gob.bo/nexus/repository/npmjs
RUN npm set strict-ssl false
RUN npm ci
RUN npm run build
RUN ls -la
RUN pwd
RUN ls -la /home/node/app/dist/src

EXPOSE 3000
CMD [ "node", "/home/node/app/dist/src/main" ]

