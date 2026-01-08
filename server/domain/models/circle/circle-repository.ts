import type { Circle } from "@/server/domain/models/circle/circle";
import type { CircleId } from "@/server/domain/common/ids";

export type CircleRepository = {
  findById(id: CircleId): Promise<Circle | null>;
  findByIds(ids: readonly CircleId[]): Promise<Circle[]>;
  save(circle: Circle): Promise<void>;
  delete(id: CircleId): Promise<void>;
};
