import { createNextAuthHandler } from "@/server/infrastructure/auth/nextauth-handler";

const handler = createNextAuthHandler();

export { handler as GET, handler as POST };
