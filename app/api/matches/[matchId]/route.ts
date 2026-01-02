import { matchId, userId } from "@/server/domain/common/ids";
import { getServiceContainer } from "@/server/application/service-container";
import { getSessionUserId } from "@/server/application/auth/session";
import {
  handleError,
  json,
  optionalString,
  parseJson,
} from "@/app/api/_helpers";

export async function GET(
  _request: Request,
  context: { params: Promise<{ matchId: string }> },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const { matchService } = getServiceContainer();
    const match = await matchService.getMatch({
      actorId: userId(actorId),
      id: matchId(params.matchId),
    });

    if (!match) {
      return handleError(new Error("Match not found"));
    }

    return json(match);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ matchId: string }> },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const body = await parseJson<{
      player1Id?: unknown;
      player2Id?: unknown;
      outcome?: unknown;
    }>(request);

    const player1IdValue = optionalString(body.player1Id);
    const player2IdValue = optionalString(body.player2Id);
    const outcomeValue = optionalString(body.outcome);

    const { matchService } = getServiceContainer();
    const match = await matchService.updateMatch({
      id: matchId(params.matchId),
      actorId: userId(actorId),
      player1Id: player1IdValue ? userId(player1IdValue) : undefined,
      player2Id: player2IdValue ? userId(player2IdValue) : undefined,
      outcome: outcomeValue,
    });

    return json(match);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ matchId: string }> },
) {
  try {
    const actorId = await getSessionUserId();
    const params = await context.params;
    const { matchService } = getServiceContainer();
    const match = await matchService.deleteMatch({
      id: matchId(params.matchId),
      actorId: userId(actorId),
    });

    return json(match);
  } catch (error) {
    return handleError(error);
  }
}
