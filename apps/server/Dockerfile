FROM docker.io/node:22 as build

WORKDIR /app

# Copy root package.json and lockfile
COPY package.json ./
COPY package-lock.json ./
 
# Copy the elysia package.json
COPY apps/server/package.json ./apps/server/package.json

RUN npm install

COPY /apps/server/src ./apps/server/src
WORKDIR /app/apps/server

ENV NODE_ENV=production

RUN npm run build

FROM docker.io/oven/bun

WORKDIR /app

COPY --from=build  /app/apps/server/dist/ dist/
COPY --from=build /app/apps/server/package.json package.json

ENV NODE_ENV=production


CMD ["bun","run","prod"]

EXPOSE 3000