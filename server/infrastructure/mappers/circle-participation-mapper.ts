import type { CircleId } from "@/server/domain/common/ids";
import { userId } from "@/server/domain/common/ids";
import type { CircleParticipant } from "@/server/domain/models/circle/circle-participant";
import type { CircleRole } from "@/server/domain/services/authz/roles";

export const mapCircleIdToPersistence = (id: CircleId): string => id as string;

export const mapCircleRoleToPersistence = (role: CircleRole): string => role;

export const mapCircleRoleFromPersistence = (role: string): CircleRole =>
  role as CircleRole;

export const mapCircleParticipantFromPersistence = (input: {
  userId: string;
  role: string;
}): CircleParticipant => ({
  userId: userId(input.userId),
  role: mapCircleRoleFromPersistence(input.role),
});
