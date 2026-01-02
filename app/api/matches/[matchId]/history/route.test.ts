import { beforeEach, describe, expect, test, vi } from "vitest";

const matchHistoryService = {
  listByMatchId: vi.fn(),
};
const getSessionUserId = vi.fn();

vi.mock("@/server/application/service-container", () => ({
  getServiceContainer: () => ({ matchHistoryService }),
}));
vi.mock("@/server/application/auth/session", () => ({
  getSessionUserId: () => getSessionUserId(),
}));

import { GET } from "@/app/api/matches/[matchId]/history/route";

describe("/api/matches/[matchId]/history", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("GET は履歴一覧を返す", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    matchHistoryService.listByMatchId.mockResolvedValueOnce([]);

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ matchId: "match-1" }),
    });

    expect(matchHistoryService.listByMatchId).toHaveBeenCalledWith(
      expect.objectContaining({ actorId: "user-1" }),
    );
    expect(response.status).toBe(200);
  });

  test("GET は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ matchId: "match-1" }),
    });

    expect(matchHistoryService.listByMatchId).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("GET は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    matchHistoryService.listByMatchId.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ matchId: "match-1" }),
    });

    expect(response.status).toBe(403);
  });
});
