import { describe, expect, test } from "vitest";
import {
  CircleRole as PrismaCircleRole,
  CircleSessionRole as PrismaCircleSessionRole,
} from "@/generated/prisma/enums";
import {
  mapCircleMembershipFromPersistence,
  mapCircleSessionMembershipFromPersistence,
} from "@/server/infrastructure/mappers/authz-mapper";

describe("Authz マッパー", () => {
  test("Prisma CircleRole を CircleMembership に変換できる", () => {
    const membership = mapCircleMembershipFromPersistence(
      PrismaCircleRole.CircleOwner,
    );

    expect(membership).toEqual({ kind: "member", role: "CircleOwner" });
  });

  test("CircleRole が null のとき CircleMembership は none", () => {
    const membership = mapCircleMembershipFromPersistence(null);

    expect(membership).toEqual({ kind: "none" });
  });

  test("Prisma CircleSessionRole を CircleSessionMembership に変換できる", () => {
    const membership = mapCircleSessionMembershipFromPersistence(
      PrismaCircleSessionRole.CircleSessionManager,
    );

    expect(membership).toEqual({
      kind: "member",
      role: "CircleSessionManager",
    });
  });

  test("CircleSessionRole が null のとき CircleSessionMembership は none", () => {
    const membership = mapCircleSessionMembershipFromPersistence(null);

    expect(membership).toEqual({ kind: "none" });
  });
});
