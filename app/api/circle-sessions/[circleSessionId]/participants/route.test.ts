import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  circleSessionId,
  userId,
} from "@/server/domain/common/ids";

const circleSessionParticipationService = {
  listParticipants: vi.fn(),
  addParticipant: vi.fn(),
};
const getSessionUserId = vi.fn();

vi.mock("@/server/application/service-container", () => ({
  getServiceContainer: () => ({
    circleSessionParticipationService,
  }),
}));
vi.mock("@/server/application/auth/session", () => ({
  getSessionUserId: () => getSessionUserId(),
}));

import { GET, POST } from "@/app/api/circle-sessions/[circleSessionId]/participants/route";

describe("/api/circle-sessions/[circleSessionId]/participants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("GET は参加者一覧を返す", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionParticipationService.listParticipants.mockResolvedValueOnce([
      { userId: userId("user-1"), role: "CircleSessionOwner" },
    ]);

    const response = await GET(new Request("http://localhost"), {
      params: { circleSessionId: "session-1" },
    });

    expect(circleSessionParticipationService.listParticipants).toHaveBeenCalledWith(
      {
        actorId: "user-1",
        circleSessionId: circleSessionId("session-1"),
      },
    );
    expect(response.status).toBe(200);
  });

  test("GET は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await GET(new Request("http://localhost"), {
      params: { circleSessionId: "session-1" },
    });

    expect(
      circleSessionParticipationService.listParticipants,
    ).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("GET は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionParticipationService.listParticipants.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await GET(new Request("http://localhost"), {
      params: { circleSessionId: "session-1" },
    });

    expect(response.status).toBe(403);
  });

  test("POST は参加者を追加する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionParticipationService.addParticipant.mockResolvedValueOnce(
      undefined,
    );

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user-2",
          role: "CircleSessionMember",
        }),
      }),
      { params: { circleSessionId: "session-1" } },
    );

    expect(circleSessionParticipationService.addParticipant).toHaveBeenCalledWith(
      {
        actorId: "user-1",
        circleSessionId: circleSessionId("session-1"),
        userId: userId("user-2"),
        role: "CircleSessionMember",
      },
    );
    expect(response.status).toBe(201);
  });

  test("POST は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user-2",
          role: "CircleSessionMember",
        }),
      }),
      { params: { circleSessionId: "session-1" } },
    );

    expect(
      circleSessionParticipationService.addParticipant,
    ).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("POST は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionParticipationService.addParticipant.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user-2",
          role: "CircleSessionMember",
        }),
      }),
      { params: { circleSessionId: "session-1" } },
    );

    expect(response.status).toBe(403);
  });
});
