import type {
  SignupRepository,
  SignupData,
} from "@/server/domain/models/user/signup-repository";
import type { UserId } from "@/server/domain/common/ids";
import { userId } from "@/server/domain/common/ids";
import { prisma, type PrismaClientLike } from "@/server/infrastructure/db";
import { hashPassword } from "@/server/infrastructure/auth/password";

export const createPrismaSignupRepository = (
  client: PrismaClientLike,
): SignupRepository => ({
  async emailExists(email: string): Promise<boolean> {
    const existing = await client.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return existing !== null;
  },

  async createUser(data: SignupData): Promise<UserId> {
    const passwordHash = hashPassword(data.password);
    const user = await client.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
      },
      select: { id: true },
    });
    return userId(user.id);
  },
});

export const prismaSignupRepository = createPrismaSignupRepository(prisma);
