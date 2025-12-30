import type { Match } from "@/server/domain/models/match/match";
import type { CircleSessionId, MatchId } from "@/server/domain/common/ids";

export type MatchRepository = {
  findById(id: MatchId): Promise<Match | null>;
  listByCircleSessionId(circleSessionId: CircleSessionId): Promise<Match[]>;
  save(match: Match): Promise<void>;
};
