import { relations, sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const UserTable = sqliteTable("user", {
	id: text("id").primaryKey().notNull(),
    email: text("email", { length: 255}).notNull().unique(),
    name: text("name", { length: 255}).notNull(),
    role: text("role", { enum: ["USER", "ADMIN"] }).default("USER").notNull(),
    picture: text("picture", { length: 255 }),
    password: text("password", { length: 255 }),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type TypeUserTable = InferSelectModel<typeof UserTable>;
export type TypeNewUserTable = InferInsertModel<typeof UserTable>;

export const SessionTable = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
    userId: text("user_id").notNull().references(() => UserTable.id),
    expiresAt: integer("expires_at").notNull(),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type TypeSessionTable = InferSelectModel<typeof SessionTable>;
export type TypeNewSessionTable = InferInsertModel<typeof SessionTable>;

// relations ...
// relations don't impact your database schema
// rather used to define relations between tables on the application level 

export const UserTableRelations = relations(UserTable, ({ many }) => {
    return {
        sessions: many(SessionTable)
    }
})

export const SessionTableRelations = relations(SessionTable, ({ one }) => {
    return {
        user: one(UserTable, {
            fields: [SessionTable.userId],
            references: [UserTable.id]
        })
    }
})
