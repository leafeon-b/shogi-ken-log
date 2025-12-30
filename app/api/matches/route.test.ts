import { beforeEach, describe, expect, test, vi } from "vitest";

const matchService = {
  listByCircleSessionId: vi.fn(),
  recordMatch: vi.fn(),
};
const getSessionUserId = vi.fn();

vi.mock("@/server/application/service-container", () => ({
  getServiceContainer: () => ({ matchService }),
}));
vi.mock("@/server/application/auth/session", () => ({
  getSessionUserId: () => getSessionUserId(),
}));

import { GET, POST } from "@/app/api/matches/route";

describe("/api/matches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("GET は対局結果一覧を返す", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    matchService.listByCircleSessionId.mockResolvedValueOnce([]);

    const response = await GET(
      new Request("http://localhost/api/matches?circleSessionId=session-1"),
    );

    expect(matchService.listByCircleSessionId).toHaveBeenCalledWith(
      expect.objectContaining({ actorId: expect.anything() }),
    );
    expect(response.status).toBe(200);
  });

  test("GET は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await GET(
      new Request("http://localhost/api/matches?circleSessionId=session-1"),
    );

    expect(matchService.listByCircleSessionId).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("GET は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    matchService.listByCircleSessionId.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await GET(
      new Request("http://localhost/api/matches?circleSessionId=session-1"),
    );

    expect(response.status).toBe(403);
  });

  test("POST は対局結果を記録する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    matchService.recordMatch.mockResolvedValueOnce({
      id: "match-1",
      circleSessionId: "session-1",
      order: 1,
      player1Id: "user-1",
      player2Id: "user-2",
      outcome: "P1_WIN",
      deletedAt: null,
    });

    const response = await POST(
      new Request("http://localhost/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circleSessionId: "session-1",
          order: 1,
          player1Id: "user-1",
          player2Id: "user-2",
          outcome: "P1_WIN",
        }),
      }),
    );

    expect(matchService.recordMatch).toHaveBeenCalledWith(
      expect.objectContaining({ actorId: expect.anything() }),
    );
    expect(response.status).toBe(201);
  });

  test("POST は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await POST(
      new Request("http://localhost/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circleSessionId: "session-1",
          order: 1,
          player1Id: "user-1",
          player2Id: "user-2",
          outcome: "P1_WIN",
        }),
      }),
    );

    expect(matchService.recordMatch).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("POST は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    matchService.recordMatch.mockRejectedValueOnce(new Error("Forbidden"));

    const response = await POST(
      new Request("http://localhost/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circleSessionId: "session-1",
          order: 1,
          player1Id: "user-1",
          player2Id: "user-2",
          outcome: "P1_WIN",
        }),
      }),
    );

    expect(response.status).toBe(403);
  });
});
