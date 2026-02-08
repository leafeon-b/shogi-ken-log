import type { ReactNode } from "react";
import { CircleOverviewView } from "@/app/(authenticated)/circles/components/circle-overview-view";
import type {
  CircleOverviewProvider,
  CircleOverviewViewModel,
} from "@/server/presentation/view-models/circle-overview";
import type {
  CircleOverviewMember,
  CircleOverviewSession,
} from "@/server/presentation/view-models/circle-overview";

export type CircleOverviewContainerProps = {
  provider: CircleOverviewProvider;
  circleId: string;
  viewerId: string | null;
  heroContent?: ReactNode;
  getSessionHref?: (session: CircleOverviewSession) => string | null;
  getMemberHref?: (member: CircleOverviewMember) => string | null;
  getNextSessionHref?: (
    nextSession: NonNullable<CircleOverviewViewModel["nextSession"]>,
  ) => string | null;
};

export async function CircleOverviewContainer({
  provider,
  circleId,
  viewerId,
  heroContent,
  getSessionHref,
  getMemberHref,
  getNextSessionHref,
}: CircleOverviewContainerProps) {
  const overview = await provider.getOverview({
    circleId,
    viewerId,
  });

  return (
    <CircleOverviewView
      overview={overview}
      heroContent={heroContent}
      getSessionHref={getSessionHref}
      getMemberHref={getMemberHref}
      getNextSessionHref={getNextSessionHref}
    />
  );
}
