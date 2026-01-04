import type { ReactNode } from "react";
import {
  demoRoleLinks,
  demoCircleOverviewProvider,
} from "@/app/(authenticated)/circles/demo/demo-circle-overview-provider";
import type { CircleRoleKey } from "@/server/presentation/view-models/circle-overview";
import { CircleOverviewContainer } from "@/app/(authenticated)/circles/components/circle-overview-container";

type CircleDemoPageProps = {
  heroContent?: ReactNode;
  role?: CircleRoleKey;
};

export function CircleDemoPage({ heroContent, role }: CircleDemoPageProps) {
  return (
    <CircleOverviewContainer
      provider={demoCircleOverviewProvider}
      circleId="demo"
      viewerId={null}
      viewerRoleOverride={role}
      heroContent={heroContent}
      roleLinks={demoRoleLinks}
      getSessionHref={() => "/circle-sessions/demo"}
      getMemberHref={() => "/users/demo"}
      getNextSessionHref={() => "/circle-sessions/demo"}
    />
  );
}

export default function CircleDemoOwnerPage() {
  return <CircleDemoPage role="owner" />;
}
