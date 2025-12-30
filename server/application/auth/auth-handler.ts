import { createNextAuthHandler } from "@/server/infrastructure/auth/nextauth-handler";

export const createAuthHandler = () => createNextAuthHandler();
