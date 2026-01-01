import type { CircleId, UserId } from "@/server/domain/common/ids";
import type { CircleParticipant } from "@/server/domain/models/circle/circle-participant";
import type { CircleRole } from "@/server/domain/services/authz/roles";

export type CircleParticipationRepository = {
  listParticipants(circleId: CircleId): Promise<CircleParticipant[]>;
  addParticipant(
    circleId: CircleId,
    userId: UserId,
    role: CircleRole,
  ): Promise<void>;
  updateParticipantRole(
    circleId: CircleId,
    userId: UserId,
    role: CircleRole,
  ): Promise<void>;
  removeParticipant(circleId: CircleId, userId: UserId): Promise<void>;
};
