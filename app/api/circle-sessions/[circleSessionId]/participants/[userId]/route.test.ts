import { beforeEach, describe, expect, test, vi } from "vitest";

const circleSessionParticipationService = {
  changeParticipantRole: vi.fn(),
  removeParticipant: vi.fn(),
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

import {
  DELETE,
  PATCH,
} from "@/app/api/circle-sessions/[circleSessionId]/participants/[userId]/route";
import { circleSessionId, userId } from "@/server/domain/common/ids";

describe("/api/circle-sessions/[circleSessionId]/participants/[userId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("PATCH は参加者のロールを更新する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionParticipationService.changeParticipantRole.mockResolvedValueOnce(
      undefined,
    );

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "CircleSessionManager",
        }),
      }),
      { params: Promise.resolve({ circleSessionId: "session-1", userId: "user-1" }) },
    );

    expect(
      circleSessionParticipationService.changeParticipantRole,
    ).toHaveBeenCalledWith({
      actorId: "user-1",
      circleSessionId: circleSessionId("session-1"),
      userId: userId("user-1"),
      role: "CircleSessionManager",
    });
    expect(response.status).toBe(200);
  });

  test("PATCH は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "CircleSessionManager",
        }),
      }),
      { params: Promise.resolve({ circleSessionId: "session-1", userId: "user-1" }) },
    );

    expect(
      circleSessionParticipationService.changeParticipantRole,
    ).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("PATCH は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionParticipationService.changeParticipantRole.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "CircleSessionManager",
        }),
      }),
      { params: Promise.resolve({ circleSessionId: "session-1", userId: "user-1" }) },
    );

    expect(response.status).toBe(403);
  });

  test("DELETE は参加者を削除する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionParticipationService.removeParticipant.mockResolvedValueOnce(
      undefined,
    );

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ circleSessionId: "session-1", userId: "user-1" }),
    });

    expect(
      circleSessionParticipationService.removeParticipant,
    ).toHaveBeenCalledWith({
      actorId: "user-1",
      circleSessionId: circleSessionId("session-1"),
      userId: userId("user-1"),
    });
    expect(response.status).toBe(200);
  });

  test("DELETE は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ circleSessionId: "session-1", userId: "user-1" }),
    });

    expect(
      circleSessionParticipationService.removeParticipant,
    ).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("DELETE は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionParticipationService.removeParticipant.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({ circleSessionId: "session-1", userId: "user-1" }),
    });

    expect(response.status).toBe(403);
  });
});
