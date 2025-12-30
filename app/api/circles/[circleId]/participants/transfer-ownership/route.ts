import { circleId, userId } from "@/server/domain/common/ids";
import { getServiceContainer } from "@/server/application/service-container";
import { getSessionUserId } from "@/server/application/auth/session";
import {
  handleError,
  json,
  parseJson,
  requireString,
} from "@/app/api/_helpers";

export async function POST(
  request: Request,
  context: { params: { circleId: string } },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const body = await parseJson<{
      fromUserId?: unknown;
      toUserId?: unknown;
    }>(request);

    const fromUserIdValue = requireString(body.fromUserId, "fromUserId");
    const toUserIdValue = requireString(body.toUserId, "toUserId");

    const { circleParticipationService } = getServiceContainer();
    await circleParticipationService.transferOwnership({
      actorId,
      circleId: circleId(params.circleId),
      fromUserId: userId(fromUserIdValue),
      toUserId: userId(toUserIdValue),
    });

    return json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
