import { relations, sql } from "drizzle-orm"
import { varchar, timestamp, pgTable, uniqueIndex } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { type getInstances } from "@/lib/api/instances/queries"

import { nanoid, timestamps } from "@/lib/utils"
import { users } from "./auth"

export const instances = pgTable(
  "instances",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: varchar("name", { length: 256 }).notNull(),
    address: varchar("address", { length: 256 }),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`now()`),
  },
  (instances) => {
    return {
      nameIndex: uniqueIndex("instance_name_idx").on(instances.name),
    }
  }
)

export const instancesRelations = relations(instances, ({ many }) => ({
  users: many(users),
}))

// Schema for instances - used to validate API requests
const baseSchema = createSelectSchema(instances).omit(timestamps)

export const insertInstanceSchema =
  createInsertSchema(instances).omit(timestamps)
export const insertInstanceParams = baseSchema.extend({}).omit({
  id: true,
})

export const updateInstanceSchema = baseSchema
export const updateInstanceParams = baseSchema.extend({})
export const instanceIdSchema = baseSchema.pick({ id: true })

// Types for instances - used to type API request params and within Components
export type Instance = typeof instances.$inferSelect
export type NewInstance = z.infer<typeof insertInstanceSchema>
export type NewInstanceParams = z.infer<typeof insertInstanceParams>
export type UpdateInstanceParams = z.infer<typeof updateInstanceParams>
export type InstanceId = z.infer<typeof instanceIdSchema>["id"]

// this type infers the return from getInstances() - meaning it will include any joins
export type CompleteInstance = Awaited<
  ReturnType<typeof getInstances>
>["instances"][number]
