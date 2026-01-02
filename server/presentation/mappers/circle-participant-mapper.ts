import type { CircleParticipant } from "@/server/domain/models/circle/circle-participant";
import {
  circleParticipantDtoSchema,
  type CircleParticipantDto,
} from "@/server/presentation/dto/circle-participant";

export const toCircleParticipantDto = (
  participant: CircleParticipant,
): CircleParticipantDto => circleParticipantDtoSchema.parse(participant);

export const toCircleParticipantDtos = (
  participants: CircleParticipant[],
): CircleParticipantDto[] => participants.map(toCircleParticipantDto);
