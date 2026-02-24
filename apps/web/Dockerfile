FROM node:20-alpine AS base

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Copy Prisma schema before npm ci (postinstall needs it for prisma generate)
COPY prisma ./prisma
COPY prisma.config.ts ./

# Install dependencies (postinstall will run prisma generate)
RUN npm ci

# Copy the rest of the source
COPY . .

# Expose port
EXPOSE 3000

# Development mode
CMD ["npm", "run", "dev"]
