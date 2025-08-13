FROM docker.io/node:22 as build
WORKDIR /app
# Copy root package.json and lockfile
COPY package.json ./
COPY package-lock.json ./
 
# Copy the react package.json
COPY apps/web/package.json ./apps/web/package.json

RUN npm install
COPY . .
WORKDIR /app/apps/web
RUN npm run build

FROM docker.io/caddy:2.10
COPY --from=build /app/apps/web/build /srv/web/
COPY apps/webserver/Caddyfile /etc/caddy/Caddyfile
EXPOSE 8080
CMD ["caddy","run","--config", "/etc/caddy/Caddyfile" ]