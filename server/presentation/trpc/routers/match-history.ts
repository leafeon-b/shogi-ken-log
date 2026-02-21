import {
  matchHistoryDtoSchema,
  matchHistoryListInputSchema,
} from "@/server/presentation/dto/match-history";
import { toMatchHistoryDtos } from "@/server/presentation/mappers/match-history-mapper";
import { handleTrpcError } from "@/server/presentation/trpc/errors";
import { protectedProcedure, router } from "@/server/presentation/trpc/trpc";

export const matchHistoryRouter = router({
  list: protectedProcedure
    .input(matchHistoryListInputSchema)
    .output(matchHistoryDtoSchema.array())
    .query(({ ctx, input }) =>
      handleTrpcError(async () => {
        const histories = await ctx.matchHistoryService.listByMatchId({
          actorId: ctx.actorId,
          matchId: input.matchId,
        });
        return toMatchHistoryDtos(histories);
      }),
    ),
});
