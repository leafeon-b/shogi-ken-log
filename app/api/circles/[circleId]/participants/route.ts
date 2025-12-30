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

export async function GET(
  request: Request,
  context: { params: { circleId: string } },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const { circleParticipationService } = getServiceContainer();
    const participants = await circleParticipationService.listParticipants({
      actorId,
      circleId: circleId(params.circleId),
    });

    return json(participants);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  request: Request,
  context: { params: { circleId: string } },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const body = await parseJson<{
      userId?: unknown;
      role?: unknown;
    }>(request);

    const role = parseCircleRole(body.role);
    const participantId = requireString(body.userId, "userId");

    const { circleParticipationService } = getServiceContainer();
    await circleParticipationService.addParticipant({
      actorId,
      circleId: circleId(params.circleId),
      userId: userId(participantId),
      role,
    });

    return json({ ok: true }, 201);
  } catch (error) {
    return handleError(error);
  }
}
