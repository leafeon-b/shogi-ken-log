import type { MatchHistory as PrismaMatchHistory } from "@/generated/prisma/client";
import { createMatchHistory } from "@/server/domain/models/match-history/match-history";
import type {
  MatchHistory,
  MatchHistoryAction,
} from "@/server/domain/models/match-history/match-history";
import type { MatchOutcome } from "@/server/domain/models/match/match";
import { matchHistoryId, matchId, userId } from "@/server/domain/common/ids";

export const mapMatchHistoryToDomain = (
  history: PrismaMatchHistory,
): MatchHistory =>
  createMatchHistory({
    id: matchHistoryId(history.id),
    matchId: matchId(history.matchId),
    editorId: userId(history.editorId),
    action: history.action as MatchHistoryAction,
    createdAt: history.createdAt,
    order: history.order,
    player1Id: userId(history.player1Id),
    player2Id: userId(history.player2Id),
    outcome: history.outcome as MatchOutcome,
  });

export const mapMatchHistoryToPersistence = (history: MatchHistory) => ({
  id: history.id as string,
  matchId: history.matchId as string,
  editorId: history.editorId as string,
  action: history.action,
  createdAt: history.createdAt,
  order: history.order,
  player1Id: history.player1Id as string,
  player2Id: history.player2Id as string,
  outcome: history.outcome,
});
