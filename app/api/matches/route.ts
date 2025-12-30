import { randomUUID } from "crypto";
import {
  circleSessionId,
  matchId,
  userId,
} from "@/server/domain/common/ids";
import { getServiceContainer } from "@/server/application/service-container";
import { getSessionUserId } from "@/server/application/auth/session";
import {
  handleError,
  json,
  parseJson,
  requireNumber,
  requireString,
} from "@/app/api/_helpers";

export async function GET(request: Request) {
  try {
    const actorId = await getSessionUserId();
    const url = new URL(request.url);
    const circleSessionIdParam = url.searchParams.get("circleSessionId");
    if (!circleSessionIdParam) {
      return handleError(new Error("circleSessionId is required"));
    }

    const { matchService } = getServiceContainer();
    const matches = await matchService.listByCircleSessionId(
      {
        actorId: userId(actorId),
        circleSessionId: circleSessionId(circleSessionIdParam),
      },
    );

    return json(matches);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const actorId = await getSessionUserId();
    const body = await parseJson<{
      circleSessionId?: unknown;
      order?: unknown;
      player1Id?: unknown;
      player2Id?: unknown;
      outcome?: unknown;
    }>(request);

    const circleSessionIdValue = requireString(
      body.circleSessionId,
      "circleSessionId",
    );
    const order = requireNumber(body.order, "order");
    const player1IdValue = requireString(body.player1Id, "player1Id");
    const player2IdValue = requireString(body.player2Id, "player2Id");
    const outcome = body.outcome;

    const { matchService } = getServiceContainer();
    const match = await matchService.recordMatch({
      actorId: userId(actorId),
      id: matchId(randomUUID()),
      circleSessionId: circleSessionId(circleSessionIdValue),
      order,
      player1Id: userId(player1IdValue),
      player2Id: userId(player2IdValue),
      outcome: typeof outcome === "string" ? outcome : undefined,
    });

    return json(match, 201);
  } catch (error) {
    return handleError(error);
  }
}
