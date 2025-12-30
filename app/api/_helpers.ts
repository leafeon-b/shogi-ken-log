import { NextResponse } from "next/server";

export const json = <T>(data: T, status = 200) =>
  NextResponse.json(data, { status });

export const errorJson = (status: number, message: string) =>
  NextResponse.json({ error: message }, { status });

export const parseJson = async <T>(request: Request): Promise<T> => {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("Invalid JSON");
  }
};

export const requireString = (value: unknown, field: string): string => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required`);
  }
  return value.trim();
};

export const requireNumber = (value: unknown, field: string): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${field} is required`);
  }
  return value;
};

export const optionalNumber = (value: unknown): number | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error("number must be provided as a number");
  }
  return value;
};

export const requireDate = (value: unknown, field: string): Date => {
  if (typeof value !== "string") {
    throw new Error(`${field} must be an ISO string`);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${field} must be a valid date`);
  }
  return date;
};

export const optionalDate = (value: unknown): Date | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new Error("date must be an ISO string");
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("date must be a valid date");
  }
  return date;
};

export const optionalString = (value: unknown): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new Error("string must be provided as a string");
  }
  return value;
};

export const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  const status =
    message === "Unauthorized"
      ? 401
      : message === "Forbidden"
        ? 403
        : message.endsWith("not found")
          ? 404
          : 400;
  return errorJson(status, message);
};
