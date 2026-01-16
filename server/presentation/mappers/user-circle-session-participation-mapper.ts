import type { UserCircleSessionParticipationSummary } from "@/server/application/circle-session/circle-session-participation-service";
import {
  userCircleSessionParticipationSummaryDtoSchema,
  type UserCircleSessionParticipationSummaryDto,
} from "@/server/presentation/dto/user-circle-session-participation";

export const toUserCircleSessionParticipationSummaryDto = (
  summary: UserCircleSessionParticipationSummary,
): UserCircleSessionParticipationSummaryDto =>
  userCircleSessionParticipationSummaryDtoSchema.parse(summary);

export const toUserCircleSessionParticipationSummaryDtos = (
  summaries: UserCircleSessionParticipationSummary[],
): UserCircleSessionParticipationSummaryDto[] =>
  summaries.map(toUserCircleSessionParticipationSummaryDto);
