import { describe, expect, test } from "vitest";

import {
  handleError,
  json,
  optionalDate,
  optionalNumber,
  optionalString,
  parseJson,
  requireDate,
  requireNumber,
  requireString,
} from "@/app/api/_helpers";

describe("app/api/_helpers", () => {
  test("jsonはレスポンスを生成できる", async () => {
    const response = json({ ok: true }, 201);

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  test("parseJsonはJSONを読み取れる", async () => {
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Circle" }),
    });

    await expect(parseJson<{ name: string }>(request)).resolves.toEqual({
      name: "Circle",
    });
  });

  test("parseJsonは無効なJSONでエラーになる", async () => {
    const request = new Request("http://localhost/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });

    await expect(parseJson(request)).rejects.toThrow("Invalid JSON");
  });

  test("requireStringはトリム済み文字列を返す", () => {
    expect(requireString("  value  ", "name")).toBe("value");
  });

  test("requireStringは空文字や非文字列を拒否する", () => {
    expect(() => requireString("   ", "name")).toThrow("name is required");
    expect(() => requireString(123, "name")).toThrow("name is required");
  });

  test("requireNumberは数値を返す", () => {
    expect(requireNumber(42, "order")).toBe(42);
  });

  test("requireNumberは数値でない場合に失敗する", () => {
    expect(() => requireNumber(Number.NaN, "order")).toThrow(
      "order is required",
    );
    expect(() => requireNumber("1", "order")).toThrow("order is required");
  });

  test("optionalNumberは未指定を許容する", () => {
    expect(optionalNumber(undefined)).toBeUndefined();
    expect(optionalNumber(7)).toBe(7);
  });

  test("optionalNumberは数値でない場合に失敗する", () => {
    expect(() => optionalNumber("7")).toThrow(
      "number must be provided as a number",
    );
  });

  test("requireDateはISO文字列をDateに変換する", () => {
    const result = requireDate("2024-01-01T00:00:00Z", "startsAt");
    expect(result.toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  test("requireDateは無効な値を拒否する", () => {
    expect(() => requireDate(123, "startsAt")).toThrow(
      "startsAt must be an ISO string",
    );
    expect(() => requireDate("invalid", "startsAt")).toThrow(
      "startsAt must be a valid date",
    );
  });

  test("optionalDateは未指定を許容する", () => {
    expect(optionalDate(undefined)).toBeUndefined();
  });

  test("optionalDateは無効な値を拒否する", () => {
    expect(() => optionalDate(123)).toThrow("date must be an ISO string");
    expect(() => optionalDate("invalid")).toThrow("date must be a valid date");
  });

  test("optionalStringは未指定を許容する", () => {
    expect(optionalString(undefined)).toBeUndefined();
    expect(optionalString("value")).toBe("value");
  });

  test("optionalStringは非文字列を拒否する", () => {
    expect(() => optionalString(123)).toThrow(
      "string must be provided as a string",
    );
  });

  test("handleErrorはnot foundを404にする", async () => {
    const response = handleError(new Error("Circle not found"));
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Circle not found",
    });
  });

  test("handleErrorはUnauthorizedを401にする", async () => {
    const response = handleError(new Error("Unauthorized"));
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Unauthorized",
    });
  });

  test("handleErrorはForbiddenを403にする", async () => {
    const response = handleError(new Error("Forbidden"));
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Forbidden",
    });
  });

  test("handleErrorはその他のエラーを400にする", async () => {
    const response = handleError(new Error("Invalid request"));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid request",
    });
  });

});
