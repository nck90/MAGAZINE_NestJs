# Base Image
FROM node:22-alpine AS builder

# Create app directory
WORKDIR /app

# Install dependencies (Prisma needs openssl)
RUN apk add --no-cache openssl libc6-compat

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production Image
FROM node:22-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache openssl libc6-compat

# Copy from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Start the application
CMD npx prisma migrate deploy && npm run start:prod
