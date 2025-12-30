import type {
  CircleMembership,
  CircleSessionMembership,
} from "@/server/domain/services/authz/memberships";

export type AuthzRepository = {
  isRegisteredUser(userId: string): Promise<boolean>;
  findCircleMembership(
    userId: string,
    circleId: string,
  ): Promise<CircleMembership>;
  findCircleSessionMembership(
    userId: string,
    circleSessionId: string,
  ): Promise<CircleSessionMembership>;
};
