import { beforeEach, describe, expect, test, vi } from "vitest";
import { circleId, userId } from "@/server/domain/common/ids";

const circleParticipationService = {
  transferOwnership: vi.fn(),
};
const getSessionUserId = vi.fn();

vi.mock("@/server/application/service-container", () => ({
  getServiceContainer: () => ({
    circleParticipationService,
  }),
}));
vi.mock("@/server/application/auth/session", () => ({
  getSessionUserId: () => getSessionUserId(),
}));

import { POST } from "@/app/api/circles/[circleId]/participants/transfer-ownership/route";

describe("/api/circles/[circleId]/participants/transfer-ownership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("POST はオーナー移譲を実行する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleParticipationService.transferOwnership.mockResolvedValueOnce(
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
      { params: { circleId: "circle-1" } },
    );

    expect(circleParticipationService.transferOwnership).toHaveBeenCalledWith({
      actorId: "user-1",
      circleId: circleId("circle-1"),
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
      { params: { circleId: "circle-1" } },
    );

    expect(circleParticipationService.transferOwnership).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("POST は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleParticipationService.transferOwnership.mockRejectedValueOnce(
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
      { params: { circleId: "circle-1" } },
    );

    expect(response.status).toBe(403);
  });
});
