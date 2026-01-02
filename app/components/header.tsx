"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <header className="border-b bg-muted px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <span className="text-lg font-semibold">将研ログ</span>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
          ログアウト
        </Button>
      </div>
    </header>
  );
}
