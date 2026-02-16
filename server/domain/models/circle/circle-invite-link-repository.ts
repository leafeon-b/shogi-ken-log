import type { CircleId } from "@/server/domain/common/ids";
import type { CircleInviteLink } from "@/server/domain/models/circle/circle-invite-link";

export type CircleInviteLinkRepository = {
  findByToken(token: string): Promise<CircleInviteLink | null>;
  findActiveByCircleId(circleId: CircleId): Promise<CircleInviteLink | null>;
  save(link: CircleInviteLink): Promise<void>;
};
