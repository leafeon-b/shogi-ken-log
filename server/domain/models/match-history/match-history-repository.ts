import type { MatchHistory } from "@/server/domain/models/match-history/match-history";
import type { MatchId } from "@/server/domain/common/ids";

export type MatchHistoryRepository = {
  listByMatchId(matchId: MatchId): Promise<MatchHistory[]>;
  add(history: MatchHistory): Promise<void>;
};
