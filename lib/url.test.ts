import { describe, expect, it } from "vitest";
import { sanitizeCallbackUrl } from "./url";

describe("sanitizeCallbackUrl", () => {
  it("returns /home for undefined", () => {
    expect(sanitizeCallbackUrl(undefined)).toBe("/home");
  });

  it("returns /home for empty string", () => {
    expect(sanitizeCallbackUrl("")).toBe("/home");
  });

  it("allows a simple relative path", () => {
    expect(sanitizeCallbackUrl("/home")).toBe("/home");
  });

  it("allows a nested relative path", () => {
    expect(sanitizeCallbackUrl("/invite/abc123")).toBe("/invite/abc123");
  });

  it("allows a relative path with query parameters", () => {
    expect(sanitizeCallbackUrl("/invite/abc?foo=bar")).toBe(
      "/invite/abc?foo=bar",
    );
  });

  it("rejects an absolute URL", () => {
    expect(sanitizeCallbackUrl("https://evil.com")).toBe("/home");
  });

  it("rejects a protocol-relative URL", () => {
    expect(sanitizeCallbackUrl("//evil.com")).toBe("/home");
  });

  it("rejects a URL without protocol but with domain", () => {
    expect(sanitizeCallbackUrl("evil.com/path")).toBe("/home");
  });

  it("rejects javascript: protocol", () => {
    expect(sanitizeCallbackUrl("javascript:alert(1)")).toBe("/home");
  });

  it("rejects data: URI", () => {
    expect(sanitizeCallbackUrl("data:text/html,<h1>hi</h1>")).toBe("/home");
  });

  it("rejects control character bypass: tab between slashes", () => {
    expect(sanitizeCallbackUrl("/\t/evil.com")).toBe("/home");
  });

  it("rejects control character bypass: newline between slashes", () => {
    expect(sanitizeCallbackUrl("/\n/evil.com")).toBe("/home");
  });

  it("rejects control character bypass: carriage return between slashes", () => {
    expect(sanitizeCallbackUrl("/\r/evil.com")).toBe("/home");
  });
});
