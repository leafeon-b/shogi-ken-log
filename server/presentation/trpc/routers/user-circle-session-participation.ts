import { userId } from "@/server/domain/common/ids";
import {
  userCircleSessionParticipationListInputSchema,
  userCircleSessionParticipationSummaryDtoSchema,
} from "@/server/presentation/dto/user-circle-session-participation";
import { toUserCircleSessionParticipationSummaryDtos } from "@/server/presentation/mappers/user-circle-session-participation-mapper";
import { handleTrpcError } from "@/server/presentation/trpc/errors";
import { publicProcedure, router } from "@/server/presentation/trpc/trpc";

export const userCircleSessionParticipationRouter = router({
  list: publicProcedure
    .input(userCircleSessionParticipationListInputSchema)
    .output(userCircleSessionParticipationSummaryDtoSchema.array())
    .query(({ ctx, input }) =>
      handleTrpcError(async () => {
        const summaries =
          await ctx.circleSessionParticipationService.listByUserId({
            actorId: ctx.actorId,
            userId: userId(ctx.actorId),
            limit: input.limit,
          });
        return toUserCircleSessionParticipationSummaryDtos(summaries);
      }),
    ),
});
