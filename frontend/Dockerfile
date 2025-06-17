# Stage 1: Build the Vite app
FROM node:18-alpine AS build

WORKDIR .

# Install dependencies
COPY package.json package-lock.json* tsconfig.json* ./ 
COPY public ./public
COPY src ./src

RUN npm install

COPY . .
RUN npm run build

# --- Production stage ---
FROM nginx:stable-alpine as production
COPY --from=build ./build /usr/share/nginx/html
