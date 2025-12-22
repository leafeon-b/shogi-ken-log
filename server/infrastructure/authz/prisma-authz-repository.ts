import type { AuthzRepository } from "@/server/application/authz/access-service";
import {
  circleMembershipFromRole,
  circleSessionMembershipFromRole,
} from "@/server/domain/authz/memberships";
import { prisma } from "@/server/db";

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

    return circleMembershipFromRole(membership?.role ?? null);
  },

  async findCircleSessionMembership(userId: string, circleSessionId: string) {
    const membership = await prisma.circleSessionMembership.findFirst({
      where: { userId, circleSessionId },
      select: { role: true },
    });

    return circleSessionMembershipFromRole(membership?.role ?? null);
  },
};
