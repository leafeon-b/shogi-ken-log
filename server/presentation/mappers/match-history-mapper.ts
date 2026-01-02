import type { MatchHistory } from "@/server/domain/models/match-history/match-history";
import {
  matchHistoryDtoSchema,
  type MatchHistoryDto,
} from "@/server/presentation/dto/match-history";

export const toMatchHistoryDto = (history: MatchHistory): MatchHistoryDto =>
  matchHistoryDtoSchema.parse(history);

export const toMatchHistoryDtos = (
  histories: MatchHistory[],
): MatchHistoryDto[] => histories.map(toMatchHistoryDto);
