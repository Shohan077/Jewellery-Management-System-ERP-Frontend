import type { Metadata } from "next";

import { Reference62DailyCashBook } from "@/features/reference-62/screens";

export const metadata: Metadata = { title: "Daily Cash Book", description: "Review and manage daily cash transactions." };

export default function DailyClosingPage() {
  return <Reference62DailyCashBook />;
}

