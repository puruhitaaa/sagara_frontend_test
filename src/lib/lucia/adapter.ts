import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle"
import { db } from "../db"
import { DatabaseSession, DatabaseUser } from "lucia"
import { InferSelectModel, eq } from "drizzle-orm"
import { sessions, users } from "../db/schema/auth"
import { media } from "../db/schema/media"

function transformIntoDatabaseSession(
  raw: InferSelectModel<typeof sessions>
): DatabaseSession {
  const { id, userId, expiresAt, ...attributes } = raw
  return {
    userId,
    id,
    expiresAt,
    attributes,
  }
}

function transformIntoDatabaseUser(
  raw: InferSelectModel<typeof users> & {
    media: InferSelectModel<typeof media>
  }
): DatabaseUser {
  const { id, media, ...attributes } = raw
  return {
    id,
    attributes: {
      ...attributes,
      // @ts-ignore
      media,
    },
  }
}

class CustomAdapter extends DrizzlePostgreSQLAdapter {
  public async getSessionAndUser(
    sessionId: string
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    const result = await db
      .select({
        user: users,
        session: sessions,
        media: media,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .innerJoin(media, eq(users.mediaId, media.id))
      .where(eq(sessions.id, sessionId))
      .limit(1)

    if (result.length !== 1) return [null, null]

    return [
      transformIntoDatabaseSession(result[0].session),
      transformIntoDatabaseUser({ ...result[0].user, media: result[0].media }),
    ]
  }
}

const adapter = new CustomAdapter(db, sessions, users)

export default adapter
