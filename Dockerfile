
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
FROM node:20-alpine AS development
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p logs uploads dist

COPY docker-entrypoint.dev.sh /usr/local/bin/docker-entrypoint.dev.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.dev.sh

EXPOSE 3333
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.dev.sh"]


#сборка прод
FROM node:20-alpine AS production
WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/
RUN npm ci --omit=dev && npx prisma generate && npm cache clean --force
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/src/generated ./src/generated


#Это необходимо для безопасности!
# Создаём пользователя "node"
# чтобы не иметь root прав

USER node

####
EXPOSE 3000
CMD ["node", "dist/main.js"]