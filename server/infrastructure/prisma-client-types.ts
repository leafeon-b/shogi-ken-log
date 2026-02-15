import type { PrismaClient } from "@/generated/prisma/client";

export type PrismaLike = Pick<PrismaClient, "match" | "matchHistory">;
