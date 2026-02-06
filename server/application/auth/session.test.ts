import { describe, expect, test, vi } from "vitest";
import type { SessionService } from "@/server/domain/services/auth/session-service";
import { createGetSessionUserId } from "@/server/application/auth/session";

const createMockSessionService = (): SessionService => ({
  getSession: vi.fn(),
});

describe("getSessionUserId", () => {
  test("セッションからユーザーIDを取得する", async () => {
    const mockService = createMockSessionService();
    vi.mocked(mockService.getSession).mockResolvedValueOnce({
      user: { id: "user-1" },
    });

    const getSessionUserId = createGetSessionUserId(mockService);

    await expect(getSessionUserId()).resolves.toBe("user-1");
    expect(mockService.getSession).toHaveBeenCalledOnce();
  });

  test("ユーザーIDがない場合はUnauthorized", async () => {
    const mockService = createMockSessionService();
    vi.mocked(mockService.getSession).mockResolvedValueOnce({
      user: { id: "" },
    });

    const getSessionUserId = createGetSessionUserId(mockService);

    await expect(getSessionUserId()).rejects.toThrow("Unauthorized");
  });

  test("セッションがnullの場合はUnauthorized", async () => {
    const mockService = createMockSessionService();
    vi.mocked(mockService.getSession).mockResolvedValueOnce(null);

    const getSessionUserId = createGetSessionUserId(mockService);

    await expect(getSessionUserId()).rejects.toThrow("Unauthorized");
  });
});
