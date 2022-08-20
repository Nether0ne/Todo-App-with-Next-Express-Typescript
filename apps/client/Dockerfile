FROM node:16.2.0

LABEL version "1.0"
LABEL description "Production client of Todo App"
LABEL maintainer "yanstoyanov2012@gmail.com"

WORKDIR /opt/app

RUN chown -R node:node /opt/app
USER node

COPY --chown=node:node package*.json ./
RUN npm install

COPY --chown=node:node . /opt/app
RUN npm run lint
RUN npm run build

ENV PORT 3000
ENV NODE_ENV production

EXPOSE 3000
CMD "npm" "start" 
