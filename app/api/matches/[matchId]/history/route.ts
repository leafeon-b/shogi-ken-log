import { matchId } from "@/server/domain/common/ids";
import { getServiceContainer } from "@/server/application/service-container";
import { getSessionUserId } from "@/server/application/auth/session";
import { handleError, json } from "@/app/api/_helpers";

export async function GET(
  _request: Request,
  context: { params: { matchId: string } },
) {
  try {
    const actorId = await getSessionUserId();
    const { matchHistoryService } = getServiceContainer();
    const params = await context.params;
    const histories = await matchHistoryService.listByMatchId({
      actorId,
      matchId: matchId(params.matchId),
    });

    return json(histories);
  } catch (error) {
    return handleError(error);
  }
}
