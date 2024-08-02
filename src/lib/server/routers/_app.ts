import { router } from "@/lib/server/trpc"
import { instancesRouter } from "./instances"
import { mediaRouter } from "./media"
import { usersRouter } from "./users"

export const appRouter = router({
  instances: instancesRouter,
  media: mediaRouter,
  users: usersRouter,
})

export type AppRouter = typeof appRouter
