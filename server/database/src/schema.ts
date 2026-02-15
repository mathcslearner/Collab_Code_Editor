import { createId } from "@paralleldrive/cuid2";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
    id: text("id").$defaultFn(() => createId()).primaryKey().unique(),
    name: text("name").notNull(),
    email: text("email").notNull()
})

export const virtualbox = sqliteTable("virtualbox", {
    id: text("id").$defaultFn(() => createId()).primaryKey().unique(),
    name: text("name").notNull(),
    type: text("text", {enum: ["react", "node"]}).notNull(),
    userId: text("user_id").notNull().references(() => user.id)
})