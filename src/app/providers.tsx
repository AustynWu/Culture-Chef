"use client";

import { ModeProvider } from "@/components/mode-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ModeProvider>{children}</ModeProvider>;
}