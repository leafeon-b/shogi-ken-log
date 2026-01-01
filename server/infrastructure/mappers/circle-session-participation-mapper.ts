import type { CircleSessionId, UserId } from "@/server/domain/common/ids";
import { userId } from "@/server/domain/common/ids";
import type { CircleSessionParticipant } from "@/server/domain/models/circle-session/circle-session-participant";
import type { CircleSessionRole } from "@/server/domain/services/authz/roles";

export const mapCircleSessionIdToPersistence = (
  circleSessionId: CircleSessionId,
): string => circleSessionId as string;

export const mapUserIdsToPersistence = (userIds: readonly UserId[]): string[] =>
  userIds.map((id) => id as string);

export const mapCircleSessionRoleToPersistence = (
  role: CircleSessionRole,
): string => role;

export const mapCircleSessionRoleFromPersistence = (
  role: string,
): CircleSessionRole => role as CircleSessionRole;

export const mapCircleSessionParticipantFromPersistence = (input: {
  userId: string;
  role: string;
}): CircleSessionParticipant => ({
  userId: userId(input.userId),
  role: mapCircleSessionRoleFromPersistence(input.role),
});
