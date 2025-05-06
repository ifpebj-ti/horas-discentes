FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
# Vamos listar a raiz para ver se 'public' está em outro lugar
RUN echo "Conteúdo da raiz (/) antes da cópia do public:"
RUN ls -al /
RUN echo "Conteúdo de /app antes da cópia do public:"
RUN ls -al /app
RUN echo "Conteúdo da pasta public (se existir) em /app:"
RUN ls -al /app/public
COPY public ./public
RUN npm run build
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm install --production
RUN echo "Conteúdo de /app na etapa de produção:"
RUN ls -al /app
EXPOSE 3000
CMD ["npm", "start"]