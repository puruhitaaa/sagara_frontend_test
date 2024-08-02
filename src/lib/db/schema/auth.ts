import { z } from "zod"
import { pgTable, timestamp, text } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { media } from "./media"
import { instances } from "./instances"

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  name: text("name"),
  role: text("role").default("user"),
  mediaId: text("media_id").references(() => media.id),
  instanceId: text("instance_id").references(() => instances.id),
  phoneNumber: text("phone_number").unique(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
})

export const usersRelations = relations(users, ({ one }) => ({
  instance: one(instances, {
    fields: [users.instanceId],
    references: [instances.id],
  }),
  media: one(media, {
    fields: [users.mediaId],
    references: [media.id],
  }),
}))

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
})

export const authenticationSchema = z.object({
  email: z.string().email().min(5).max(64),
  password: z
    .string()
    .min(4, { message: "must be at least 4 characters long" })
    .max(15, { message: "cannot be more than 15 characters long" }),
})

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().min(4).optional(),
})

export type UsernameAndPassword = z.infer<typeof authenticationSchema>
