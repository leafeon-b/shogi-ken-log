import type { UserId } from "@/server/domain/common/ids";
import type { Match } from "@/server/domain/models/match/match";

export const hasMatchParticipation = (
  matches: readonly Match[],
  participantId: UserId,
): boolean =>
  matches.some(
    (match) =>
      match.player1Id === participantId || match.player2Id === participantId,
  );

export const assertCanRemoveCircleSessionParticipant = (
  matches: readonly Match[],
  participantId: UserId,
): void => {
  if (hasMatchParticipation(matches, participantId)) {
    throw new Error("Participant cannot be removed because matches exist");
  }
};
