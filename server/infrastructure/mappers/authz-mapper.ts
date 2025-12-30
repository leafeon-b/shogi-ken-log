import type {
  CircleRole as PrismaCircleRole,
  CircleSessionRole as PrismaCircleSessionRole,
} from "@/generated/prisma/enums";
import type {
  CircleMembership,
  CircleSessionMembership,
} from "@/server/domain/services/authz/memberships";
import {
  circleMembershipFromRole,
  circleSessionMembershipFromRole,
} from "@/server/domain/services/authz/memberships";
import type {
  CircleRole,
  CircleSessionRole,
} from "@/server/domain/services/authz/roles";

export const mapCircleRoleToDomain = (role: PrismaCircleRole): CircleRole =>
  role;

export const mapCircleSessionRoleToDomain = (
  role: PrismaCircleSessionRole,
): CircleSessionRole => role;

export const mapCircleMembershipFromPersistence = (
  role: PrismaCircleRole | null,
): CircleMembership =>
  circleMembershipFromRole(role ? mapCircleRoleToDomain(role) : null);

export const mapCircleSessionMembershipFromPersistence = (
  role: PrismaCircleSessionRole | null,
): CircleSessionMembership =>
  circleSessionMembershipFromRole(
    role ? mapCircleSessionRoleToDomain(role) : null,
  );
