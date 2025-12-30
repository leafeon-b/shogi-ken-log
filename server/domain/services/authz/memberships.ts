import type { CircleRole, CircleSessionRole } from "@/server/domain/services/authz/roles";

export type CircleMembership =
  | { kind: "none" }
  | { kind: "member"; role: CircleRole };

export type CircleSessionMembership =
  | { kind: "none" }
  | { kind: "member"; role: CircleSessionRole };

export const circleMembership = (role: CircleRole): CircleMembership => ({
  kind: "member",
  role,
});

export const noCircleMembership = (): CircleMembership => ({ kind: "none" });

export const circleMembershipFromRole = (
  role: CircleRole | null,
): CircleMembership => (role ? circleMembership(role) : noCircleMembership());

export const isCircleMember = (
  membership: CircleMembership,
): membership is { kind: "member"; role: CircleRole } =>
  membership.kind === "member";

export const circleSessionMembership = (
  role: CircleSessionRole,
): CircleSessionMembership => ({
  kind: "member",
  role,
});

export const noCircleSessionMembership = (): CircleSessionMembership => ({
  kind: "none",
});

export const circleSessionMembershipFromRole = (
  role: CircleSessionRole | null,
): CircleSessionMembership =>
  role ? circleSessionMembership(role) : noCircleSessionMembership();

export const isCircleSessionMember = (
  membership: CircleSessionMembership,
): membership is { kind: "member"; role: CircleSessionRole } =>
  membership.kind === "member";
