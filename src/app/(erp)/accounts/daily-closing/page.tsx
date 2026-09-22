import type { Metadata } from "next";

import { DailyClosing } from "@/features/cash-management/daily-closing";

export const metadata: Metadata = { title: "Daily Closing", description: "Review, verify, print, and confirm daily cash closing." };

export default function DailyClosingPage() {
  return <DailyClosing />;
}

