import { computersRouter } from "./computers";
import { router } from "@/lib/server/trpc";
import { instancesRouter } from "./instances";
import { mediaRouter } from "./media";

export const appRouter = router({
  computers: computersRouter,
  instances: instancesRouter,
  media: mediaRouter,
});

export type AppRouter = typeof appRouter;
