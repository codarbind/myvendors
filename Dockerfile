FROM node:20-alpine

WORKDIR /app

# Install only prod deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Build
RUN npm run build

# Limit memory (VERY important on low RAM)
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=256"

EXPOSE 3000

CMD ["node", "dist/main.js"]
