import { describe, expect, test } from "vitest";
import { trimWithFullwidth } from "@/lib/string";

describe("trimWithFullwidth", () => {
  test("trims standard whitespace", () => {
    expect(trimWithFullwidth("  hello  ")).toBe("hello");
  });

  test("trims fullwidth spaces (U+3000)", () => {
    expect(trimWithFullwidth("\u3000hello\u3000")).toBe("hello");
  });

  test("trims mixed whitespace and fullwidth spaces", () => {
    expect(trimWithFullwidth(" \u3000 hello \u3000 ")).toBe("hello");
  });

  test("returns empty string when input is only whitespace", () => {
    expect(trimWithFullwidth("  \u3000  ")).toBe("");
  });

  test("preserves interior fullwidth spaces", () => {
    expect(trimWithFullwidth("hello\u3000world")).toBe("hello\u3000world");
  });

  test("returns empty string for empty input", () => {
    expect(trimWithFullwidth("")).toBe("");
  });
});
