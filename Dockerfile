# Dockerfile for pnpm

# Stage 1: Build the Nuxt app
FROM node:18-alpine AS builder
WORKDIR /app

# Install pnpm globally within the container
RUN npm install -g pnpm

# Copy only the files needed for dependency installation
# This leverages Docker's layer caching effectively
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm. --frozen-lockfile is the pnpm equivalent of npm ci
# It ensures a strict, reproducible install based on the lockfile.
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Set environment variables for the build
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Build the Nuxt application
RUN pnpm run build

# Stage 2: Create the final production image
FROM node:18-alpine
WORKDIR /app

# Install pnpm again for running the app (optional, but good practice)
RUN npm install -g pnpm

# Copy only the necessary production artifacts from the builder stage
COPY --from=builder /app/.output ./.output
# pnpm creates a non-flat node_modules, so we need to copy it
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# The command that will be run to start the server
CMD ["node", ".output/server/index.mjs"]