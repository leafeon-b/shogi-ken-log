import { router } from "@/server/presentation/trpc/trpc";

export const appRouter = router({});

export type AppRouter = typeof appRouter;
