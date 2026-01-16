import { userCircleSessionParticipationRouter } from "@/server/presentation/trpc/routers/user-circle-session-participation";
import { router } from "@/server/presentation/trpc/trpc";

export const userCircleSessionRouter = router({
  participations: userCircleSessionParticipationRouter,
});
