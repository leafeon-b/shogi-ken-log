import {
  circleSessionId,
  userId,
} from "@/server/domain/common/ids";
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

export async function GET(
  request: Request,
  context: { params: { circleSessionId: string } },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const { circleSessionParticipationService } = getServiceContainer();
    const participants = await circleSessionParticipationService.listParticipants(
      {
        actorId,
        circleSessionId: circleSessionId(params.circleSessionId),
      },
    );

    return json(participants);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  request: Request,
  context: { params: { circleSessionId: string } },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const body = await parseJson<{
      userId?: unknown;
      role?: unknown;
    }>(request);

    const role = parseCircleSessionRole(body.role);
    const participantId = requireString(body.userId, "userId");

    const { circleSessionParticipationService } = getServiceContainer();
    await circleSessionParticipationService.addParticipant({
      actorId,
      circleSessionId: circleSessionId(params.circleSessionId),
      userId: userId(participantId),
      role,
    });

    return json({ ok: true }, 201);
  } catch (error) {
    return handleError(error);
  }
}
