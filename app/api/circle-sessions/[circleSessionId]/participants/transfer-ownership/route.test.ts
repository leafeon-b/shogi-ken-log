import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  circleSessionId,
  userId,
} from "@/server/domain/common/ids";

const circleSessionParticipationService = {
  transferOwnership: vi.fn(),
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

import { POST } from "@/app/api/circle-sessions/[circleSessionId]/participants/transfer-ownership/route";

describe("/api/circle-sessions/[circleSessionId]/participants/transfer-ownership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("POST はオーナー移譲を実行する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionParticipationService.transferOwnership.mockResolvedValueOnce(
      undefined,
    );

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: "user-1",
          toUserId: "user-2",
        }),
      }),
      { params: { circleSessionId: "session-1" } },
    );

    expect(
      circleSessionParticipationService.transferOwnership,
    ).toHaveBeenCalledWith({
      actorId: "user-1",
      circleSessionId: circleSessionId("session-1"),
      fromUserId: userId("user-1"),
      toUserId: userId("user-2"),
    });
    expect(response.status).toBe(200);
  });

  test("POST は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: "user-1",
          toUserId: "user-2",
        }),
      }),
      { params: { circleSessionId: "session-1" } },
    );

    expect(
      circleSessionParticipationService.transferOwnership,
    ).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("POST は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleSessionParticipationService.transferOwnership.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: "user-1",
          toUserId: "user-2",
        }),
      }),
      { params: { circleSessionId: "session-1" } },
    );

    expect(response.status).toBe(403);
  });
});
