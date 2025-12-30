import { describe, expect, test, vi } from "vitest";

const getServerSessionMock = vi.hoisted(() => vi.fn());
const createAuthOptionsMock = vi.hoisted(() => vi.fn(() => ({ kind: "options" })));

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/server/infrastructure/auth/nextauth-handler", () => ({
  createAuthOptions: createAuthOptionsMock,
}));

import { getSessionUserId } from "@/server/application/auth/session";

describe("getSessionUserId", () => {
  test("セッションからユーザーIDを取得する", async () => {
    getServerSessionMock.mockResolvedValueOnce({
      user: { id: "user-1" },
    });

    await expect(getSessionUserId()).resolves.toBe("user-1");
    expect(createAuthOptionsMock).toHaveBeenCalledOnce();
  });

  test("ユーザーIDがない場合はUnauthorized", async () => {
    getServerSessionMock.mockResolvedValueOnce({ user: {} });

    await expect(getSessionUserId()).rejects.toThrow("Unauthorized");
  });
});
