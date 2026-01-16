"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";

const roleLabels: Record<string, string> = {
  CircleOwner: "オーナー",
  CircleManager: "マネージャー",
  CircleMember: "メンバー",
};

const roleClasses: Record<string, string> = {
  CircleOwner: "bg-(--brand-gold)/25 text-(--brand-ink)",
  CircleManager: "bg-(--brand-sky)/25 text-(--brand-ink)",
  CircleMember: "bg-(--brand-moss)/20 text-(--brand-ink)",
};

const sessionStatusLabels: Record<string, string> = {
  done: "開催済み",
  scheduled: "予定",
  draft: "準備中",
};

const sessionStatusClasses: Record<string, string> = {
  done: "bg-(--brand-moss)/20 text-(--brand-ink)",
  scheduled: "bg-(--brand-sky)/20 text-(--brand-ink)",
  draft: "bg-(--brand-gold)/20 text-(--brand-ink)",
};

const pad2 = (value: number) => String(value).padStart(2, "0");

const formatDate = (date: Date) =>
  `${date.getFullYear()}/${pad2(date.getMonth() + 1)}/${pad2(date.getDate())}`;

export default function UserDemoPage() {
  const participationsQuery =
    trpc.users.circles.participations.list.useQuery({});
  const memberships = participationsQuery.data ?? [];
  const recentSessionsQuery =
    trpc.users.circleSessions.participations.list.useQuery({ limit: 3 });
  const recentSessions = recentSessionsQuery.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <section className="rounded-3xl border border-border/60 bg-white/90 p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="mt-3 text-3xl font-(--font-display) text-(--brand-ink) sm:text-4xl">
              藤井 聡太
            </h1>
            <p className="mt-2 text-sm text-(--brand-ink-muted)">
              研究会参加 2件 / 活動回数 8回
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-border/60 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-(--brand-ink)">
              参加中の研究会
            </p>
            <Button
              variant="ghost"
              className="text-xs text-(--brand-ink-muted) hover:text-(--brand-ink)"
            >
              すべて見る
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {participationsQuery.isLoading ? (
              <p className="text-sm text-(--brand-ink-muted)">
                読み込み中...
              </p>
            ) : participationsQuery.isError ? (
              <p className="text-sm text-(--brand-ink-muted)">
                参加中の研究会を取得できませんでした
              </p>
            ) : memberships.length === 0 ? (
              <p className="text-sm text-(--brand-ink-muted)">
                参加中の研究会はまだありません
              </p>
            ) : (
              memberships.map((circle) => {
                const roleLabel = roleLabels[circle.role] ?? "メンバー";
                const roleClass =
                  roleClasses[circle.role] ??
                  "bg-(--brand-ink)/10 text-(--brand-ink)";

                return (
                  <Link
                    key={circle.circleId}
                    href={`/circles/${circle.circleId}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-white/70 p-4 transition hover:border-border hover:bg-white hover:shadow-sm"
                  >
                    <p className="text-sm font-semibold text-(--brand-ink)">
                      {circle.circleName}
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${roleClass}`}
                    >
                      {roleLabel}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-(--brand-ink)">
              最近参加した回
            </p>
            <Button
              variant="ghost"
              className="text-xs text-(--brand-ink-muted) hover:text-(--brand-ink)"
            >
              すべて見る
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {recentSessionsQuery.isLoading ? (
              <p className="text-sm text-(--brand-ink-muted)">
                読み込み中...
              </p>
            ) : recentSessionsQuery.isError ? (
              <p className="text-sm text-(--brand-ink-muted)">
                最近参加した回を取得できませんでした
              </p>
            ) : recentSessions.length === 0 ? (
              <p className="text-sm text-(--brand-ink-muted)">
                最近参加した回はまだありません
              </p>
            ) : (
              recentSessions.map((session) => {
                const statusLabel =
                  sessionStatusLabels[session.status] ?? "参加中";
                const statusClass =
                  sessionStatusClasses[session.status] ??
                  "bg-(--brand-ink)/10 text-(--brand-ink)";

                return (
                  <Link
                    key={session.circleSessionId}
                    href={`/circle-sessions/${session.circleSessionId}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-white/70 p-4 transition hover:border-border hover:bg-white hover:shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-semibold text-(--brand-ink)">
                        {session.title}
                      </p>
                      <p className="text-xs text-(--brand-ink-muted)">
                        {formatDate(session.startsAt)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${statusClass}`}
                    >
                      {statusLabel}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
