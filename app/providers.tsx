"use client";

import type { ReactNode } from "react";
import { TrpcProvider } from "@/lib/trpc/client";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return <TrpcProvider>{children}</TrpcProvider>;
}
