import { circleSessionId, userId } from "@/server/domain/common/ids";
import { CircleSessionRole } from "@/server/domain/services/authz/roles";
import { getServiceContainer } from "@/server/application/service-container";
import { getSessionUserId } from "@/server/application/auth/session";
import {
  handleError,
  json,
  parseJson,
  requireString,
} from "@/app/api/_helpers";

const parseCircleSessionRole = (value: unknown): CircleSessionRole => {
  const role = requireString(value, "role");
  if (!Object.values(CircleSessionRole).includes(role as CircleSessionRole)) {
    throw new Error("role is invalid");
  }
  return role as CircleSessionRole;
};

export async function PATCH(
  request: Request,
  context: { params: { circleSessionId: string; userId: string } },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const body = await parseJson<{ role?: unknown }>(request);
    const role = parseCircleSessionRole(body.role);

    const { circleSessionParticipationService } = getServiceContainer();
    await circleSessionParticipationService.changeParticipantRole({
      actorId,
      circleSessionId: circleSessionId(params.circleSessionId),
      userId: userId(params.userId),
      role,
    });

    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  context: { params: { circleSessionId: string; userId: string } },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const { circleSessionParticipationService } = getServiceContainer();
    await circleSessionParticipationService.removeParticipant({
      actorId,
      circleSessionId: circleSessionId(params.circleSessionId),
      userId: userId(params.userId),
    });

    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
