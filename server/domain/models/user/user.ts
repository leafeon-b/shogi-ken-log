import type { UserId } from "@/server/domain/common/ids";

export type User = {
  id: UserId;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
};

export type UserCreateParams = {
  id: UserId;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  createdAt?: Date;
};

export const createUser = (params: UserCreateParams): User => ({
  id: params.id,
  name: params.name ?? null,
  email: params.email ?? null,
  image: params.image ?? null,
  createdAt: params.createdAt ?? new Date(),
});
