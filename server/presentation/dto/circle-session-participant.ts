import { z } from "zod";
import {
  circleSessionIdSchema,
  userIdSchema,
} from "@/server/presentation/dto/ids";
import { circleSessionRoleSchema } from "@/server/presentation/dto/roles";

export const circleSessionParticipantDtoSchema = z.object({
  userId: userIdSchema,
  role: circleSessionRoleSchema,
});

export type CircleSessionParticipantDto = z.infer<
  typeof circleSessionParticipantDtoSchema
>;

export const circleSessionParticipantListInputSchema = z.object({
  circleSessionId: circleSessionIdSchema,
});

export type CircleSessionParticipantListInput = z.infer<
  typeof circleSessionParticipantListInputSchema
>;

export const circleSessionParticipantCreateInputSchema = z.object({
  circleSessionId: circleSessionIdSchema,
  userId: userIdSchema,
  role: circleSessionRoleSchema,
});

export type CircleSessionParticipantCreateInput = z.infer<
  typeof circleSessionParticipantCreateInputSchema
>;

export const circleSessionParticipantRoleUpdateInputSchema = z.object({
  circleSessionId: circleSessionIdSchema,
  userId: userIdSchema,
  role: circleSessionRoleSchema,
});

export type CircleSessionParticipantRoleUpdateInput = z.infer<
  typeof circleSessionParticipantRoleUpdateInputSchema
>;

export const circleSessionParticipantRemoveInputSchema = z.object({
  circleSessionId: circleSessionIdSchema,
  userId: userIdSchema,
});

export type CircleSessionParticipantRemoveInput = z.infer<
  typeof circleSessionParticipantRemoveInputSchema
>;

export const circleSessionTransferOwnershipInputSchema = z.object({
  circleSessionId: circleSessionIdSchema,
  fromUserId: userIdSchema,
  toUserId: userIdSchema,
});

export type CircleSessionTransferOwnershipInput = z.infer<
  typeof circleSessionTransferOwnershipInputSchema
>;
