import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div
      className="relative mx-auto flex w-full max-w-6xl flex-col gap-10"
      role="status"
      aria-label="読み込み中"
    >
      <span className="sr-only">ホームを読み込み中です</span>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Next Session Card */}
        <div className="rounded-2xl border border-border/60 bg-white/85 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-7 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>

        {/* Circle Create Form Card */}
        <div className="flex items-center rounded-2xl border border-border/60 bg-white/85 p-6 shadow-sm">
          <div className="flex w-full flex-col gap-3">
            <Skeleton className="h-3 w-28" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div>
        <div className="rounded-2xl border border-border/60 bg-white/90 p-6 shadow-sm">
          <Skeleton className="mb-4 h-4 w-20" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
