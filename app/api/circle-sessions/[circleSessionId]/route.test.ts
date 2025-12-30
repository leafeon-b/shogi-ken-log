import { beforeEach, describe, expect, test, vi } from "vitest";

const circleSessionService = {
  getCircleSession: vi.fn(),
  updateCircleSessionDetails: vi.fn(),
  deleteCircleSession: vi.fn(),
};
const getSessionUserId = vi.fn();

vi.mock("@/server/application/service-container", () => ({
  getServiceContainer: () => ({ circleSessionService }),
}));
vi.mock("@/server/application/auth/session", () => ({
  getSessionUserId: () => getSessionUserId(),
}));

import { DELETE, GET, PATCH } from "@/app/api/circle-sessions/[circleSessionId]/route";

describe("/api/circle-sessions/[circleSessionId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("GET は開催回を返す", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionService.getCircleSession.mockResolvedValueOnce({
      id: "session-1",
      circleId: "circle-1",
      sequence: 1,
      startsAt: new Date("2024-01-01T10:00:00Z"),
      endsAt: new Date("2024-01-01T12:00:00Z"),
      location: null,
      createdAt: new Date("2024-01-01T00:00:00Z"),
    });

    const response = await GET(new Request("http://localhost"), {
      params: { circleSessionId: "session-1" },
    });

    expect(circleSessionService.getCircleSession).toHaveBeenCalledWith(
      "user-1",
      expect.anything(),
    );
    expect(response.status).toBe(200);
  });

  test("GET は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await GET(new Request("http://localhost"), {
      params: { circleSessionId: "session-1" },
    });

    expect(circleSessionService.getCircleSession).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("GET は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionService.getCircleSession.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await GET(new Request("http://localhost"), {
      params: { circleSessionId: "session-1" },
    });

    expect(response.status).toBe(403);
  });

  test("PATCH は開催回を更新する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionService.updateCircleSessionDetails.mockResolvedValueOnce({
      id: "session-1",
      circleId: "circle-1",
      sequence: 2,
      startsAt: new Date("2024-01-02T10:00:00Z"),
      endsAt: new Date("2024-01-02T12:00:00Z"),
      location: "B",
      createdAt: new Date("2024-01-01T00:00:00Z"),
    });

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequence: 2,
          startsAt: "2024-01-02T10:00:00Z",
          endsAt: "2024-01-02T12:00:00Z",
          location: "B",
        }),
      }),
      { params: { circleSessionId: "session-1" } },
    );

    expect(circleSessionService.updateCircleSessionDetails).toHaveBeenCalledWith(
      "user-1",
      expect.anything(),
      expect.anything(),
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
          sequence: 2,
          startsAt: "2024-01-02T10:00:00Z",
          endsAt: "2024-01-02T12:00:00Z",
          location: "B",
        }),
      }),
      { params: { circleSessionId: "session-1" } },
    );

    expect(circleSessionService.updateCircleSessionDetails).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("PATCH は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionService.updateCircleSessionDetails.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequence: 2,
          startsAt: "2024-01-02T10:00:00Z",
          endsAt: "2024-01-02T12:00:00Z",
          location: "B",
        }),
      }),
      { params: { circleSessionId: "session-1" } },
    );

    expect(response.status).toBe(403);
  });

  test("DELETE は開催回を削除する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionService.deleteCircleSession.mockResolvedValueOnce(undefined);

    const response = await DELETE(new Request("http://localhost"), {
      params: { circleSessionId: "session-1" },
    });

    expect(circleSessionService.deleteCircleSession).toHaveBeenCalledWith(
      "user-1",
      expect.anything(),
    );
    expect(response.status).toBe(200);
  });

  test("DELETE は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await DELETE(new Request("http://localhost"), {
      params: { circleSessionId: "session-1" },
    });

    expect(circleSessionService.deleteCircleSession).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("DELETE は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionService.deleteCircleSession.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await DELETE(new Request("http://localhost"), {
      params: { circleSessionId: "session-1" },
    });

    expect(response.status).toBe(403);
  });
});
