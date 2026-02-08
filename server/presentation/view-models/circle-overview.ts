export type CircleRoleKey = "owner" | "manager" | "member";
export type CircleSessionStatus = "scheduled" | "done" | "draft";

export type CircleOverviewSession = {
  id: string | null;
  title: string;
  dateLabel: string;
  status: CircleSessionStatus;
};

export type CircleOverviewMember = {
  userId: string;
  name: string;
  role: CircleRoleKey;
};

export type CircleOverviewViewModel = {
  circleId: string;
  circleName: string;
  participationCount: number;
  scheduleNote: string | null;
  nextSession: {
    id: string | null;
    title: string;
    dateTimeLabel: string;
    locationLabel: string | null;
  } | null;
  viewerRole: CircleRoleKey | null;
  recentSessions: CircleOverviewSession[];
  members: CircleOverviewMember[];
};

export type CircleOverviewProviderInput = {
  circleId: string;
  viewerId: string | null;
};

export type CircleOverviewProvider = {
  getOverview(
    input: CircleOverviewProviderInput,
  ): Promise<CircleOverviewViewModel>;
};
