FROM node:20-alpine

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=256"

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copy only compiled output
COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
