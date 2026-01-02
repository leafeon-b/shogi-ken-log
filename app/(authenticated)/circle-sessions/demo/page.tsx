import { Button } from "@/components/ui/button";
import Link from "next/link";

const attendees = [
  { name: "藤井 聡太", role: "オーナー" },
  { name: "豊島 将之", role: "マネージャー" },
  { name: "永瀬 拓矢", role: "メンバー" },
  { name: "佐々木 勇気", role: "メンバー" },
];

const roleClasses: Record<string, string> = {
  オーナー: "bg-[color:var(--brand-gold)]/25 text-[color:var(--brand-ink)]",
  マネージャー: "bg-[color:var(--brand-sky)]/25 text-[color:var(--brand-ink)]",
  メンバー: "bg-[color:var(--brand-moss)]/20 text-[color:var(--brand-ink)]",
};

export default function CircleSessionDemoPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <section className="rounded-3xl border border-border/60 bg-white/90 p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="mt-3 text-3xl font-(--font-display) text-(--brand-ink) sm:text-4xl">
              第42回 週末研究会
            </h1>
            <p className="mt-3 text-sm text-(--brand-ink-muted)">
              2025/03/12 18:00 - 21:00 / オンライン
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-(--brand-moss) text-white hover:bg-(--brand-moss)/90">
              参加者を追加
            </Button>
            <Button
              variant="outline"
              className="border-(--brand-moss)/30 bg-white/70 text-(--brand-ink) hover:bg-white"
            >
              メモを編集
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-1">
        <div className="rounded-2xl border border-border/60 bg-white/90 p-6 shadow-sm">
          <p className="text-sm font-semibold text-(--brand-ink)">参加者</p>
          <div className="mt-4 space-y-3">
            {attendees.map((attendee) => (
              <Link
                key={attendee.name}
                href="/users/demo"
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-white/70 p-4 transition hover:border-border hover:bg-white hover:shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-(--brand-ink)">
                    {attendee.name}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs ${roleClasses[attendee.role] ?? "bg-(--brand-ink)/10 text-(--brand-ink)"}`}
                >
                  {attendee.role}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
