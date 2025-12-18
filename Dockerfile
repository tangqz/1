
# 1. Base image
FROM node:20-alpine AS base

# 2. Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Install dependencies, including devDependencies for build (like prisma)
RUN npm ci

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# 4. Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment if you want to disable Next.js telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# We also need prisma schema and migrations for production usage if we run migrations on start
COPY --from=builder /app/prisma ./prisma
# Copy .env file if it's not managed by Docker env vars (optional, usually better to inject)
# COPY .env .env

USER nextjs

EXPOSE 3000

ENV PORT=3000
# Ensure hostname is set for correct listening
ENV HOSTNAME="0.0.0.0"

# Command to run the app
# Note: For SQLite, we might need to ensure the DB file exists or migrate.
# Ideally, migration happens in a separate init container or via a startup script.
# Here we can chain commands, but server.js is the entrypoint.
CMD ["node", "server.js"]
