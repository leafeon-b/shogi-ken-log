import type { AuthzRepository } from "@/server/domain/services/authz/authz-repository";
import {
  mapCircleMembershipFromPersistence,
  mapCircleSessionMembershipFromPersistence,
} from "@/server/infrastructure/mappers/authz-mapper";
import { prisma } from "@/server/infrastructure/db";

export const prismaAuthzRepository: AuthzRepository = {
  async isRegisteredUser(userId: string): Promise<boolean> {
    const found = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    return found != null;
  },

  async findCircleMembership(userId: string, circleId: string) {
    const membership = await prisma.circleMembership.findFirst({
      where: { userId, circleId },
      select: { role: true },
    });

    return mapCircleMembershipFromPersistence(membership?.role ?? null);
  },

  async findCircleSessionMembership(userId: string, circleSessionId: string) {
    const membership = await prisma.circleSessionMembership.findFirst({
      where: { userId, circleSessionId },
      select: { role: true },
    });

    return mapCircleSessionMembershipFromPersistence(membership?.role ?? null);
  },
};
