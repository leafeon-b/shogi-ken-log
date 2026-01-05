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
  { id: "user-7", name: "佐々木 勇気", email: "sasaki@example.com" },
  { id: "user-8", name: "菅井 竜也", email: "sugai@example.com" },
];

const circle = {
  id: "demo",
  name: "京大将棋研究会",
};

const circleMemberships = [
  { userId: "user-1", role: CircleRole.CircleOwner },
  { userId: "user-2", role: CircleRole.CircleManager },
  { userId: "user-3", role: CircleRole.CircleManager },
  { userId: "user-4", role: CircleRole.CircleMember },
];

const sessions = [
  {
    id: "demo-session-40",
    sequence: 40,
    title: "冬季対局会",
    startsAt: new Date("2025-02-11T18:00:00+09:00"),
    endsAt: new Date("2025-02-11T21:00:00+09:00"),
    location: "京都キャンパス A",
    note: "",
  },
  {
    id: "demo-session-41",
    sequence: 41,
    title: "第41回 週末研究会",
    startsAt: new Date("2025-02-26T18:00:00+09:00"),
    endsAt: new Date("2025-02-26T21:00:00+09:00"),
    location: "京都キャンパス A",
    note: "",
  },
  {
    id: "demo-session-42",
    sequence: 42,
    title: "第42回 週末研究会",
    startsAt: new Date("2025-03-12T18:00:00+09:00"),
    endsAt: new Date("2025-03-12T21:00:00+09:00"),
    location: "オンライン",
    note: "進行表は開始10分前に共有",
  },
  {
    id: "demo-session-43",
    sequence: 43,
    title: "第43回 週末研究会",
    startsAt: new Date("2026-03-26T18:00:00+09:00"),
    endsAt: new Date("2026-03-26T21:00:00+09:00"),
    location: "オンライン",
    note: "",
  },
];

const sessionMemberships = [
  {
    circleSessionId: "demo-session-42",
    userId: "user-1",
    role: CircleSessionRole.CircleSessionOwner,
  },
  {
    circleSessionId: "demo-session-42",
    userId: "user-5",
    role: CircleSessionRole.CircleSessionManager,
  },
  {
    circleSessionId: "demo-session-42",
    userId: "user-6",
    role: CircleSessionRole.CircleSessionManager,
  },
  {
    circleSessionId: "demo-session-42",
    userId: "user-7",
    role: CircleSessionRole.CircleSessionMember,
  },
  {
    circleSessionId: "demo-session-42",
    userId: "user-4",
    role: CircleSessionRole.CircleSessionMember,
  },
  {
    circleSessionId: "demo-session-42",
    userId: "user-8",
    role: CircleSessionRole.CircleSessionMember,
  },
];

const matches = [
  {
    id: "match-1",
    circleSessionId: "demo-session-42",
    order: 1,
    player1Id: "user-1",
    player2Id: "user-5",
    outcome: MatchOutcome.P1_WIN,
  },
  {
    id: "match-2",
    circleSessionId: "demo-session-42",
    order: 2,
    player1Id: "user-5",
    player2Id: "user-1",
    outcome: MatchOutcome.P1_WIN,
  },
  {
    id: "match-3",
    circleSessionId: "demo-session-42",
    order: 3,
    player1Id: "user-1",
    player2Id: "user-6",
    outcome: MatchOutcome.P2_WIN,
  },
  {
    id: "match-4",
    circleSessionId: "demo-session-42",
    order: 4,
    player1Id: "user-1",
    player2Id: "user-7",
    outcome: MatchOutcome.DRAW,
  },
  {
    id: "match-5",
    circleSessionId: "demo-session-42",
    order: 5,
    player1Id: "user-5",
    player2Id: "user-6",
    outcome: MatchOutcome.P1_WIN,
  },
  {
    id: "match-6",
    circleSessionId: "demo-session-42",
    order: 6,
    player1Id: "user-5",
    player2Id: "user-6",
    outcome: MatchOutcome.P2_WIN,
  },
  {
    id: "match-7",
    circleSessionId: "demo-session-42",
    order: 7,
    player1Id: "user-6",
    player2Id: "user-5",
    outcome: MatchOutcome.P1_WIN,
  },
  {
    id: "match-8",
    circleSessionId: "demo-session-42",
    order: 8,
    player1Id: "user-5",
    player2Id: "user-4",
    outcome: MatchOutcome.P2_WIN,
  },
  {
    id: "match-9",
    circleSessionId: "demo-session-42",
    order: 9,
    player1Id: "user-6",
    player2Id: "user-8",
    outcome: MatchOutcome.P2_WIN,
  },
  {
    id: "match-10",
    circleSessionId: "demo-session-42",
    order: 10,
    player1Id: "user-7",
    player2Id: "user-4",
    outcome: MatchOutcome.P1_WIN,
  },
  {
    id: "match-11",
    circleSessionId: "demo-session-42",
    order: 11,
    player1Id: "user-7",
    player2Id: "user-4",
    outcome: MatchOutcome.DRAW,
  },
  {
    id: "match-12",
    circleSessionId: "demo-session-42",
    order: 12,
    player1Id: "user-4",
    player2Id: "user-7",
    outcome: MatchOutcome.P1_WIN,
  },
  {
    id: "match-13",
    circleSessionId: "demo-session-42",
    order: 13,
    player1Id: "user-4",
    player2Id: "user-8",
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
        title: session.title,
        startsAt: session.startsAt,
        endsAt: session.endsAt,
        location: session.location,
        note: session.note,
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
