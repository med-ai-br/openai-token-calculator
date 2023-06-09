FROM node:lts-alpine as build_dependencies
WORKDIR /app
COPY package.json .
RUN npm install

FROM node:lts-alpine as production_dependencies
ENV NODE_ENV=production
WORKDIR /app
COPY package.json .
RUN npm install

FROM node:lts-alpine as builder
WORKDIR /app
COPY --from=build_dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:lts-alpine as runtime
WORKDIR /app
COPY --from=production_dependencies /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY --from=builder /app/dist ./dist
ENTRYPOINT [ "node", "dist/index.js" ]