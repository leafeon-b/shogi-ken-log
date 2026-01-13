import type {
  CircleOverviewAction,
  CircleOverviewPanelItem,
  CircleOverviewProvider,
  CircleOverviewProviderInput,
  CircleOverviewSession,
  CircleOverviewViewModel,
  CircleRoleKey,
} from "@/server/presentation/view-models/circle-overview";
import { CircleRole } from "@/server/domain/services/authz/roles";
import { userId } from "@/server/domain/common/ids";
import { appRouter } from "@/server/presentation/trpc/router";
import { createContext } from "@/server/presentation/trpc/context";

type RoleConfig = {
  actions: CircleOverviewAction[];
  panelTitle: string;
  panelItems: CircleOverviewPanelItem[];
};

export const demoRoleLinks: Array<{
  role: CircleRoleKey;
  label: string;
  href: string;
}> = [
  { role: "owner", label: "オーナー", href: "/circles/demo/owner" },
  { role: "manager", label: "マネージャー", href: "/circles/demo/manager" },
  { role: "member", label: "メンバー", href: "/circles/demo/member" },
];

const sessions: CircleOverviewSession[] = [
  {
    id: "session-42",
    title: "第42回 週末研究会",
    dateLabel: "2025/03/12",
    status: "done",
  },
  {
    id: "session-41",
    title: "第41回 週末研究会",
    dateLabel: "2025/02/26",
    status: "done",
  },
  {
    id: "session-40",
    title: "冬季対局会",
    dateLabel: "2025/02/11",
    status: "done",
  },
];

const defaultActions: CircleOverviewAction[] = [
  {
    label: "開催日程を追加",
    className: "bg-(--brand-moss) text-white hover:bg-(--brand-moss)/90",
  },
  {
    label: "参加者を管理",
    variant: "outline",
    className:
      "border-(--brand-moss)/30 bg-white/70 text-(--brand-ink) hover:bg-white",
  },
];

const ownerManagerBase: Pick<
  RoleConfig,
  "actions" | "panelTitle" | "panelItems"
> = {
  actions: [
    {
      label: "開催日程を追加",
      className:
        "bg-(--brand-gold) text-(--brand-ink) hover:bg-(--brand-gold)/90",
    },
    {
      label: "参加者を管理",
      variant: "outline",
      className:
        "border-(--brand-gold)/40 bg-white/70 text-(--brand-ink) hover:bg-white",
    },
  ],
  panelTitle: "運営タスク",
  panelItems: [
    { title: "参加申請の承認", meta: "承認待ち 2件", status: "要対応" },
    { title: "次期の役割設定", meta: "4月期の割り当て", status: "準備中" },
    { title: "開催場所の更新", meta: "京都キャンパス A", status: "進行中" },
  ],
};

const roleConfigs: Record<CircleRoleKey, RoleConfig> = {
  owner: { ...ownerManagerBase },
  manager: { ...ownerManagerBase },
  member: {
    actions: [
      {
        label: "参加予定を登録",
        className: "bg-(--brand-moss) text-white hover:bg-(--brand-moss)/90",
      },
      {
        label: "参加者一覧",
        variant: "outline",
        className:
          "border-(--brand-moss)/30 bg-white/70 text-(--brand-ink) hover:bg-white",
      },
    ],
    panelTitle: "メンバーの参加メモ",
    panelItems: [
      { title: "次回の参加", meta: "出席で登録済み", status: "登録済み" },
      { title: "対局テーマ", meta: "中盤の形を研究", status: "確認中" },
      { title: "連絡事項", meta: "3/15 会場変更", status: "お知らせ" },
    ],
  },
};

const roleKeyByDto: Record<CircleRole, CircleRoleKey> = {
  [CircleRole.CircleOwner]: "owner",
  [CircleRole.CircleManager]: "manager",
  [CircleRole.CircleMember]: "member",
};

const getViewerRole = (
  participations: Array<{ userId: string; role: CircleRole }>,
  viewerId: string | null,
): CircleRoleKey | null => {
  if (!viewerId) {
    return null;
  }
  const participation = participations.find((item) => item.userId === viewerId);
  if (!participation) {
    return null;
  }
  return roleKeyByDto[participation.role] ?? null;
};

export const getDemoCircleOverview = (input: {
  circleId: string;
  circleName: string;
  participationCount: number;
  members: CircleOverviewViewModel["members"];
  viewerRole: CircleRoleKey | null;
}): CircleOverviewViewModel => {
  const roleConfig = input.viewerRole ? roleConfigs[input.viewerRole] : null;

  return {
    circleId: input.circleId,
    circleName: input.circleName,
    participationCount: input.participationCount,
    scheduleNote: "毎週土曜 18:00 - 21:00",
    nextSession: {
      id: "next-session",
      dateTimeLabel: "2026/03/26 18:00 - 21:00",
      locationLabel: "オンライン",
    },
    viewerRole: input.viewerRole,
    actions: roleConfig?.actions ?? defaultActions,
    rolePanel: roleConfig
      ? { title: roleConfig.panelTitle, items: roleConfig.panelItems }
      : null,
    recentSessions: sessions,
    members: input.members,
  };
};

export const demoCircleOverviewProvider: CircleOverviewProvider = {
  async getOverview(input: CircleOverviewProviderInput) {
    const ctx = await createContext();
    const caller = appRouter.createCaller(ctx);

    const [circle, participations] = await Promise.all([
      caller.circles.get({ circleId: input.circleId }),
      caller.circles.participations.list({ circleId: input.circleId }),
    ]);

    const users = participations.length
      ? await ctx.userService.listUsers(
          ctx.actorId,
          participations.map((participation) => userId(participation.userId)),
        )
      : [];
    const userNameById = new Map(
      users.map((user) => [user.id as string, user.name]),
    );

    const viewerId = input.viewerId ?? ctx.actorId ?? null;
    const viewerRole =
      input.viewerRoleOverride ?? getViewerRole(participations, viewerId);

    const members = participations.map((participation) => ({
      userId: participation.userId,
      name: userNameById.get(participation.userId) ?? participation.userId,
      role: roleKeyByDto[participation.role] ?? "member",
    }));

    return getDemoCircleOverview({
      circleId: circle.id,
      circleName: circle.name,
      participationCount: participations.length,
      members,
      viewerRole,
    });
  },
};
