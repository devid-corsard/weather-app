# BUILD
FROM node:20-alpine As build
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build
USER node

# PREPARE
FROM node:20-alpine As prepare
WORKDIR /app
COPY --chown=node:node package*.json ./
ENV NODE_ENV production
RUN npm ci --omit=dev && npm cache clean --force
USER node

# RUN
FROM node:20-alpine As production
WORKDIR /app
COPY --chown=node:node --from=prepare /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
ENV NODE_ENV production
ENTRYPOINT [ "node", "dist/main.js" ]
