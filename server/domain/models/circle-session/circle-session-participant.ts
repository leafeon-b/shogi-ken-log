import type { UserId } from "@/server/domain/common/ids";
import type { CircleSessionRole } from "@/server/domain/services/authz/roles";

export type CircleSessionParticipant = {
  userId: UserId;
  role: CircleSessionRole;
};
