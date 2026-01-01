export const CircleRole = {
  CircleOwner: "CircleOwner",
  CircleManager: "CircleManager",
  CircleMember: "CircleMember",
} as const;

export type CircleRole = (typeof CircleRole)[keyof typeof CircleRole];

export const CircleSessionRole = {
  CircleSessionOwner: "CircleSessionOwner",
  CircleSessionManager: "CircleSessionManager",
  CircleSessionMember: "CircleSessionMember",
} as const;

export type CircleSessionRole =
  (typeof CircleSessionRole)[keyof typeof CircleSessionRole];

const CIRCLE_ROLE_ORDER: readonly CircleRole[] = [
  CircleRole.CircleOwner,
  CircleRole.CircleManager,
  CircleRole.CircleMember,
] as const;

const CIRCLE_SESSION_ROLE_ORDER: readonly CircleSessionRole[] = [
  CircleSessionRole.CircleSessionOwner,
  CircleSessionRole.CircleSessionManager,
  CircleSessionRole.CircleSessionMember,
] as const;

function roleRank<T extends readonly string[]>(
  role: T[number],
  order: T,
): number {
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
