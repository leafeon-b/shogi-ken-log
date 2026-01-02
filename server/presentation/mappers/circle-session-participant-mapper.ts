import type { CircleSessionParticipant } from "@/server/domain/models/circle-session/circle-session-participant";
import {
  circleSessionParticipantDtoSchema,
  type CircleSessionParticipantDto,
} from "@/server/presentation/dto/circle-session-participant";

export const toCircleSessionParticipantDto = (
  participant: CircleSessionParticipant,
): CircleSessionParticipantDto =>
  circleSessionParticipantDtoSchema.parse(participant);

export const toCircleSessionParticipantDtos = (
  participants: CircleSessionParticipant[],
): CircleSessionParticipantDto[] =>
  participants.map(toCircleSessionParticipantDto);
