import { db } from "@/lib/db/index"
import { and, asc, count, eq, gte, lt, sql } from "drizzle-orm"
import { type UserId, userIdSchema, users } from "@/lib/db/schema/auth"
import { media } from "@/lib/db/schema/media"
import { instances } from "@/lib/db/schema/instances"
import { addDays, startOfDay } from "date-fns"
import { z } from "zod"
import { getUsersSchema } from "@/lib/server/routers/users"

export const getUsers = async ({
  page,
  limit,
  activeColumns = [],
}: z.infer<typeof getUsersSchema>) => {
  const offset = (page! - 1) * 6

  const [totalCount] = await db.select({ count: count() }).from(users)
  const totalPages = Math.ceil(totalCount.count / limit!)

  const selectedColumns = {
    id: users.id,
    ...(activeColumns.includes("profile") && { name: users.name }),
    ...(activeColumns.includes("emailaddress") && { email: users.email }),
    ...(activeColumns.includes("phonenumber") && {
      phoneNumber: users.phoneNumber,
    }),
    ...(activeColumns.includes("createdat") && { createdAt: users.createdAt }),
    ...(activeColumns.includes("instance") && {
      instanceId: instances.id,
      instanceName: instances.name,
    }),
    ...(activeColumns.includes("profile") && {
      mediaId: media.id,
      mediaUrl: media.url,
    }),
  }

  const rows = await db
    .select(selectedColumns)
    .from(users)
    .offset(offset)
    .limit(limit!)
    .orderBy(asc(users.id))
    .leftJoin(media, eq(users.mediaId, media.id))
    .leftJoin(instances, eq(users.instanceId, instances.id))
    .where(eq(users.role, "user"))
  const u = rows
  return {
    users: u.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phoneNumber: row.phoneNumber,
      createdAt: row.createdAt,
      instance: {
        id: row.instanceId,
        name: row.instanceName,
      },
      media: {
        id: row.mediaId,
        url: row.mediaUrl,
      },
    })),
    totalPages,
  }
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
