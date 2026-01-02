"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

type LoginButtonProps = {
  className?: string;
};

export default function LoginButton({ className }: LoginButtonProps) {
  return (
    <Button
      className={className}
      onClick={() => signIn("google", { callbackUrl: "/home" })}
    >
      ログイン
    </Button>
  );
}
