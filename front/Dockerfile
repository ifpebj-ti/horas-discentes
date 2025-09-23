# Etapa de build
FROM node:22-alpine AS builder
WORKDIR /app

# Versionamento no container final
ARG VERSION=dev
ENV NEXT_PUBLIC_VERSION=$VERSION

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV NEXT_PUBLIC_VERSION=$NEXT_PUBLIC_VERSION

# Etapa de produção
FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
