import type { ReactNode } from "react";
import { CircleOverviewView } from "@/app/(authenticated)/circles/components/circle-overview-view";
import type {
  CircleOverviewProvider,
  CircleOverviewProviderInput,
  CircleOverviewViewModel,
} from "@/server/presentation/view-models/circle-overview";
import type {
  CircleOverviewMember,
  CircleOverviewSession,
} from "@/server/presentation/view-models/circle-overview";
import type { CircleOverviewRoleLink } from "@/app/(authenticated)/circles/components/circle-overview-view";

export type CircleOverviewContainerProps = {
  provider: CircleOverviewProvider;
  circleId: string;
  viewerId: string | null;
  viewerRoleOverride?: CircleOverviewProviderInput["viewerRoleOverride"];
  heroContent?: ReactNode;
  roleLinks?: CircleOverviewRoleLink[];
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
  viewerRoleOverride,
  heroContent,
  roleLinks,
  getSessionHref,
  getMemberHref,
  getNextSessionHref,
}: CircleOverviewContainerProps) {
  const overview = await provider.getOverview({
    circleId,
    viewerId,
    viewerRoleOverride,
  });

  return (
    <CircleOverviewView
      overview={overview}
      heroContent={heroContent}
      roleLinks={roleLinks}
      getSessionHref={getSessionHref}
      getMemberHref={getMemberHref}
      getNextSessionHref={getNextSessionHref}
    />
  );
}
