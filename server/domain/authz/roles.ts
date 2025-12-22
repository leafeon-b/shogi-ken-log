import type { CircleRole, CircleSessionRole } from "@/generated/prisma/enums";
import {
  CircleRole as CircleRoleEnum,
  CircleSessionRole as CircleSessionRoleEnum,
} from "@/generated/prisma/enums";

const CIRCLE_ROLE_ORDER: readonly CircleRole[] = [
  CircleRoleEnum.CircleOwner,
  CircleRoleEnum.CircleManager,
  CircleRoleEnum.CircleMember,
] as const;

const CIRCLE_SESSION_ROLE_ORDER: readonly CircleSessionRole[] = [
  CircleSessionRoleEnum.CircleSessionOwner,
  CircleSessionRoleEnum.CircleSessionManager,
  CircleSessionRoleEnum.CircleSessionMember,
] as const;

function roleRank<T extends readonly string[]>(role: T[number], order: T): number {
  return order.indexOf(role);
}

/**
 * actorRole が targetRole と同等以上（上位を含む）なら true。
 */
export function isSameOrHigherCircleRole(
  actorRole: CircleRole,
  targetRole: CircleRole,
): boolean {
  return (
    roleRank(actorRole, CIRCLE_ROLE_ORDER) <=
    roleRank(targetRole, CIRCLE_ROLE_ORDER)
  );
}

/**
 * actorRole が targetRole と同等以上（上位を含む）なら true。
 */
export function isSameOrHigherCircleSessionRole(
  actorRole: CircleSessionRole,
  targetRole: CircleSessionRole,
): boolean {
  return (
    roleRank(actorRole, CIRCLE_SESSION_ROLE_ORDER) <=
    roleRank(targetRole, CIRCLE_SESSION_ROLE_ORDER)
  );
}
