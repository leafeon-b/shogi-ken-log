import type { CircleSessionId, UserId } from "@/server/domain/common/ids";
import type { CircleSessionRepository } from "@/server/domain/models/circle-session/circle-session-repository";
import type { MatchRepository } from "@/server/domain/models/match/match-repository";
import type { CircleSessionParticipationRepository } from "@/server/domain/models/circle-session/circle-session-participation-repository";
import type { createAccessService } from "@/server/application/authz/access-service";
import { assertCanRemoveCircleSessionParticipant } from "@/server/domain/services/circle-session/participation";
import {
  assertSingleCircleSessionOwner,
  transferCircleSessionOwnership,
} from "@/server/domain/services/authz/ownership";
import { CircleSessionRole } from "@/server/domain/services/authz/roles";
import type { CircleSessionParticipant } from "@/server/domain/models/circle-session/circle-session-participant";

type AccessService = ReturnType<typeof createAccessService>;

export type CircleSessionParticipationServiceDeps = {
  matchRepository: MatchRepository;
  circleSessionRepository: CircleSessionRepository;
  circleSessionParticipationRepository: CircleSessionParticipationRepository;
  accessService: AccessService;
};

export const createCircleSessionParticipationService = (
  deps: CircleSessionParticipationServiceDeps,
) => ({
  async listParticipants(params: {
    actorId: string;
    circleSessionId: CircleSessionId;
  }): Promise<CircleSessionParticipant[]> {
    const session = await deps.circleSessionRepository.findById(
      params.circleSessionId,
    );
    if (!session) {
      throw new Error("CircleSession not found");
    }
    const allowed = await deps.accessService.canViewCircleSession(
      params.actorId,
      session.circleId as string,
      params.circleSessionId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }
    return deps.circleSessionParticipationRepository.listParticipants(
      params.circleSessionId,
    );
  },

  async addParticipant(params: {
    actorId: string;
    circleSessionId: CircleSessionId;
    userId: UserId;
    role: CircleSessionRole;
  }): Promise<void> {
    const session = await deps.circleSessionRepository.findById(
      params.circleSessionId,
    );
    if (!session) {
      throw new Error("CircleSession not found");
    }
    const allowed = await deps.accessService.canAddCircleSessionMember(
      params.actorId,
      params.circleSessionId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }
    const participants =
      await deps.circleSessionParticipationRepository.listParticipants(
        params.circleSessionId,
      );

    if (participants.some((member) => member.userId === params.userId)) {
      throw new Error("Participant already exists");
    }

    const hasOwner = participants.some(
      (member) => member.role === CircleSessionRole.CircleSessionOwner,
    );

    if (!hasOwner && params.role !== CircleSessionRole.CircleSessionOwner) {
      throw new Error("CircleSession must have exactly one owner");
    }

    if (hasOwner && params.role === CircleSessionRole.CircleSessionOwner) {
      throw new Error("CircleSession must have exactly one owner");
    }

    await deps.circleSessionParticipationRepository.addParticipant(
      params.circleSessionId,
      params.userId,
      params.role,
    );
  },

  async changeParticipantRole(params: {
    actorId: string;
    circleSessionId: CircleSessionId;
    userId: UserId;
    role: CircleSessionRole;
  }): Promise<void> {
    const session = await deps.circleSessionRepository.findById(
      params.circleSessionId,
    );
    if (!session) {
      throw new Error("CircleSession not found");
    }
    const allowed = await deps.accessService.canChangeCircleSessionMemberRole(
      params.actorId,
      params.userId as string,
      params.circleSessionId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }
    if (params.role === CircleSessionRole.CircleSessionOwner) {
      throw new Error("Use transferOwnership to assign owner");
    }

    const participants =
      await deps.circleSessionParticipationRepository.listParticipants(
        params.circleSessionId,
      );
    const target = participants.find(
      (member) => member.userId === params.userId,
    );

    if (!target) {
      throw new Error("Participant not found");
    }

    if (target.role === CircleSessionRole.CircleSessionOwner) {
      throw new Error("Use transferOwnership to change owner");
    }

    await deps.circleSessionParticipationRepository.updateParticipantRole(
      params.circleSessionId,
      params.userId,
      params.role,
    );
  },

  async transferOwnership(params: {
    actorId: string;
    circleSessionId: CircleSessionId;
    fromUserId: UserId;
    toUserId: UserId;
  }): Promise<void> {
    const session = await deps.circleSessionRepository.findById(
      params.circleSessionId,
    );
    if (!session) {
      throw new Error("CircleSession not found");
    }
    const allowed = await deps.accessService.canTransferCircleSessionOwnership(
      params.actorId,
      params.circleSessionId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }
    const participants =
      await deps.circleSessionParticipationRepository.listParticipants(
        params.circleSessionId,
      );

    const updated = transferCircleSessionOwnership(
      participants,
      params.fromUserId,
      params.toUserId,
    );
    assertSingleCircleSessionOwner(updated);

    const before = new Map(
      participants.map((member) => [member.userId, member.role]),
    );

    for (const member of updated) {
      if (before.get(member.userId) !== member.role) {
        await deps.circleSessionParticipationRepository.updateParticipantRole(
          params.circleSessionId,
          member.userId,
          member.role,
        );
      }
    }
  },

  async removeParticipant(params: {
    actorId: string;
    circleSessionId: CircleSessionId;
    userId: UserId;
  }): Promise<void> {
    const session = await deps.circleSessionRepository.findById(
      params.circleSessionId,
    );
    if (!session) {
      throw new Error("CircleSession not found");
    }
    const allowed = await deps.accessService.canRemoveCircleSessionMember(
      params.actorId,
      params.circleSessionId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }
    const matches = await deps.matchRepository.listByCircleSessionId(
      params.circleSessionId,
    );
    assertCanRemoveCircleSessionParticipant(matches, params.userId);
    await deps.circleSessionParticipationRepository.removeParticipant(
      params.circleSessionId,
      params.userId,
    );
  },
});
