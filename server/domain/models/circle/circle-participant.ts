import type { UserId } from "@/server/domain/common/ids";
import type { CircleRole } from "@/server/domain/services/authz/roles";

export type CircleParticipant = {
  userId: UserId;
  role: CircleRole;
};
