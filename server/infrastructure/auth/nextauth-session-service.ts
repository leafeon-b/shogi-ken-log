import { getServerSession } from "next-auth";
import type { SessionService } from "@/server/domain/services/auth/session-service";
import { createAuthOptions } from "./nextauth-handler";

export const nextAuthSessionService: SessionService = {
  async getSession() {
    const session = await getServerSession(createAuthOptions());
    if (!session?.user) {
      return null;
    }
    const user = session.user as {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
    if (!user.id) {
      return null;
    }
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    };
  },
};
