import { randomUUID } from "crypto";
import { createCircleService } from "@/server/application/circle/circle-service";
import { createCircleParticipationService } from "@/server/application/circle/circle-participation-service";
import { createCircleSessionService } from "@/server/application/circle-session/circle-session-service";
import { createCircleSessionParticipationService } from "@/server/application/circle-session/circle-session-participation-service";
import { createMatchService } from "@/server/application/match/match-service";
import { createMatchHistoryService } from "@/server/application/match-history/match-history-service";
import { createAccessService } from "@/server/application/authz/access-service";
import type { CircleRepository } from "@/server/domain/models/circle/circle-repository";
import type { CircleParticipationRepository } from "@/server/domain/models/circle/circle-participation-repository";
import type { CircleSessionRepository } from "@/server/domain/models/circle-session/circle-session-repository";
import type { MatchRepository } from "@/server/domain/models/match/match-repository";
import type { MatchHistoryRepository } from "@/server/domain/models/match-history/match-history-repository";
import type { CircleSessionParticipationRepository } from "@/server/domain/models/circle-session/circle-session-participation-repository";
import type { TransactionRunner } from "@/server/application/match/match-service";
import { matchHistoryId } from "@/server/domain/common/ids";
import type { AuthzRepository } from "@/server/domain/services/authz/authz-repository";
import { prismaCircleRepository } from "@/server/infrastructure/repository/circle/prisma-circle-repository";
import { prismaCircleParticipationRepository } from "@/server/infrastructure/repository/circle/prisma-circle-participation-repository";
import { prismaCircleSessionRepository } from "@/server/infrastructure/repository/circle-session/prisma-circle-session-repository";
import { prismaMatchRepository } from "@/server/infrastructure/repository/match/prisma-match-repository";
import { prismaMatchHistoryRepository } from "@/server/infrastructure/repository/match-history/prisma-match-history-repository";
import { prismaCircleSessionParticipationRepository } from "@/server/infrastructure/repository/circle-session/prisma-circle-session-participation-repository";
import { prismaAuthzRepository } from "@/server/infrastructure/repository/authz/prisma-authz-repository";

export type ServiceContainer = {
  circleService: ReturnType<typeof createCircleService>;
  circleParticipationService: ReturnType<
    typeof createCircleParticipationService
  >;
  circleSessionService: ReturnType<typeof createCircleSessionService>;
  circleSessionParticipationService: ReturnType<
    typeof createCircleSessionParticipationService
  >;
  accessService: ReturnType<typeof createAccessService>;
  matchService: ReturnType<typeof createMatchService>;
  matchHistoryService: ReturnType<typeof createMatchHistoryService>;
};

export type ServiceContainerDeps = {
  circleRepository?: CircleRepository;
  circleParticipationRepository?: CircleParticipationRepository;
  circleSessionRepository?: CircleSessionRepository;
  matchRepository?: MatchRepository;
  matchHistoryRepository?: MatchHistoryRepository;
  circleSessionParticipationRepository?: CircleSessionParticipationRepository;
  authzRepository?: AuthzRepository;
  generateMatchHistoryId?: () => ReturnType<typeof matchHistoryId>;
  transactionRunner?: TransactionRunner;
};

export const createServiceContainer = (
  deps: ServiceContainerDeps = {},
): ServiceContainer => {
  const circleRepository = deps.circleRepository ?? prismaCircleRepository;
  const circleParticipationRepository =
    deps.circleParticipationRepository ?? prismaCircleParticipationRepository;
  const circleSessionRepository =
    deps.circleSessionRepository ?? prismaCircleSessionRepository;
  const matchRepository = deps.matchRepository ?? prismaMatchRepository;
  const matchHistoryRepository =
    deps.matchHistoryRepository ?? prismaMatchHistoryRepository;
  const circleSessionParticipationRepository =
    deps.circleSessionParticipationRepository ??
    prismaCircleSessionParticipationRepository;
  const authzRepository = deps.authzRepository ?? prismaAuthzRepository;
  const accessService = createAccessService(authzRepository);
  const generateMatchHistoryId =
    deps.generateMatchHistoryId ?? (() => matchHistoryId(randomUUID()));

  return {
    circleService: createCircleService({
      circleRepository,
      circleParticipationRepository,
      accessService,
    }),
    circleParticipationService: createCircleParticipationService({
      circleParticipationRepository,
      circleRepository,
      accessService,
    }),
    circleSessionService: createCircleSessionService({
      circleRepository,
      circleSessionRepository,
      accessService,
    }),
    circleSessionParticipationService: createCircleSessionParticipationService({
      matchRepository,
      circleSessionRepository,
      circleSessionParticipationRepository,
      accessService,
    }),
    matchService: createMatchService({
      matchRepository,
      matchHistoryRepository,
      circleSessionParticipationRepository,
      circleSessionRepository,
      accessService,
      generateMatchHistoryId,
      transactionRunner: deps.transactionRunner,
    }),
    accessService,
    matchHistoryService: createMatchHistoryService({
      matchHistoryRepository,
      matchRepository,
      circleSessionRepository,
      accessService,
    }),
  };
};

export const getServiceContainer = () => createServiceContainer();
