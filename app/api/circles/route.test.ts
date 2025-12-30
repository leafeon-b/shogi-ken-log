import { beforeEach, describe, expect, test, vi } from "vitest";

const circleService = {
  createCircle: vi.fn(),
};
const getSessionUserId = vi.fn();

vi.mock("@/server/application/service-container", () => ({
  getServiceContainer: () => ({ circleService }),
}));
vi.mock("@/server/application/auth/session", () => ({
  getSessionUserId: () => getSessionUserId(),
}));

import { POST } from "@/app/api/circles/route";

describe("POST /api/circles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Circle を作成できる", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleService.createCircle.mockResolvedValueOnce({
      id: "circle-1",
      name: "Home",
      createdAt: new Date("2024-01-01T00:00:00Z"),
    });

    const response = await POST(
      new Request("http://localhost/api/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Home" }),
      }),
    );

    expect(circleService.createCircle).toHaveBeenCalledWith(
      expect.objectContaining({ actorId: "user-1", name: "Home" }),
    );
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.name).toBe("Home");
  });

  test("未認証なら 401", async () => {
    getSessionUserId.mockRejectedValueOnce(new Error("Unauthorized"));

    const response = await POST(
      new Request("http://localhost/api/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Home" }),
      }),
    );

    expect(circleService.createCircle).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  test("権限がないと 403", async () => {
    getSessionUserId.mockResolvedValueOnce("user-1");
    circleService.createCircle.mockRejectedValueOnce(new Error("Forbidden"));

    const response = await POST(
      new Request("http://localhost/api/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Home" }),
      }),
    );

    expect(response.status).toBe(403);
  });
});
