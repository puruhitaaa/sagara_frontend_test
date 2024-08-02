import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
  type MediaId,
  mediaIdSchema,
  media as mediaTable,
} from "@/lib/db/schema/media"

export const getMedia = async () => {
  const rows = await db.select().from(mediaTable)
  const m = rows
  return { media: m }
}

export const getMediaById = async (id: MediaId) => {
  const { id: mediaId } = mediaIdSchema.parse({ id })
  const [row] = await db
    .select()
    .from(mediaTable)
    .where(eq(mediaTable.id, mediaId))
  if (row === undefined) return {}
  const m = row
  return { media: m }
}
