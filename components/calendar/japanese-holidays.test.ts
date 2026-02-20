import { describe, expect, it } from "vitest";
import { isJapaneseHoliday } from "./japanese-holidays";

describe("isJapaneseHoliday", () => {
  it("元日（1月1日）は祝日", () => {
    expect(isJapaneseHoliday(new Date(2026, 0, 1))).toBe(true);
  });

  it("建国記念の日（2月11日）は祝日", () => {
    expect(isJapaneseHoliday(new Date(2026, 1, 11))).toBe(true);
  });

  it("平日は祝日ではない", () => {
    expect(isJapaneseHoliday(new Date(2026, 1, 20))).toBe(false);
  });

  it("土曜日でも祝日でなければ false", () => {
    // 2026-02-14 は土曜日
    expect(isJapaneseHoliday(new Date(2026, 1, 14))).toBe(false);
  });

  it("振替休日は祝日として扱われる", () => {
    // 2026-09-22 は秋分の日(9/22 火曜)ではなく…
    // 2025-02-24 は天皇誕生日(2/23 日曜)の振替休日
    expect(isJapaneseHoliday(new Date(2025, 1, 24))).toBe(true);
  });
});
