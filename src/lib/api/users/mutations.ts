import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
  UserId,
  UpdateUserParams,
  updateUserSchema,
  users,
  userIdSchema,
  newUserSchema,
} from "@/lib/db/schema/auth"
import { Argon2id } from "oslo/password"
import { generateId } from "lucia"
import { z } from "zod"

export const createUser = async (user: z.infer<typeof newUserSchema>) => {
  const newUser = newUserSchema.parse({
    ...user,
  })
  const { confirmationPassword, password, ...rest } = newUser

  const hashedPassword = await new Argon2id().hash(password)
  const userId = generateId(15)

  try {
    const [u] = await db
      .insert(users)
      .values({ ...rest, id: userId, hashedPassword })
      .returning()
    return { user: u }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const updateUser = async (id: UserId, user: UpdateUserParams) => {
  const { id: userId } = userIdSchema.parse({ id })
  const newUser = updateUserSchema.parse({
    ...user,
  })
  try {
    const [u] = await db
      .update(users)
      .set({ ...newUser, updatedAt: new Date() })
      .where(eq(users.id, userId!))
      .returning()
    return { user: u }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}

export const deleteUser = async (id: UserId["id"]) => {
  const { id: userId } = userIdSchema.parse({ id })
  try {
    const [u] = await db.delete(users).where(eq(users.id, userId!)).returning()
    return { user: u }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again"
    console.error(message)
    throw { error: message }
  }
}
