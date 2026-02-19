import { createId } from "@paralleldrive/cuid2";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const user = sqliteTable("user", {
    id: text("id").$defaultFn(() => createId()).primaryKey().unique(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    image: text("image")
})

export type User = typeof user.$inferSelect

export const userRelation = relations(user, ({many}) => ({
    virtualbox: many(virtualbox),
    usersToVirtualboxes: many(usersToVirtualboxes)
}))

export const virtualbox = sqliteTable("virtualbox", {
    id: text("id").$defaultFn(() => createId()).primaryKey().unique(),
    name: text("name").notNull(),
    type: text("text", {enum: ["react", "node"]}).notNull(),
    visibility: text("visibility", {enum: ["public", "private"]}),
    userId: text("user_id").notNull().references(() => user.id)
})

export type VirtualBox = typeof virtualbox.$inferSelect 

export const virtualBoxRelations = relations(virtualbox, ({one, many}) => ({
    author: one(user, {
        fields: [virtualbox.userId],
        references: [user.id],
        relationName: "virtualbox"
    }),
    usersToVirtualboxes: many(usersToVirtualboxes)
}))

export const usersToVirtualboxes = sqliteTable("users_to_virtualboxes", {
    userId: text("userId").notNull().references(() => user.id),
    virtualboxId: text("virtualboxId").notNull().references(() => virtualbox.id),
    sharedOn: integer("sharedOn", {mode: "timestamp_ms"})
})

export const usersToVirtualboxesRelations = relations(usersToVirtualboxes, ({one}) => ({
    group: one(virtualbox, {
        fields: [usersToVirtualboxes.virtualboxId],
        references: [virtualbox.id]
    }),
    user: one(user, {
        fields: [usersToVirtualboxes.userId],
        references: [user.id]
    })
}))