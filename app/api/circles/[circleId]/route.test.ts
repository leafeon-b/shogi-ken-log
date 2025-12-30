import { beforeEach, describe, expect, test, vi } from "vitest";

const circleService = {
  getCircle: vi.fn(),
  renameCircle: vi.fn(),
  deleteCircle: vi.fn(),
};
const getSessionUserId = vi.fn();

vi.mock("@/server/application/service-container", () => ({
  getServiceContainer: () => ({ circleService }),
}));
vi.mock("@/server/application/auth/session", () => ({
  getSessionUserId: () => getSessionUserId(),
}));

import { DELETE, GET, PATCH } from "@/app/api/circles/[circleId]/route";

describe("/api/circles/[circleId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("GET は Circle を返す", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleService.getCircle.mockResolvedValueOnce({
      id: "circle-1",
      name: "Home",
      createdAt: new Date("2024-01-01T00:00:00Z"),
    });

    const response = await GET(new Request("http://localhost"), {
      params: { circleId: "circle-1" },
    });

    expect(circleService.getCircle).toHaveBeenCalledWith(
      "user-1",
      expect.anything(),
    );
    expect(response.status).toBe(200);
  });

  test("GET は未取得時に 404", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleService.getCircle.mockResolvedValueOnce(null);

    const response = await GET(new Request("http://localhost"), {
      params: { circleId: "circle-1" },
    });

    expect(response.status).toBe(404);
  });

  test("GET は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleService.getCircle.mockRejectedValueOnce(new Error("Forbidden"));

    const response = await GET(new Request("http://localhost"), {
      params: { circleId: "circle-1" },
    });

    expect(response.status).toBe(403);
  });

  test("PATCH は名前を更新する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleService.renameCircle.mockResolvedValueOnce({
      id: "circle-1",
      name: "Next",
      createdAt: new Date("2024-01-01T00:00:00Z"),
    });

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Next" }),
      }),
      { params: { circleId: "circle-1" } },
    );

    expect(circleService.renameCircle).toHaveBeenCalledWith(
      "user-1",
      expect.anything(),
      "Next",
    );
    expect(response.status).toBe(200);
  });

  test("PATCH は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Next" }),
      }),
      { params: { circleId: "circle-1" } },
    );

    expect(circleService.renameCircle).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("PATCH は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleService.renameCircle.mockRejectedValueOnce(new Error("Forbidden"));

    const response = await PATCH(
      new Request("http://localhost", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Next" }),
      }),
      { params: { circleId: "circle-1" } },
    );

    expect(response.status).toBe(403);
  });

  test("DELETE は削除する", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleService.deleteCircle.mockResolvedValueOnce(undefined);

    const response = await DELETE(new Request("http://localhost"), {
      params: { circleId: "circle-1" },
    });

    expect(circleService.deleteCircle).toHaveBeenCalledWith(
      "user-1",
      expect.anything(),
    );
    expect(response.status).toBe(200);
  });

  test("DELETE は未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await DELETE(new Request("http://localhost"), {
      params: { circleId: "circle-1" },
    });

    expect(circleService.deleteCircle).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("DELETE は権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleService.deleteCircle.mockRejectedValueOnce(new Error("Forbidden"));

    const response = await DELETE(new Request("http://localhost"), {
      params: { circleId: "circle-1" },
    });

    expect(response.status).toBe(403);
  });
});
