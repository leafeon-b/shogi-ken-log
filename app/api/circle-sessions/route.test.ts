import { beforeEach, describe, expect, test, vi } from "vitest";

const circleSessionService = {
  listByCircleId: vi.fn(),
  createCircleSession: vi.fn(),
};
const getSessionUserId = vi.fn();

vi.mock("@/server/application/service-container", () => ({
  getServiceContainer: () => ({ circleSessionService }),
}));
vi.mock("@/server/application/auth/session", () => ({
  getSessionUserId: () => getSessionUserId(),
}));

import { GET, POST } from "@/app/api/circle-sessions/route";

describe("/api/circle-sessions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("GET は開催回一覧を返す", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionService.listByCircleId.mockResolvedValueOnce([]);

    const response = await GET(
      new Request("http://localhost/api/circle-sessions?circleId=circle-1"),
    );

    expect(circleSessionService.listByCircleId).toHaveBeenCalledWith(
      "user-1",
      expect.anything(),
    );
    expect(response.status).toBe(200);
  });

  test("GET は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await GET(
      new Request("http://localhost/api/circle-sessions?circleId=circle-1"),
    );

    expect(circleSessionService.listByCircleId).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("GET は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionService.listByCircleId.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await GET(
      new Request("http://localhost/api/circle-sessions?circleId=circle-1"),
    );

    expect(response.status).toBe(403);
  });

  test("POST は開催回を作成する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionService.createCircleSession.mockResolvedValueOnce({
      id: "session-1",
      circleId: "circle-1",
      sequence: 1,
      startsAt: new Date("2024-01-01T10:00:00Z"),
      endsAt: new Date("2024-01-01T12:00:00Z"),
      location: "A",
      createdAt: new Date("2024-01-01T00:00:00Z"),
    });

    const response = await POST(
      new Request("http://localhost/api/circle-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circleId: "circle-1",
          sequence: 1,
          startsAt: "2024-01-01T10:00:00Z",
          endsAt: "2024-01-01T12:00:00Z",
          location: "A",
        }),
      }),
    );

    const args = circleSessionService.createCircleSession.mock.calls[0][0];
    expect(args.actorId).toBe("user-1");
    expect(args.sequence).toBe(1);
    expect(args.startsAt).toBeInstanceOf(Date);
    expect(response.status).toBe(201);
  });

  test("POST は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await POST(
      new Request("http://localhost/api/circle-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circleId: "circle-1",
          sequence: 1,
          startsAt: "2024-01-01T10:00:00Z",
          endsAt: "2024-01-01T12:00:00Z",
          location: "A",
        }),
      }),
    );

    expect(circleSessionService.createCircleSession).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("POST は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionService.createCircleSession.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await POST(
      new Request("http://localhost/api/circle-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          circleId: "circle-1",
          sequence: 1,
          startsAt: "2024-01-01T10:00:00Z",
          endsAt: "2024-01-01T12:00:00Z",
          location: "A",
        }),
      }),
    );

    expect(response.status).toBe(403);
  });
});
