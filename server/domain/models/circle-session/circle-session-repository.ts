import type { CircleSession } from "@/server/domain/models/circle-session/circle-session";
import type { CircleId, CircleSessionId } from "@/server/domain/common/ids";

export type CircleSessionRepository = {
  findById(id: CircleSessionId): Promise<CircleSession | null>;
  findByIds(ids: readonly CircleSessionId[]): Promise<CircleSession[]>;
  listByCircleId(circleId: CircleId): Promise<CircleSession[]>;
  save(session: CircleSession): Promise<void>;
  delete(id: CircleSessionId): Promise<void>;
};
