import { prisma } from "@/server/infrastructure/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type AuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

export const createAuthOptions = (): AuthOptions => ({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});

export const createNextAuthHandler = () => NextAuth(createAuthOptions());
