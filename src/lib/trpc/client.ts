import { createTRPCReact } from "@trpc/react-query"

import { type AppRouter } from "@/lib/server/routers/_app"
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>

export const trpc = createTRPCReact<AppRouter>({})
