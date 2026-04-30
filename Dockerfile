
#Это называется ступенчатая сборка



#Общая сборка - донор!
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build



#сборка dev
FROM node:20-alpine AS dev
WORKDIR /app
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
USER node
####
EXPOSE 3000
CMD ["npm", "run", "start:dev"]


#сборка прод
FROM node:20-alpine AS production
WORKDIR /app

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node --from=build /app/dist ./dist


#Это необходимо для безопасности!
# Создаём пользователя "node"
# чтобы не иметь root прав

USER node

####
EXPOSE 3000
CMD ["node", "dist/main.js"]