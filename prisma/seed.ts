import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";
import {
  CircleRole,
  CircleSessionRole,
  MatchOutcome,
  PrismaClient,
} from "../generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

const users = [
  { id: "user-1", name: "藤井 聡太", email: "sota@example.com" },
  { id: "user-2", name: "羽生 善治", email: "hanyu@example.com" },
  { id: "user-3", name: "渡辺 明", email: "watanabe@example.com" },
  { id: "user-4", name: "伊藤 匠", email: "ito@example.com" },
  { id: "user-5", name: "豊島 将之", email: "toyoshima@example.com" },
  { id: "user-6", name: "永瀬 拓矢", email: "nagase@example.com" },
];

const circle = {
  id: "circle-demo",
  name: "京大将棋研究会",
};

const circleMemberships = [
  { userId: "user-1", role: CircleRole.CircleOwner },
  { userId: "user-2", role: CircleRole.CircleManager },
  { userId: "user-3", role: CircleRole.CircleManager },
  { userId: "user-4", role: CircleRole.CircleMember },
  { userId: "user-5", role: CircleRole.CircleMember },
  { userId: "user-6", role: CircleRole.CircleMember },
];

const sessions = [
  {
    id: "session-40",
    sequence: 40,
    startsAt: new Date("2025-02-11T18:00:00+09:00"),
    endsAt: new Date("2025-02-11T21:00:00+09:00"),
    location: "京都キャンパス A",
  },
  {
    id: "session-41",
    sequence: 41,
    startsAt: new Date("2025-02-26T18:00:00+09:00"),
    endsAt: new Date("2025-02-26T21:00:00+09:00"),
    location: "京都キャンパス A",
  },
  {
    id: "session-42",
    sequence: 42,
    startsAt: new Date("2025-03-12T18:00:00+09:00"),
    endsAt: new Date("2025-03-12T21:00:00+09:00"),
    location: "オンライン",
  },
  {
    id: "session-43",
    sequence: 43,
    startsAt: new Date("2026-03-26T18:00:00+09:00"),
    endsAt: new Date("2026-03-26T21:00:00+09:00"),
    location: "オンライン",
  },
];

const sessionMemberships = [
  {
    circleSessionId: "session-42",
    userId: "user-1",
    role: CircleSessionRole.CircleSessionOwner,
  },
  {
    circleSessionId: "session-42",
    userId: "user-2",
    role: CircleSessionRole.CircleSessionManager,
  },
  {
    circleSessionId: "session-42",
    userId: "user-3",
    role: CircleSessionRole.CircleSessionManager,
  },
  {
    circleSessionId: "session-42",
    userId: "user-4",
    role: CircleSessionRole.CircleSessionMember,
  },
  {
    circleSessionId: "session-42",
    userId: "user-5",
    role: CircleSessionRole.CircleSessionMember,
  },
  {
    circleSessionId: "session-42",
    userId: "user-6",
    role: CircleSessionRole.CircleSessionMember,
  },
];

const matches = [
  {
    id: "match-1",
    circleSessionId: "session-42",
    order: 1,
    player1Id: "user-1",
    player2Id: "user-2",
    outcome: MatchOutcome.P1_WIN,
  },
  {
    id: "match-2",
    circleSessionId: "session-42",
    order: 2,
    player1Id: "user-2",
    player2Id: "user-1",
    outcome: MatchOutcome.P1_WIN,
  },
  {
    id: "match-3",
    circleSessionId: "session-42",
    order: 3,
    player1Id: "user-1",
    player2Id: "user-3",
    outcome: MatchOutcome.P2_WIN,
  },
  {
    id: "match-4",
    circleSessionId: "session-42",
    order: 4,
    player1Id: "user-1",
    player2Id: "user-4",
    outcome: MatchOutcome.DRAW,
  },
  {
    id: "match-5",
    circleSessionId: "session-42",
    order: 5,
    player1Id: "user-2",
    player2Id: "user-3",
    outcome: MatchOutcome.P1_WIN,
  },
  {
    id: "match-6",
    circleSessionId: "session-42",
    order: 6,
    player1Id: "user-3",
    player2Id: "user-4",
    outcome: MatchOutcome.P2_WIN,
  },
  {
    id: "match-7",
    circleSessionId: "session-42",
    order: 7,
    player1Id: "user-4",
    player2Id: "user-5",
    outcome: MatchOutcome.P1_WIN,
  },
  {
    id: "match-8",
    circleSessionId: "session-42",
    order: 8,
    player1Id: "user-5",
    player2Id: "user-6",
    outcome: MatchOutcome.DRAW,
  },
];

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: { name: user.name, email: user.email },
      create: user,
    });
  }

  await prisma.circle.upsert({
    where: { id: circle.id },
    update: { name: circle.name },
    create: circle,
  });

  for (const membership of circleMemberships) {
    await prisma.circleMembership.upsert({
      where: {
        userId_circleId: { userId: membership.userId, circleId: circle.id },
      },
      update: { role: membership.role },
      create: { ...membership, circleId: circle.id },
    });
  }

  for (const session of sessions) {
    await prisma.circleSession.upsert({
      where: { id: session.id },
      update: {
        sequence: session.sequence,
        startsAt: session.startsAt,
        endsAt: session.endsAt,
        location: session.location,
      },
      create: { ...session, circleId: circle.id },
    });
  }

  for (const membership of sessionMemberships) {
    await prisma.circleSessionMembership.upsert({
      where: {
        userId_circleSessionId: {
          userId: membership.userId,
          circleSessionId: membership.circleSessionId,
        },
      },
      update: { role: membership.role },
      create: membership,
    });
  }

  for (const match of matches) {
    await prisma.match.upsert({
      where: {
        circleSessionId_order: {
          circleSessionId: match.circleSessionId,
          order: match.order,
        },
      },
      update: {
        player1Id: match.player1Id,
        player2Id: match.player2Id,
        outcome: match.outcome,
        deletedAt: null,
      },
      create: match,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
