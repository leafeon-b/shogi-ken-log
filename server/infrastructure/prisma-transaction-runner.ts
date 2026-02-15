import type { TransactionRunner } from "@/server/application/common/transaction-runner";
import { prisma } from "@/server/infrastructure/db";
import { createPrismaMatchRepository } from "@/server/infrastructure/repository/match/prisma-match-repository";
import { createPrismaMatchHistoryRepository } from "@/server/infrastructure/repository/match-history/prisma-match-history-repository";

export const prismaTransactionRunner: TransactionRunner = async (operation) => {
  return prisma.$transaction(async (tx) => {
    return operation({
      matchRepository: createPrismaMatchRepository(tx),
      matchHistoryRepository: createPrismaMatchHistoryRepository(tx),
    });
  });
};
