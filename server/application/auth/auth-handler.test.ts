import { describe, expect, test, vi } from "vitest";

vi.mock("@/server/infrastructure/auth/nextauth-handler", () => ({
  createNextAuthHandler: vi.fn(),
}));

import { createNextAuthHandler } from "@/server/infrastructure/auth/nextauth-handler";
import { createAuthHandler } from "@/server/application/auth/auth-handler";

describe("Auth ハンドラ", () => {
  test("インフラの NextAuth ハンドラを委譲する", () => {
    vi.mocked(createNextAuthHandler).mockReturnValue("handler");

    const handler = createAuthHandler();

    expect(handler).toBe("handler");
    expect(createNextAuthHandler).toHaveBeenCalledTimes(1);
  });
});
