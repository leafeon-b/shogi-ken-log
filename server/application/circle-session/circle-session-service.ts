import type { CircleSession } from "@/server/domain/models/circle-session/circle-session";
import {
  createCircleSession,
  rescheduleCircleSession,
} from "@/server/domain/models/circle-session/circle-session";
import type {
  CircleId,
  CircleSessionId,
} from "@/server/domain/common/ids";
import { assertPositiveInteger } from "@/server/domain/common/validation";
import type { CircleRepository } from "@/server/domain/models/circle/circle-repository";
import type { CircleSessionRepository } from "@/server/domain/models/circle-session/circle-session-repository";
import type { createAccessService } from "@/server/application/authz/access-service";

type AccessService = ReturnType<typeof createAccessService>;

export type CircleSessionServiceDeps = {
  circleRepository: CircleRepository;
  circleSessionRepository: CircleSessionRepository;
  accessService: AccessService;
};

export const createCircleSessionService = (deps: CircleSessionServiceDeps) => ({
  async createCircleSession(params: {
    actorId: string;
    id: CircleSessionId;
    circleId: CircleId;
    sequence: number;
    startsAt: Date;
    endsAt: Date;
    location?: string | null;
    createdAt?: Date;
  }): Promise<CircleSession> {
    const circle = await deps.circleRepository.findById(params.circleId);
    if (!circle) {
      throw new Error("Circle not found");
    }
    const allowed = await deps.accessService.canCreateCircleSession(
      params.actorId,
      params.circleId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }

    const session = createCircleSession({
      id: params.id,
      circleId: params.circleId,
      sequence: params.sequence,
      startsAt: params.startsAt,
      endsAt: params.endsAt,
      location: params.location,
      createdAt: params.createdAt,
    });
    await deps.circleSessionRepository.save(session);
    return session;
  },

  async rescheduleCircleSession(
    actorId: string,
    id: CircleSessionId,
    startsAt: Date,
    endsAt: Date,
  ): Promise<CircleSession> {
    const session = await deps.circleSessionRepository.findById(id);
    if (!session) {
      throw new Error("CircleSession not found");
    }
    const allowed = await deps.accessService.canEditCircleSession(
      actorId,
      id as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }

    const updated = rescheduleCircleSession(session, startsAt, endsAt);
    await deps.circleSessionRepository.save(updated);
    return updated;
  },

  async updateCircleSessionDetails(
    actorId: string,
    id: CircleSessionId,
    params: {
      sequence?: number;
      startsAt?: Date;
      endsAt?: Date;
      location?: string | null;
    },
  ): Promise<CircleSession> {
    const session = await deps.circleSessionRepository.findById(id);
    if (!session) {
      throw new Error("CircleSession not found");
    }
    const allowed = await deps.accessService.canEditCircleSession(
      actorId,
      id as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }

    let updated = session;

    if (params.startsAt || params.endsAt) {
      if (!params.startsAt || !params.endsAt) {
        throw new Error("startsAt and endsAt must both be provided");
      }
      updated = rescheduleCircleSession(updated, params.startsAt, params.endsAt);
    }

    if (params.sequence != null) {
      updated = {
        ...updated,
        sequence: assertPositiveInteger(params.sequence, "sequence"),
      };
    }

    if (params.location !== undefined) {
      updated = {
        ...updated,
        location: params.location ?? null,
      };
    }

    await deps.circleSessionRepository.save(updated);
    return updated;
  },

  async getCircleSession(
    actorId: string,
    id: CircleSessionId,
  ): Promise<CircleSession | null> {
    const session = await deps.circleSessionRepository.findById(id);
    if (!session) {
      return null;
    }
    const allowed = await deps.accessService.canViewCircleSession(
      actorId,
      session.circleId as string,
      id as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }
    return session;
  },

  async listByCircleId(
    actorId: string,
    circleId: CircleId,
  ): Promise<CircleSession[]> {
    const circle = await deps.circleRepository.findById(circleId);
    if (!circle) {
      throw new Error("Circle not found");
    }
    const allowed = await deps.accessService.canViewCircle(
      actorId,
      circleId as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }
    return deps.circleSessionRepository.listByCircleId(circleId);
  },

  async deleteCircleSession(actorId: string, id: CircleSessionId): Promise<void> {
    const session = await deps.circleSessionRepository.findById(id);
    if (!session) {
      throw new Error("CircleSession not found");
    }
    const allowed = await deps.accessService.canDeleteCircleSession(
      actorId,
      id as string,
    );
    if (!allowed) {
      throw new Error("Forbidden");
    }
    await deps.circleSessionRepository.delete(id);
  },
});
