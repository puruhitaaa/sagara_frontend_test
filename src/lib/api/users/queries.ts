import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import { type UserId, userIdSchema, users } from "@/lib/db/schema/auth"
import { media } from "@/lib/db/schema/media"
import { instances } from "@/lib/db/schema/instances"

export const getUsers = async () => {
  const { session } = await getUserAuth()

  if (!session) throw new Error("Unauthorized")
  if (session.user.role !== "admin") throw new Error("Forbidden")

  const rows = await db
    .select()
    .from(users)
    .leftJoin(media, eq(users.mediaId, media.id))
    .leftJoin(instances, eq(users.instanceId, instances.id))
    .where(eq(users.role, "user"))
  const u = rows
  return {
    users: u.map((row) => ({
      ...row.user,
      instance: row.instances,
      media: row.media,
    })),
  }
}

export const getUserById = async (id: UserId) => {
  const { session } = await getUserAuth()

  if (!session) throw new Error("Unauthorized")
  if (session.user.role !== "admin") throw new Error("Forbidden")

  const { id: userId } = userIdSchema.parse({ id })
  const [row] = await db.select().from(users).where(eq(users.id, userId))
  if (row === undefined) return {}
  const u = row
  return { user: u }
}
