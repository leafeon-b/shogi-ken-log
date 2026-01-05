import { afterEach, describe, expect, test, vi } from "vitest";

const prismaValue = vi.hoisted(() => ({ prisma: { kind: "prisma" } }));
const nextAuthMock = vi.hoisted(() => vi.fn());
const prismaAdapterMock = vi.hoisted(() => vi.fn());
const credentialsMock = vi.hoisted(() => vi.fn());
const googleMock = vi.hoisted(() => vi.fn());

vi.mock("@/server/infrastructure/db", () => prismaValue);
vi.mock("next-auth", () => ({ default: nextAuthMock }));
vi.mock("@auth/prisma-adapter", () => ({ PrismaAdapter: prismaAdapterMock }));
vi.mock("next-auth/providers/credentials", () => ({
  default: credentialsMock,
}));
vi.mock("next-auth/providers/google", () => ({ default: googleMock }));

import { prisma } from "@/server/infrastructure/db";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { createNextAuthHandler } from "@/server/infrastructure/auth/nextauth-handler";

const ORIGINAL_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const ORIGINAL_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

describe("NextAuth ハンドラ", () => {
  afterEach(() => {
    process.env.GOOGLE_CLIENT_ID = ORIGINAL_CLIENT_ID;
    process.env.GOOGLE_CLIENT_SECRET = ORIGINAL_CLIENT_SECRET;
    vi.clearAllMocks();
  });

  test("PrismaAdapter と Google プロバイダを使って設定を生成する", () => {
    process.env.GOOGLE_CLIENT_ID = "client-id";
    process.env.GOOGLE_CLIENT_SECRET = "client-secret";

    const adapter = { kind: "adapter" } as unknown as ReturnType<
      typeof PrismaAdapter
    >;
    const credentialsProvider = {
      kind: "credentials-provider",
    } as unknown as ReturnType<typeof Credentials>;
    const provider = { kind: "google-provider" } as unknown as ReturnType<
      typeof Google
    >;
    vi.mocked(PrismaAdapter).mockReturnValue(adapter);
    vi.mocked(Credentials).mockReturnValue(credentialsProvider);
    vi.mocked(Google).mockReturnValue(provider);
    vi.mocked(NextAuth).mockReturnValue("handler");

    const handler = createNextAuthHandler();

    expect(handler).toBe("handler");
    expect(PrismaAdapter).toHaveBeenCalledWith(prisma);
    expect(Credentials).toHaveBeenCalledWith({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: expect.any(Function),
    });
    expect(Google).toHaveBeenCalledWith({
      clientId: "client-id",
      clientSecret: "client-secret",
    });
    expect(NextAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        adapter,
        providers: [credentialsProvider, provider],
        session: { strategy: "jwt" },
        debug: true,
        callbacks: {
          jwt: expect.any(Function),
          session: expect.any(Function),
        },
      }),
    );
  });
});
