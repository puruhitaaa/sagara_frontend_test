import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type MediaId, mediaIdSchema, media } from "@/lib/db/schema/media";

export const getMedia = async () => {
  const rows = await db.select().from(media);
  const m = rows
  return { media: m };
};

export const getMediaById = async (id: MediaId) => {
  const { id: mediaId } = mediaIdSchema.parse({ id });
  const [row] = await db.select().from(media).where(eq(media.id, mediaId));
  if (row === undefined) return {};
  const m = row;
  return { media: m };
};


