FROM node:20-alpine AS base

# better-sqlite3 requires native build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY . .

# Data directory — mounted as a Fly volume for persistence
RUN mkdir -p /data

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/data/phenomenal.db

EXPOSE 3000

CMD ["node", "server/index.js"]
