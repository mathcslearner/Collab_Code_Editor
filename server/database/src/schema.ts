import { createId } from "@paralleldrive/cuid2";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const user = sqliteTable("user", {
    id: text("id").$defaultFn(() => createId()).primaryKey().unique(),
    name: text("name").notNull(),
    email: text("email").notNull()
})

export type User = typeof user.$inferSelect

export const userRelation = relations(user, ({many}) => ({
    virtualbox: many(virtualbox)
}))

export const virtualbox = sqliteTable("virtualbox", {
    id: text("id").$defaultFn(() => createId()).primaryKey().unique(),
    name: text("name").notNull(),
    type: text("text", {enum: ["react", "node"]}).notNull(),
    userId: text("user_id").notNull().references(() => user.id)
})

export type VirtualBox = typeof virtualbox.$inferSelect 

export const virtualBoxRelations = relations(virtualbox, ({one}) => ({
    author: one(user, {
        fields: [virtualbox.userId],
        references: [user.id]
    })
}))