import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="text-6xl font-bold text-(--brand-moss)">403</h1>
        <h2 className="text-2xl font-(--font-display) text-(--brand-ink)">
          アクセス権限がありません
        </h2>
        <p className="text-sm leading-relaxed text-(--brand-ink-muted)">
          このページにアクセスする権限がありません。
        </p>
        <Button
          asChild
          className="bg-(--brand-moss) hover:bg-(--brand-moss)/90"
        >
          <Link href="/">ホームに戻る</Link>
        </Button>
      </div>
    </div>
  );
}
