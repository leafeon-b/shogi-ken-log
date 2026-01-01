import type { CircleId, CircleSessionId } from "@/server/domain/common/ids";
import {
  assertPositiveInteger,
  assertStartBeforeEnd,
  assertValidDate,
} from "@/server/domain/common/validation";

export type CircleSession = {
  id: CircleSessionId;
  circleId: CircleId;
  sequence: number;
  startsAt: Date;
  endsAt: Date;
  location: string | null;
  createdAt: Date;
};

export type CircleSessionCreateParams = {
  id: CircleSessionId;
  circleId: CircleId;
  sequence: number;
  startsAt: Date;
  endsAt: Date;
  location?: string | null;
  createdAt?: Date;
};

export const createCircleSession = (
  params: CircleSessionCreateParams,
): CircleSession => {
  const startsAt = assertValidDate(params.startsAt, "startsAt");
  const endsAt = assertValidDate(params.endsAt, "endsAt");
  assertStartBeforeEnd(startsAt, endsAt, "CircleSession");

  return {
    id: params.id,
    circleId: params.circleId,
    sequence: assertPositiveInteger(params.sequence, "sequence"),
    startsAt,
    endsAt,
    location: params.location ?? null,
    createdAt: params.createdAt ?? new Date(),
  };
};

export const rescheduleCircleSession = (
  session: CircleSession,
  startsAt: Date,
  endsAt: Date,
): CircleSession => {
  const nextStartsAt = assertValidDate(startsAt, "startsAt");
  const nextEndsAt = assertValidDate(endsAt, "endsAt");
  assertStartBeforeEnd(nextStartsAt, nextEndsAt, "CircleSession");

  return {
    ...session,
    startsAt: nextStartsAt,
    endsAt: nextEndsAt,
  };
};
