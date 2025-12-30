import { getServerSession } from "next-auth";
import { createAuthOptions } from "@/server/infrastructure/auth/nextauth-handler";

export const getSessionUserId = async (): Promise<string> => {
  const session = await getServerSession(createAuthOptions());
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
};
