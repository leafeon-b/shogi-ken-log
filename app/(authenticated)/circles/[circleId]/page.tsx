import { CircleOverviewView } from "@/app/(authenticated)/circles/components/circle-overview-view";
import { trpcCircleOverviewProvider } from "@/server/presentation/providers/trpc-circle-overview-provider";
import { notFound } from "next/navigation";
import { TRPCError } from "@trpc/server";

type CircleDetailPageProps = {
  params: Promise<{ circleId: string }>;
};

export default async function CircleDetailPage({
  params,
}: CircleDetailPageProps) {
  const { circleId } = await params;
  if (!circleId) {
    notFound();
  }

  let overview;
  try {
    overview = await trpcCircleOverviewProvider.getOverview({
      circleId,
      viewerId: null,
    });
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }

  return (
    <CircleOverviewView
      overview={overview}
      getSessionHref={(session) =>
        session.id ? `/circle-sessions/${session.id}` : null
      }
      getNextSessionHref={(session) =>
        session.id ? `/circle-sessions/${session.id}` : null
      }
    />
  );
}
