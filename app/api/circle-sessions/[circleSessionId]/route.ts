import { circleSessionId } from "@/server/domain/common/ids";
import { getServiceContainer } from "@/server/application/service-container";
import { getSessionUserId } from "@/server/application/auth/session";
import {
  handleError,
  json,
  optionalDate,
  optionalNumber,
  optionalString,
  parseJson,
} from "@/app/api/_helpers";

export async function GET(
  _request: Request,
  context: { params: { circleSessionId: string } },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const { circleSessionService } = getServiceContainer();
    const session = await circleSessionService.getCircleSession(
      actorId,
      circleSessionId(params.circleSessionId),
    );

    if (!session) {
      return handleError(new Error("CircleSession not found"));
    }

    return json(session);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: Request,
  context: { params: { circleSessionId: string } },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const body = await parseJson<{
      sequence?: unknown;
      startsAt?: unknown;
      endsAt?: unknown;
      location?: unknown;
    }>(request);

    const { circleSessionService } = getServiceContainer();
    const session = await circleSessionService.updateCircleSessionDetails(
      actorId,
      circleSessionId(params.circleSessionId),
      {
        sequence: optionalNumber(body.sequence),
        startsAt: optionalDate(body.startsAt),
        endsAt: optionalDate(body.endsAt),
        location: optionalString(body.location),
      },
    );

    return json(session);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: { circleSessionId: string } },
) {
  try {
    const actorId = await getSessionUserId();
    const { circleSessionService } = getServiceContainer();
    const params = await context.params;
    const id = circleSessionId(params.circleSessionId);
    await circleSessionService.deleteCircleSession(actorId, id);
    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
