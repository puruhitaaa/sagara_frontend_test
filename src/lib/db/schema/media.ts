import { relations, sql } from "drizzle-orm"
import { varchar, timestamp, pgTable } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { type getMedia } from "@/lib/api/media/queries"

import { nanoid, timestamps } from "@/lib/utils"
import { users } from "./auth"

export const media = pgTable("media", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  type: varchar("type", { length: 256 }).notNull(),
  url: varchar("url", { length: 256 }).notNull(),
  userId: varchar("user_id", { length: 256 }),
  description: varchar("description", { length: 256 }),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
})

export const mediaRelations = relations(media, ({ one }) => ({
  user: one(users, {
    fields: [media.userId],
    references: [users.id],
  }),
}))

// Schema for media - used to validate API requests
const baseSchema = createSelectSchema(media).omit(timestamps)

export const insertMediaSchema = createInsertSchema(media).omit(timestamps)
export const insertMediaParams = baseSchema.extend({}).omit({
  id: true,
})

export const updateMediaSchema = baseSchema
export const updateMediaParams = baseSchema.extend({})
export const mediaIdSchema = baseSchema.pick({ id: true })

// Types for media - used to type API request params and within Components
export type Media = typeof media.$inferSelect
export type NewMedia = z.infer<typeof insertMediaSchema>
export type NewMediaParams = z.infer<typeof insertMediaParams>
export type UpdateMediaParams = z.infer<typeof updateMediaParams>
export type MediaId = z.infer<typeof mediaIdSchema>["id"]

// this type infers the return from getMedia() - meaning it will include any joins
export type CompleteMedia = Awaited<
  ReturnType<typeof getMedia>
>["media"][number]
