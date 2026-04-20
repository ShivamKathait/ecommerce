FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS builder
WORKDIR /app
COPY . .
ARG APP_NAME
RUN test -n "$APP_NAME"
RUN npx nx build "$APP_NAME"

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
ARG APP_NAME
CMD ["sh", "-c", "node dist/apps/${APP_NAME}/main.js"]
