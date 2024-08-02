import { z } from "zod"
import { pgTable, timestamp, text } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { media } from "./media"
import { instances } from "./instances"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { timestamps } from "@/lib/utils"
import { getUsers } from "@/lib/api/users/queries"

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

export type UsernameAndPassword = z.infer<typeof authenticationSchema>

// Schema for user - used to validate API requests
const baseSchema = createSelectSchema(users).omit(timestamps)

export const insertUserSchema = createInsertSchema(users).omit(timestamps)
export const insertUserParams = baseSchema.extend({}).omit({
  id: true,
})

export const updateUserSchema = baseSchema
export const updateUserParams = baseSchema.extend({})
export const userIdSchema = baseSchema.pick({ id: true })

// Types for user - used to type API request params and within Components
export type User = typeof users.$inferSelect
export type NewUser = z.infer<typeof insertUserSchema>
export type NewUserParams = z.infer<typeof insertUserParams>
export type UpdateUserParams = z.infer<typeof updateUserParams>
export type UserId = z.infer<typeof userIdSchema>

// this type infers the return from getUsers() - meaning it will include any joins
export type CompleteUser = Awaited<ReturnType<typeof getUsers>>["users"][number]
