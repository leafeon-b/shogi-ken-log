import { getServerSession } from "next-auth";
import { createAuthOptions } from "@/server/infrastructure/auth/nextauth-handler";

export const getSession = async () => getServerSession(createAuthOptions());

export const getSessionUserId = async (): Promise<string> => {
  const session = await getSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
};
