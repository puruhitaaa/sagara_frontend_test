import { db } from "@/lib/db/index"
import { and, eq, gte, lt, sql } from "drizzle-orm"
import { type UserId, userIdSchema, users } from "@/lib/db/schema/auth"
import { media } from "@/lib/db/schema/media"
import { instances } from "@/lib/db/schema/instances"
import { addDays, startOfDay } from "date-fns"

export const getUsers = async () => {
  const rows = await db
    .select()
    .from(users)
    .leftJoin(media, eq(users.mediaId, media.id))
    .leftJoin(instances, eq(users.instanceId, instances.id))
    .where(eq(users.role, "user"))
  const u = rows
  return u.map((row) => ({
    ...row.user,
    instance: row.instances,
    media: row.media,
  }))
}

export const getUserById = async (id: UserId) => {
  const { id: userId } = userIdSchema.parse({ id })
  const [row] = await db.select().from(users).where(eq(users.id, userId))
  if (row === undefined) return {}
  const u = row
  return { user: u }
}

export const getUserCountByRoleUser = async (): Promise<{
  totalCount: number
  newUserCount: number
  percentage: number
}> => {
  const [{ count: totalCount }] = await db
    .select({ count: sql`COUNT(*)` })
    .from(users)
    .where(eq(users.role, "user"))

  const yesterdayStart = startOfDay(new Date())
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  const yesterdayEnd = addDays(yesterdayStart, 1)

  const [{ count: newUserCount }] = await db
    .select({ count: sql`COUNT(*)` })
    .from(users)
    .where(
      and(
        eq(users.role, "user"),
        gte(users.createdAt, yesterdayStart),
        lt(users.createdAt, yesterdayEnd)
      )
    )

  const percentage = ((newUserCount as number) / (totalCount as number)) * 100

  return {
    totalCount: Number(totalCount) ?? 0,
    newUserCount: Number(newUserCount) ?? 0,
    percentage,
  }
}
