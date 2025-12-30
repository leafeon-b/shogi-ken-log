import { createAuthHandler } from "@/server/application/auth/auth-handler";

const handler = createAuthHandler();

export { handler as GET, handler as POST };
