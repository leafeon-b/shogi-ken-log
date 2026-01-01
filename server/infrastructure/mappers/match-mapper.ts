import type { Match as PrismaMatch } from "@/generated/prisma/client";
import { restoreMatch } from "@/server/domain/models/match/match";
import type { Match, MatchOutcome } from "@/server/domain/models/match/match";
import { circleSessionId, matchId, userId } from "@/server/domain/common/ids";

export const mapMatchToDomain = (match: PrismaMatch): Match =>
  restoreMatch({
    id: matchId(match.id),
    circleSessionId: circleSessionId(match.circleSessionId),
    order: match.order,
    player1Id: userId(match.player1Id),
    player2Id: userId(match.player2Id),
    outcome: match.outcome as MatchOutcome,
    deletedAt: match.deletedAt,
  });

export const mapMatchToPersistence = (match: Match) => ({
  id: match.id as string,
  circleSessionId: match.circleSessionId as string,
  order: match.order,
  player1Id: match.player1Id as string,
  player2Id: match.player2Id as string,
  outcome: match.outcome,
  deletedAt: match.deletedAt,
});
