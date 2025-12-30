import { beforeEach, describe, expect, test, vi } from "vitest";
import { circleId, userId } from "@/server/domain/common/ids";

const circleParticipationService = {
  changeParticipantRole: vi.fn(),
  removeParticipant: vi.fn(),
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

import {
  DELETE,
  PATCH,
} from "@/app/api/circles/[circleId]/participants/[userId]/route";

describe("/api/circles/[circleId]/participants/[userId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("PATCH は参加者のロールを更新する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleParticipationService.changeParticipantRole.mockResolvedValueOnce(
      undefined,
    );

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "CircleManager",
        }),
      }),
      { params: { circleId: "circle-1", userId: "user-1" } },
    );

    expect(circleParticipationService.changeParticipantRole).toHaveBeenCalledWith(
      {
        actorId: "user-1",
        circleId: circleId("circle-1"),
        userId: userId("user-1"),
        role: "CircleManager",
      },
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
          role: "CircleManager",
        }),
      }),
      { params: { circleId: "circle-1", userId: "user-1" } },
    );

    expect(circleParticipationService.changeParticipantRole).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("PATCH は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleParticipationService.changeParticipantRole.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "CircleManager",
        }),
      }),
      { params: { circleId: "circle-1", userId: "user-1" } },
    );

    expect(response.status).toBe(403);
  });

  test("DELETE は参加者を削除する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleParticipationService.removeParticipant.mockResolvedValueOnce(
      undefined,
    );

    const response = await DELETE(new Request("http://localhost"), {
      params: { circleId: "circle-1", userId: "user-1" },
    });

    expect(circleParticipationService.removeParticipant).toHaveBeenCalledWith({
      actorId: "user-1",
      circleId: circleId("circle-1"),
      userId: userId("user-1"),
    });
    expect(response.status).toBe(200);
  });

  test("DELETE は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await DELETE(new Request("http://localhost"), {
      params: { circleId: "circle-1", userId: "user-1" },
    });

    expect(circleParticipationService.removeParticipant).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("DELETE は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleParticipationService.removeParticipant.mockRejectedValueOnce(
      new Error("Forbidden"),
    );

    const response = await DELETE(new Request("http://localhost"), {
      params: { circleId: "circle-1", userId: "user-1" },
    });

    expect(response.status).toBe(403);
  });
});
