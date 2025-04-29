FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
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