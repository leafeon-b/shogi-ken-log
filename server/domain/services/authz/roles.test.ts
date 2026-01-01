import {
  CircleRole,
  CircleSessionRole,
} from "@/server/domain/services/authz/roles";
import { describe, expect, test } from "vitest";
import {
  isSameOrHigherCircleRole,
  isSameOrHigherCircleSessionRole,
} from "@/server/domain/services/authz/roles";

const { CircleOwner, CircleManager, CircleMember } = CircleRole;
const { CircleSessionOwner, CircleSessionManager, CircleSessionMember } =
  CircleSessionRole;

describe("ロール", () => {
  describe("研究会ロール", () => {
    test.each([
      // TODO: actor, targetのパターンを3*3の組み合わせ全て検証する
      [CircleManager, CircleOwner, false],
      [CircleMember, CircleManager, false],
      [CircleOwner, CircleManager, true],
      [CircleMember, CircleMember, true],
      [CircleOwner, CircleOwner, true],
    ])(
      "isSameOrHigherCircleRole（%s と %s）",
      (actorRole, targetRole, expected) => {
        expect(isSameOrHigherCircleRole(actorRole, targetRole)).toBe(expected);
      },
    );
  });

  describe("開催回ロール", () => {
    test.each([
      // TODO: actor, targetのパターンを3*3の組み合わせ全て検証する
      [CircleSessionManager, CircleSessionOwner, false],
      [CircleSessionMember, CircleSessionManager, false],
      [CircleSessionOwner, CircleSessionManager, true],
      [CircleSessionManager, CircleSessionMember, true],
      [CircleSessionOwner, CircleSessionOwner, true],
    ])(
      "isSameOrHigherCircleSessionRole（%s と %s）",
      (actorRole, targetRole, expected) => {
        expect(isSameOrHigherCircleSessionRole(actorRole, targetRole)).toBe(
          expected,
        );
      },
    );
  });
});
