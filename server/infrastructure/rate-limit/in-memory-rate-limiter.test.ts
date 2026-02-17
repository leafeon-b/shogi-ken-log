import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createInMemoryRateLimiter } from "./in-memory-rate-limiter";
import { TooManyRequestsError } from "@/server/domain/common/errors";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("InMemoryRateLimiter", () => {
  const config = { maxAttempts: 3, windowMs: 60_000 };

  test("制限内ならcheckはスローしない", () => {
    const limiter = createInMemoryRateLimiter(config);
    limiter.recordFailure("key");
    limiter.recordFailure("key");
    expect(() => limiter.check("key")).not.toThrow();
  });

  test("maxAttempts到達でTooManyRequestsErrorをスロー", () => {
    const limiter = createInMemoryRateLimiter(config);
    limiter.recordFailure("key");
    limiter.recordFailure("key");
    limiter.recordFailure("key");
    expect(() => limiter.check("key")).toThrow(TooManyRequestsError);
  });

  test("ウィンドウ経過後にカウンターがリセットされる", () => {
    const limiter = createInMemoryRateLimiter(config);
    limiter.recordFailure("key");
    limiter.recordFailure("key");
    limiter.recordFailure("key");

    vi.advanceTimersByTime(60_000);

    expect(() => limiter.check("key")).not.toThrow();
  });

  test("resetでカウンターがクリアされる", () => {
    const limiter = createInMemoryRateLimiter(config);
    limiter.recordFailure("key");
    limiter.recordFailure("key");
    limiter.recordFailure("key");

    limiter.reset("key");

    expect(() => limiter.check("key")).not.toThrow();
  });

  test("キーごとに独立してカウントする", () => {
    const limiter = createInMemoryRateLimiter(config);
    limiter.recordFailure("key-a");
    limiter.recordFailure("key-a");
    limiter.recordFailure("key-a");

    expect(() => limiter.check("key-a")).toThrow(TooManyRequestsError);
    expect(() => limiter.check("key-b")).not.toThrow();
  });

  test("未記録のキーはcheckをパスする", () => {
    const limiter = createInMemoryRateLimiter(config);
    expect(() => limiter.check("unknown")).not.toThrow();
  });
});
