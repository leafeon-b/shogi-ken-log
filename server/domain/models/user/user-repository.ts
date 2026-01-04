import type { UserId } from "@/server/domain/common/ids";
import type { User } from "@/server/domain/models/user/user";

export type UserRepository = {
  findById(id: UserId): Promise<User | null>;
  findByIds(ids: readonly UserId[]): Promise<User[]>;
  save(user: User): Promise<void>;
};
