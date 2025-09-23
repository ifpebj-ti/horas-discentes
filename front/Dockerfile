# Etapa de build
FROM node:22-alpine AS builder
WORKDIR /app

# Versionamento no container final
ARG VERSION=dev
ARG REVISION=local
ARG BUILDTIME=dev

ENV NEXT_PUBLIC_VERSION=$VERSION
ENV NEXT_PUBLIC_REVISION=$REVISION
ENV NEXT_PUBLIC_BUILDTIME=$BUILDTIME

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de produção
FROM node:22-alpine AS production
WORKDIR /app

ENV NEXT_PUBLIC_VERSION=$VERSION
ENV NEXT_PUBLIC_REVISION=$REVISION
ENV NEXT_PUBLIC_BUILDTIME=$BUILDTIME
ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
