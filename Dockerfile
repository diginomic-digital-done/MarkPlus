# ---------- Builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# Install system dependencies for native modules
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# ---------- Runner ----------
FROM node:22-alpine AS runner
WORKDIR /app

# Set env
ENV NODE_ENV=production
ENV PORT=3000

# Copy only the needed output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "run", "start"]
