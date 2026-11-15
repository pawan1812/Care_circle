# ==============================================================================
# CareCircle — Google Cloud Run Production Dockerfile
# Optimized multi-stage build: fast cold start, minimal footprint (<100MB)
# ==============================================================================

# Stage 1: Build Application Bundle
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy application sources
COPY . .

# Build production bundle
RUN npm run build

# ==============================================================================
# Stage 2: Production Runtime for Google Cloud Run
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Copy only the compiled dist bundle and lightweight Cloud Run server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.cjs ./server.cjs

# Cloud Run dynamic port exposure
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/healthz || exit 1

# Start production server
CMD ["node", "server.cjs"]

