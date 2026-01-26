import { CircleOverviewContainer } from "@/app/(authenticated)/circles/components/circle-overview-container";
import { trpcCircleOverviewProvider } from "@/server/presentation/providers/trpc-circle-overview-provider";

type CircleDetailPageProps = {
  params: Promise<{ circleId: string }>;
};

export default async function CircleDetailPage({
  params,
}: CircleDetailPageProps) {
  const { circleId } = await params;

  return (
    <CircleOverviewContainer
      provider={trpcCircleOverviewProvider}
      circleId={circleId}
      viewerId={null}
      getSessionHref={(session) =>
        session.id ? `/circle-sessions/${session.id}` : null
      }
      getNextSessionHref={(session) =>
        session.id ? `/circle-sessions/${session.id}` : null
      }
    />
  );
}
