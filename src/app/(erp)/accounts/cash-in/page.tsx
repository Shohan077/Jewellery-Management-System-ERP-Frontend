import type { Metadata } from "next";

import { CashEntry } from "@/features/cash-management/cash-entry";

export const metadata: Metadata = { title: "Cash In Entry", description: "Record and review incoming cash transactions." };

export default function CashInPage() {
  return <CashEntry direction="Cash In" />;
}

