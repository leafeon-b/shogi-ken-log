import { circleId, userId } from "@/server/domain/common/ids";
import { CircleRole } from "@/server/domain/services/authz/roles";
import { getServiceContainer } from "@/server/application/service-container";
import { getSessionUserId } from "@/server/application/auth/session";
import {
  handleError,
  json,
  parseJson,
  requireString,
} from "@/app/api/_helpers";

const parseCircleRole = (value: unknown): CircleRole => {
  const role = requireString(value, "role");
  if (!Object.values(CircleRole).includes(role as CircleRole)) {
    throw new Error("role is invalid");
  }
  return role as CircleRole;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ circleId: string; userId: string }> },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const body = await parseJson<{ role?: unknown }>(request);
    const role = parseCircleRole(body.role);

    const { circleParticipationService } = getServiceContainer();
    await circleParticipationService.changeParticipantRole({
      actorId,
      circleId: circleId(params.circleId),
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
  context: { params: Promise<{ circleId: string; userId: string }> },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const { circleParticipationService } = getServiceContainer();
    await circleParticipationService.removeParticipant({
      actorId,
      circleId: circleId(params.circleId),
      userId: userId(params.userId),
    });

    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
