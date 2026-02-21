import { z } from "zod";
import {
  circleSessionParticipationCreateInputSchema,
  circleSessionParticipationDtoSchema,
  circleSessionParticipationListInputSchema,
  circleSessionParticipationRemoveInputSchema,
  circleSessionParticipationRoleUpdateInputSchema,
  circleSessionTransferOwnershipInputSchema,
  circleSessionWithdrawInputSchema,
} from "@/server/presentation/dto/circle-session-participation";
import { toCircleSessionParticipationDtos } from "@/server/presentation/mappers/circle-session-participation-mapper";
import { handleTrpcError } from "@/server/presentation/trpc/errors";
import { protectedProcedure, router } from "@/server/presentation/trpc/trpc";

export const circleSessionParticipationRouter = router({
  list: protectedProcedure
    .input(circleSessionParticipationListInputSchema)
    .output(circleSessionParticipationDtoSchema.array())
    .query(({ ctx, input }) =>
      handleTrpcError(async () => {
        const participations =
          await ctx.circleSessionParticipationService.listParticipations({
            actorId: ctx.actorId,
            circleSessionId: input.circleSessionId,
          });
        return toCircleSessionParticipationDtos(participations);
      }),
    ),

  add: protectedProcedure
    .input(circleSessionParticipationCreateInputSchema)
    .output(z.void())
    .mutation(({ ctx, input }) =>
      handleTrpcError(async () => {
        await ctx.circleSessionParticipationService.addParticipation({
          actorId: ctx.actorId,
          circleSessionId: input.circleSessionId,
          userId: input.userId,
          role: input.role,
        });
        return;
      }),
    ),

  updateRole: protectedProcedure
    .input(circleSessionParticipationRoleUpdateInputSchema)
    .output(z.void())
    .mutation(({ ctx, input }) =>
      handleTrpcError(async () => {
        await ctx.circleSessionParticipationService.changeParticipationRole({
          actorId: ctx.actorId,
          circleSessionId: input.circleSessionId,
          userId: input.userId,
          role: input.role,
        });
        return;
      }),
    ),

  withdraw: protectedProcedure
    .input(circleSessionWithdrawInputSchema)
    .output(z.void())
    .mutation(({ ctx, input }) =>
      handleTrpcError(async () => {
        await ctx.circleSessionParticipationService.withdrawParticipation({
          actorId: ctx.actorId,
          circleSessionId: input.circleSessionId,
        });
        return;
      }),
    ),

  remove: protectedProcedure
    .input(circleSessionParticipationRemoveInputSchema)
    .output(z.void())
    .mutation(({ ctx, input }) =>
      handleTrpcError(async () => {
        await ctx.circleSessionParticipationService.removeParticipation({
          actorId: ctx.actorId,
          circleSessionId: input.circleSessionId,
          userId: input.userId,
        });
        return;
      }),
    ),

  transferOwnership: protectedProcedure
    .input(circleSessionTransferOwnershipInputSchema)
    .output(z.void())
    .mutation(({ ctx, input }) =>
      handleTrpcError(async () => {
        await ctx.circleSessionParticipationService.transferOwnership({
          actorId: ctx.actorId,
          circleSessionId: input.circleSessionId,
          fromUserId: input.fromUserId,
          toUserId: input.toUserId,
        });
        return;
      }),
    ),
});
