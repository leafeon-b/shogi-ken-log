import type { CircleSessionParticipationRepository } from "@/server/domain/models/circle-session/circle-session-participation-repository";
import type {
  CircleSessionId,
  UserId,
} from "@/server/domain/common/ids";
import { prisma } from "@/server/infrastructure/db";
import {
  mapCircleSessionIdToPersistence,
  mapCircleSessionParticipantFromPersistence,
  mapCircleSessionRoleToPersistence,
  mapUserIdsToPersistence,
} from "@/server/infrastructure/mappers/circle-session-participation-mapper";
import type { CircleSessionRole } from "@/server/domain/services/authz/roles";
import type { CircleSessionParticipant } from "@/server/domain/models/circle-session/circle-session-participant";

export const prismaCircleSessionParticipationRepository: CircleSessionParticipationRepository = {
  async listParticipants(
    circleSessionId: CircleSessionId,
  ): Promise<CircleSessionParticipant[]> {
    const persistedCircleSessionId =
      mapCircleSessionIdToPersistence(circleSessionId);

    const participants = await prisma.circleSessionMembership.findMany({
      where: { circleSessionId: persistedCircleSessionId },
      select: { userId: true, role: true },
    });

    return participants.map(mapCircleSessionParticipantFromPersistence);
  },

  async addParticipant(
    circleSessionId: CircleSessionId,
    userId: UserId,
    role: CircleSessionRole,
  ): Promise<void> {
    const persistedCircleSessionId =
      mapCircleSessionIdToPersistence(circleSessionId);
    const [persistedUserId] = mapUserIdsToPersistence([userId]);
    const persistedRole = mapCircleSessionRoleToPersistence(role);

    await prisma.circleSessionMembership.create({
      data: {
        circleSessionId: persistedCircleSessionId,
        userId: persistedUserId,
        role: persistedRole,
      },
    });
  },

  async updateParticipantRole(
    circleSessionId: CircleSessionId,
    userId: UserId,
    role: CircleSessionRole,
  ): Promise<void> {
    const persistedCircleSessionId =
      mapCircleSessionIdToPersistence(circleSessionId);
    const [persistedUserId] = mapUserIdsToPersistence([userId]);
    const persistedRole = mapCircleSessionRoleToPersistence(role);

    await prisma.circleSessionMembership.update({
      where: {
        userId_circleSessionId: {
          userId: persistedUserId,
          circleSessionId: persistedCircleSessionId,
        },
      },
      data: {
        role: persistedRole,
      },
    });
  },

  async areParticipants(
    circleSessionId: CircleSessionId,
    userIds: readonly UserId[],
  ): Promise<boolean> {
    const persistedCircleSessionId =
      mapCircleSessionIdToPersistence(circleSessionId);
    const uniqueIds = Array.from(
      new Set(mapUserIdsToPersistence(userIds)),
    );
    if (uniqueIds.length === 0) {
      return false;
    }

    const count = await prisma.circleSessionMembership.count({
      where: {
        circleSessionId: persistedCircleSessionId,
        userId: { in: uniqueIds },
      },
    });

    return count === uniqueIds.length;
  },

  async removeParticipant(
    circleSessionId: CircleSessionId,
    userId: UserId,
  ): Promise<void> {
    const persistedCircleSessionId =
      mapCircleSessionIdToPersistence(circleSessionId);
    const [persistedUserId] = mapUserIdsToPersistence([userId]);

    await prisma.circleSessionMembership.deleteMany({
      where: {
        circleSessionId: persistedCircleSessionId,
        userId: persistedUserId,
      },
    });
  },
};
