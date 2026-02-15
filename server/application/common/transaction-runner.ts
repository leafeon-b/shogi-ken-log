import type { MatchRepository } from "@/server/domain/models/match/match-repository";
import type { MatchHistoryRepository } from "@/server/domain/models/match-history/match-history-repository";

export type UnitOfWork = {
  matchRepository: MatchRepository;
  matchHistoryRepository: MatchHistoryRepository;
};

export type TransactionRunner = <T>(
  operation: (uow: UnitOfWork) => Promise<T>,
) => Promise<T>;
