import type { UserRepository } from "@/server/domain/models/user/user-repository";
import type { User } from "@/server/domain/models/user/user";
import type { UserId } from "@/server/domain/common/ids";
import { prisma } from "@/server/infrastructure/db";
import {
  mapUserToDomain,
  mapUserToPersistence,
} from "@/server/infrastructure/mappers/user-mapper";

const mapIdsToPersistence = (ids: readonly UserId[]) =>
  ids.map((id) => id as string);

export const prismaUserRepository: UserRepository = {
  async findById(id: UserId): Promise<User | null> {
    const found = await prisma.user.findUnique({
      where: { id: id as string },
    });

    return found ? mapUserToDomain(found) : null;
  },

  async findByIds(ids: readonly UserId[]): Promise<User[]> {
    if (ids.length === 0) {
      return [];
    }
    const uniqueIds = Array.from(new Set(mapIdsToPersistence(ids)));
    const users = await prisma.user.findMany({
      where: { id: { in: uniqueIds } },
    });

    const byId = new Map(users.map((user) => [user.id, mapUserToDomain(user)]));
    return uniqueIds
      .map((id) => byId.get(id))
      .filter((user): user is User => user != null);
  },

  async save(user: User): Promise<void> {
    const data = mapUserToPersistence(user);

    await prisma.user.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        email: data.email,
        image: data.image,
      },
      create: data,
    });
  },
};
