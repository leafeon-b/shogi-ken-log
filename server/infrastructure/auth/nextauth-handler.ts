import { prisma } from "@/server/infrastructure/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const createAuthOptions = () => ({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    session({
      session,
      user,
    }: {
      session: { user?: { id?: string } };
      user: { id: string };
    }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});

export const createNextAuthHandler = () => NextAuth(createAuthOptions());
