import { describe, expect, test } from "vitest";
import {
  circleMembership,
  circleMembershipFromRole,
  circleSessionMembership,
  circleSessionMembershipFromRole,
  isCircleMember,
  isCircleSessionMember,
  noCircleMembership,
  noCircleSessionMembership,
} from "@/server/domain/services/authz/memberships";
import { CircleRole, CircleSessionRole } from "@/server/domain/services/authz/roles";

describe("メンバーシップ", () => {
  test("circleMembership は member を返す", () => {
    expect(circleMembership(CircleRole.CircleOwner)).toEqual({
      kind: "member",
      role: CircleRole.CircleOwner,
    });
  });

  test("noCircleMembership は none を返す", () => {
    expect(noCircleMembership()).toEqual({ kind: "none" });
  });

  test("circleMembershipFromRole は null で none を返す", () => {
    expect(circleMembershipFromRole(null)).toEqual({ kind: "none" });
  });

  test("circleMembershipFromRole は role で member を返す", () => {
    expect(circleMembershipFromRole(CircleRole.CircleMember)).toEqual({
      kind: "member",
      role: CircleRole.CircleMember,
    });
  });

  test("isCircleMember は member で true", () => {
    expect(isCircleMember(circleMembership(CircleRole.CircleManager))).toBe(true);
  });

  test("isCircleMember は none で false", () => {
    expect(isCircleMember(noCircleMembership())).toBe(false);
  });

  test("circleSessionMembership は member を返す", () => {
    expect(circleSessionMembership(CircleSessionRole.CircleSessionOwner)).toEqual({
      kind: "member",
      role: CircleSessionRole.CircleSessionOwner,
    });
  });

  test("noCircleSessionMembership は none を返す", () => {
    expect(noCircleSessionMembership()).toEqual({ kind: "none" });
  });

  test("circleSessionMembershipFromRole は null で none を返す", () => {
    expect(circleSessionMembershipFromRole(null)).toEqual({ kind: "none" });
  });

  test("circleSessionMembershipFromRole は role で member を返す", () => {
    expect(
      circleSessionMembershipFromRole(CircleSessionRole.CircleSessionMember),
    ).toEqual({
      kind: "member",
      role: CircleSessionRole.CircleSessionMember,
    });
  });

  test("isCircleSessionMember は member で true", () => {
    expect(
      isCircleSessionMember(
        circleSessionMembership(CircleSessionRole.CircleSessionManager),
      ),
    ).toBe(true);
  });

  test("isCircleSessionMember は none で false", () => {
    expect(isCircleSessionMember(noCircleSessionMembership())).toBe(false);
  });
});
