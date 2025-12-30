import { beforeEach, describe, expect, test, vi } from "vitest";

const matchService = {
  getMatch: vi.fn(),
  updateMatch: vi.fn(),
  deleteMatch: vi.fn(),
};
const getSessionUserId = vi.fn();

vi.mock("@/server/application/service-container", () => ({
  getServiceContainer: () => ({ matchService }),
}));
vi.mock("@/server/application/auth/session", () => ({
  getSessionUserId: () => getSessionUserId(),
}));

import { DELETE, GET, PATCH } from "@/app/api/matches/[matchId]/route";

describe("/api/matches/[matchId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("GET は対局結果を返す", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    matchService.getMatch.mockResolvedValueOnce({
      id: "match-1",
      circleSessionId: "session-1",
      order: 1,
      player1Id: "user-1",
      player2Id: "user-2",
      outcome: "P1_WIN",
      deletedAt: null,
    });

    const response = await GET(new Request("http://localhost"), {
      params: { matchId: "match-1" },
    });

    expect(matchService.getMatch).toHaveBeenCalledWith(
      expect.objectContaining({ actorId: expect.anything() }),
    );
    expect(response.status).toBe(200);
  });

  test("GET は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await GET(new Request("http://localhost"), {
      params: { matchId: "match-1" },
    });

    expect(matchService.getMatch).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("GET は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    matchService.getMatch.mockRejectedValueOnce(new Error("Forbidden"));

    const response = await GET(new Request("http://localhost"), {
      params: { matchId: "match-1" },
    });

    expect(response.status).toBe(403);
  });

  test("PATCH は対局結果を更新する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    matchService.updateMatch.mockResolvedValueOnce({
      id: "match-1",
      circleSessionId: "session-1",
      order: 1,
      player1Id: "user-1",
      player2Id: "user-2",
      outcome: "P2_WIN",
      deletedAt: null,
    });

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcome: "P2_WIN",
        }),
      }),
      { params: { matchId: "match-1" } },
    );

    expect(matchService.updateMatch).toHaveBeenCalledWith(
      expect.objectContaining({ actorId: expect.anything() }),
    );
    expect(response.status).toBe(200);
  });

  test("PATCH は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcome: "P2_WIN",
        }),
      }),
      { params: { matchId: "match-1" } },
    );

    expect(matchService.updateMatch).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("PATCH は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    matchService.updateMatch.mockRejectedValueOnce(new Error("Forbidden"));

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outcome: "P2_WIN",
        }),
      }),
      { params: { matchId: "match-1" } },
    );

    expect(response.status).toBe(403);
  });

  test("DELETE は対局結果を削除する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    matchService.deleteMatch.mockResolvedValueOnce({
      id: "match-1",
      circleSessionId: "session-1",
      order: 1,
      player1Id: "user-1",
      player2Id: "user-2",
      outcome: "P1_WIN",
      deletedAt: new Date("2024-01-01T00:00:00Z"),
    });

    const response = await DELETE(new Request("http://localhost"), {
      params: { matchId: "match-1" },
    });

    expect(matchService.deleteMatch).toHaveBeenCalledWith(
      expect.objectContaining({ actorId: expect.anything() }),
    );
    expect(response.status).toBe(200);
  });

  test("DELETE は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await DELETE(new Request("http://localhost"), {
      params: { matchId: "match-1" },
    });

    expect(matchService.deleteMatch).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("DELETE は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    matchService.deleteMatch.mockRejectedValueOnce(new Error("Forbidden"));

    const response = await DELETE(new Request("http://localhost"), {
      params: { matchId: "match-1" },
    });

    expect(response.status).toBe(403);
  });
});
