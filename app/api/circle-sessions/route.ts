import { randomUUID } from "crypto";
import { circleId, circleSessionId } from "@/server/domain/common/ids";
import { getServiceContainer } from "@/server/application/service-container";
import { getSessionUserId } from "@/server/application/auth/session";
import {
  handleError,
  json,
  parseJson,
  optionalString,
  requireDate,
  requireNumber,
  requireString,
} from "@/app/api/_helpers";

export async function GET(request: Request) {
  try {
    const actorId = await getSessionUserId();
    const url = new URL(request.url);
    const circleIdParam = url.searchParams.get("circleId");
    if (!circleIdParam) {
      return handleError(new Error("circleId is required"));
    }

    const { circleSessionService } = getServiceContainer();
    const sessions = await circleSessionService.listByCircleId(
      actorId,
      circleId(circleIdParam),
    );

    return json(sessions);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const actorId = await getSessionUserId();
    const body = await parseJson<{
      circleId?: unknown;
      sequence?: unknown;
      startsAt?: unknown;
      endsAt?: unknown;
      location?: unknown;
    }>(request);

    const circleIdValue = requireString(body.circleId, "circleId");
    const sequence = requireNumber(body.sequence, "sequence");
    const startsAt = requireDate(body.startsAt, "startsAt");
    const endsAt = requireDate(body.endsAt, "endsAt");
    const location = optionalString(body.location);

    const { circleSessionService } = getServiceContainer();
    const session = await circleSessionService.createCircleSession({
      actorId,
      id: circleSessionId(randomUUID()),
      circleId: circleId(circleIdValue),
      sequence,
      startsAt,
      endsAt,
      location,
    });

    return json(session, 201);
  } catch (error) {
    return handleError(error);
  }
}
