import type { CircleSessionId, UserId } from "@/server/domain/common/ids";
import type { CircleSessionParticipant } from "@/server/domain/models/circle-session/circle-session-participant";
import type { CircleSessionRole } from "@/server/domain/services/authz/roles";

export type CircleSessionParticipationRepository = {
  listParticipants(
    circleSessionId: CircleSessionId,
  ): Promise<CircleSessionParticipant[]>;
  addParticipant(
    circleSessionId: CircleSessionId,
    userId: UserId,
    role: CircleSessionRole,
  ): Promise<void>;
  updateParticipantRole(
    circleSessionId: CircleSessionId,
    userId: UserId,
    role: CircleSessionRole,
  ): Promise<void>;
  areParticipants(
    circleSessionId: CircleSessionId,
    userIds: readonly UserId[],
  ): Promise<boolean>;
  removeParticipant(
    circleSessionId: CircleSessionId,
    userId: UserId,
  ): Promise<void>;
};
