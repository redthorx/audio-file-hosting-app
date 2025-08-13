import { pgEnum } from "drizzle-orm/pg-core";
import { pgSchema,uniqueIndex,timestamp } from "drizzle-orm/pg-core";
import { integer, pgTable, varchar, serial,boolean,uuid} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial().primaryKey(),
  username: varchar({ length: 255 }).notNull().unique(),
  pw_hash: varchar({length:255}).notNull(),
  isAdmin:boolean().notNull().default(false)
},(table)=>[
  uniqueIndex('usernameUniqueIndex').on(table.username)
]);


export const audioUploads = pgTable("audio_uploads",{
  id:uuid().primaryKey().defaultRandom(),
  name:varchar({length:255}).notNull(),
  user:varchar({length:255}).notNull().references(()=>usersTable.username),
  category:varchar({length:255}),
  uploaded:timestamp().defaultNow().notNull()
})

export const audioCategoriesTable = pgTable("audio_categories",{
  id:serial().primaryKey(),
  name:varchar({length:255}).notNull().unique()
})