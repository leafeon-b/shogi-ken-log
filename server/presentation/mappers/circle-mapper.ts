import type { Circle } from "@/server/domain/models/circle/circle";
import {
  circleDtoSchema,
  type CircleDto,
} from "@/server/presentation/dto/circle";

export const toCircleDto = (circle: Circle): CircleDto =>
  circleDtoSchema.parse(circle);

export const toCircleDtos = (circles: Circle[]): CircleDto[] =>
  circles.map(toCircleDto);
