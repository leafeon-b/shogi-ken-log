import { describe, expect, test } from "vitest";
import { matchHistoryId, matchId, userId } from "@/server/domain/common/ids";
import { createMatchHistory } from "@/server/domain/models/match-history/match-history";

describe("MatchHistory ドメイン", () => {
  test("createMatchHistory は対局者の違いと順序を検証する", () => {
    const history = createMatchHistory({
      id: matchHistoryId("history-1"),
      matchId: matchId("match-1"),
      editorId: userId("user-3"),
      action: "CREATE",
      order: 1,
      player1Id: userId("user-1"),
      player2Id: userId("user-2"),
      outcome: "UNKNOWN",
    });

    expect(history.action).toBe("CREATE");
    expect(history.createdAt).toBeInstanceOf(Date);
  });

  test("createMatchHistory は同一対局者を拒否する", () => {
    expect(() =>
      createMatchHistory({
        id: matchHistoryId("history-1"),
        matchId: matchId("match-1"),
        editorId: userId("user-3"),
        action: "CREATE",
        order: 1,
        player1Id: userId("user-1"),
        player2Id: userId("user-1"),
        outcome: "UNKNOWN",
      }),
    ).toThrow("players must be different");
  });

  test("createMatchHistory は順序が正の整数でない場合に拒否する", () => {
    expect(() =>
      createMatchHistory({
        id: matchHistoryId("history-1"),
        matchId: matchId("match-1"),
        editorId: userId("user-3"),
        action: "CREATE",
        order: 0,
        player1Id: userId("user-1"),
        player2Id: userId("user-2"),
        outcome: "UNKNOWN",
      }),
    ).toThrow("order must be a positive integer");
  });

  test("createMatchHistory は不正な createdAt を拒否する", () => {
    expect(() =>
      createMatchHistory({
        id: matchHistoryId("history-1"),
        matchId: matchId("match-1"),
        editorId: userId("user-3"),
        action: "CREATE",
        createdAt: new Date("invalid"),
        order: 1,
        player1Id: userId("user-1"),
        player2Id: userId("user-2"),
        outcome: "UNKNOWN",
      }),
    ).toThrow("createdAt must be a valid date");
  });
});
