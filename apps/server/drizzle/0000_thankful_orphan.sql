CREATE TABLE "audio_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "audio_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "audio_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"user" varchar(255) NOT NULL,
	"category" varchar(255),
	"uploaded" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"pw_hash" varchar(255) NOT NULL,
	"isAdmin" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "audio_uploads" ADD CONSTRAINT "audio_uploads_user_users_username_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("username") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "usernameUniqueIndex" ON "users" USING btree ("username");

--> statement-breakpoint
-- init admin user

INSERT INTO users (username,pw_hash,"isAdmin") values ('admin','24bc3216059bc114a6076fcac6b1dd46:f83ca9eb1dab8f026a36d3eed1cfe201aabb652afb02c38b5eb2a177de91d51e66011e21ecbc7f0470a97bb3b975f3b8f94c7a727e6fa33981f36e7885454621','TRUE');

-- init audio categories

INSERT INTO audio_categories ("name") values ('Music')
INSERT INTO audio_categories ("name") values ('Podcast')
INSERT INTO audio_categories ("name") values ('Nature')
INSERT INTO audio_categories ("name") values ('News')
INSERT INTO audio_categories ("name") values ('ASMR')