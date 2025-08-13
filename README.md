# Audio File hosting App

This Repo contains the Audio file hosting App

## Running the App

This Repo uses Turbo. To start with Turbo, follow the [instructions](https://turborepo.com/docs/getting-started/installation) to install turbo.

Once that is done, run `npm i` to install dependencies

set the `.env` files in `/apps/server` and `/apps/web/` to the desired value.

Finally, run `turbo dev` in the root directly, and all services should be running!

## Running in Docker-compose

The services are self-encapsulated. Just run `docker-compose build && docker-compose run` to start all the services.

However, the DB will have to be seeded. The database init scripts are in `/scripts/db_init.sql`

Alternatively, you can run `npx drizzle-kit migrate` in the `/apps/server` to push the migration scripts to the database

## Using the application

The application can be accessed at http://localhost:8080/web, and a default credential of admin:admin is available for use