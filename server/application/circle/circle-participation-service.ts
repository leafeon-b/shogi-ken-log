import type { CircleId, UserId } from "@/server/domain/common/ids";
import type { CircleParticipationRepository } from "@/server/domain/models/circle/circle-participation-repository";
import type { CircleParticipant } from "@/server/domain/models/circle/circle-participant";
import type { CircleRepository } from "@/server/domain/models/circle/circle-repository";
import type { createAccessService } from "@/server/application/authz/access-service";
import {
  assertSingleCircleOwner,
  transferCircleOwnership,
} from "@/server/domain/services/authz/ownership";
import { CircleRole } from "@/server/domain/services/authz/roles";

type AccessService = ReturnType<typeof createAccessService>;

export type CircleParticipationServiceDeps = {
  circleParticipationRepository: CircleParticipationRepository;
  circleRepository: CircleRepository;
  accessService: AccessService;
};

export const createCircleParticipationService = (
  deps: CircleParticipationServiceDeps,
) => ({
  async listParticipants(params: {
    actorId: string;
    circleId: CircleId;
  }): Promise<CircleParticipant[]> {
    const circle = await deps.circleRepository.findById(params.circleId);
    if (!circle) {
      throw new Error("Circle not found");
    }

    const allowed = await deps.accessService.canViewCircle(
      params.actorId,
      params.circleId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }

    return deps.circleParticipationRepository.listParticipants(params.circleId);
  },

  async addParticipant(params: {
    actorId: string;
    circleId: CircleId;
    userId: UserId;
    role: CircleRole;
  }): Promise<void> {
    const circle = await deps.circleRepository.findById(params.circleId);
    if (!circle) {
      throw new Error("Circle not found");
    }

    const allowed = await deps.accessService.canAddCircleMember(
      params.actorId,
      params.circleId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }

    const participants =
      await deps.circleParticipationRepository.listParticipants(
        params.circleId,
      );

    if (participants.some((member) => member.userId === params.userId)) {
      throw new Error("Participant already exists");
    }

    const hasOwner = participants.some(
      (member) => member.role === CircleRole.CircleOwner,
    );

    if (!hasOwner && params.role !== CircleRole.CircleOwner) {
      throw new Error("Circle must have exactly one owner");
    }

    if (hasOwner && params.role === CircleRole.CircleOwner) {
      throw new Error("Circle must have exactly one owner");
    }

    await deps.circleParticipationRepository.addParticipant(
      params.circleId,
      params.userId,
      params.role,
    );
  },

  async changeParticipantRole(params: {
    actorId: string;
    circleId: CircleId;
    userId: UserId;
    role: CircleRole;
  }): Promise<void> {
    const circle = await deps.circleRepository.findById(params.circleId);
    if (!circle) {
      throw new Error("Circle not found");
    }

    const allowed = await deps.accessService.canChangeCircleMemberRole(
      params.actorId,
      params.userId as string,
      params.circleId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }

    if (params.role === CircleRole.CircleOwner) {
      throw new Error("Use transferOwnership to assign owner");
    }

    const participants =
      await deps.circleParticipationRepository.listParticipants(
        params.circleId,
      );
    const target = participants.find(
      (member) => member.userId === params.userId,
    );

    if (!target) {
      throw new Error("Participant not found");
    }

    if (target.role === CircleRole.CircleOwner) {
      throw new Error("Use transferOwnership to change owner");
    }

    await deps.circleParticipationRepository.updateParticipantRole(
      params.circleId,
      params.userId,
      params.role,
    );
  },

  async transferOwnership(params: {
    actorId: string;
    circleId: CircleId;
    fromUserId: UserId;
    toUserId: UserId;
  }): Promise<void> {
    const circle = await deps.circleRepository.findById(params.circleId);
    if (!circle) {
      throw new Error("Circle not found");
    }

    const allowed = await deps.accessService.canTransferCircleOwnership(
      params.actorId,
      params.circleId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }

    const participants =
      await deps.circleParticipationRepository.listParticipants(
        params.circleId,
      );

    const updated = transferCircleOwnership(
      participants,
      params.fromUserId,
      params.toUserId,
    );
    assertSingleCircleOwner(updated);

    const before = new Map(
      participants.map((member) => [member.userId, member.role]),
    );

    for (const member of updated) {
      if (before.get(member.userId) !== member.role) {
        await deps.circleParticipationRepository.updateParticipantRole(
          params.circleId,
          member.userId,
          member.role,
        );
      }
    }
  },

  async removeParticipant(params: {
    actorId: string;
    circleId: CircleId;
    userId: UserId;
  }): Promise<void> {
    const circle = await deps.circleRepository.findById(params.circleId);
    if (!circle) {
      throw new Error("Circle not found");
    }

    const allowed = await deps.accessService.canRemoveCircleMember(
      params.actorId,
      params.circleId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }

    const participants =
      await deps.circleParticipationRepository.listParticipants(
        params.circleId,
      );
    const target = participants.find(
      (member) => member.userId === params.userId,
    );

    if (!target) {
      throw new Error("Participant not found");
    }

    if (target.role === CircleRole.CircleOwner) {
      throw new Error("Use transferOwnership to remove owner");
    }

    await deps.circleParticipationRepository.removeParticipant(
      params.circleId,
      params.userId,
    );
  },
});
