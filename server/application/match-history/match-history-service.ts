import type { MatchHistory } from "@/server/domain/models/match-history/match-history";
import type { MatchId } from "@/server/domain/common/ids";
import type { MatchHistoryRepository } from "@/server/domain/models/match-history/match-history-repository";
import type { MatchRepository } from "@/server/domain/models/match/match-repository";
import type { CircleSessionRepository } from "@/server/domain/models/circle-session/circle-session-repository";
import type { createAccessService } from "@/server/application/authz/access-service";

type AccessService = ReturnType<typeof createAccessService>;

export type MatchHistoryServiceDeps = {
  matchHistoryRepository: MatchHistoryRepository;
  matchRepository: MatchRepository;
  circleSessionRepository: CircleSessionRepository;
  accessService: AccessService;
};

export const createMatchHistoryService = (deps: MatchHistoryServiceDeps) => ({
  async listByMatchId(params: {
    actorId: string;
    matchId: MatchId;
  }): Promise<MatchHistory[]> {
    const match = await deps.matchRepository.findById(params.matchId);
    if (!match) {
      throw new Error("Match not found");
    }
    const session = await deps.circleSessionRepository.findById(
      match.circleSessionId,
    );
    if (!session) {
      throw new Error("CircleSession not found");
    }
    const allowed = await deps.accessService.canViewMatchHistory(
      params.actorId,
      session.circleId as string,
      match.circleSessionId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }
    return deps.matchHistoryRepository.listByMatchId(params.matchId);
  },
});
