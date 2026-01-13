import { z } from "zod";
import { circleIdSchema, userIdSchema } from "@/server/presentation/dto/ids";
import { circleRoleSchema } from "@/server/presentation/dto/roles";

export const circleParticipantDtoSchema = z.object({
  userId: userIdSchema,
  role: circleRoleSchema,
});

export type CircleParticipantDto = z.infer<typeof circleParticipantDtoSchema>;

export const circleParticipantListInputSchema = z.object({
  circleId: circleIdSchema,
});

export type CircleParticipantListInput = z.infer<
  typeof circleParticipantListInputSchema
>;

export const circleParticipantCreateInputSchema = z.object({
  circleId: circleIdSchema,
  userId: userIdSchema,
  role: circleRoleSchema,
});

export type CircleParticipantCreateInput = z.infer<
  typeof circleParticipantCreateInputSchema
>;

export const circleParticipantRoleUpdateInputSchema = z.object({
  circleId: circleIdSchema,
  userId: userIdSchema,
  role: circleRoleSchema,
});

export type CircleParticipantRoleUpdateInput = z.infer<
  typeof circleParticipantRoleUpdateInputSchema
>;

export const circleParticipantRemoveInputSchema = z.object({
  circleId: circleIdSchema,
  userId: userIdSchema,
});

export type CircleParticipantRemoveInput = z.infer<
  typeof circleParticipantRemoveInputSchema
>;

export const circleTransferOwnershipInputSchema = z.object({
  circleId: circleIdSchema,
  fromUserId: userIdSchema,
  toUserId: userIdSchema,
});

export type CircleTransferOwnershipInput = z.infer<
  typeof circleTransferOwnershipInputSchema
>;
