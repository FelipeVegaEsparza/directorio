# Etapa 1: Construir la aplicación
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Crear la imagen final de producción
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

# Instalar curl para los health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Configuración del Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD curl -f http://localhost:3001/health || exit 1

# Exponer el puerto en el que corre la aplicación
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD [ "node", "dist/index.js" ]
