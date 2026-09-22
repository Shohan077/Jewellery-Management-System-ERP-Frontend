import type { Metadata } from "next";

import { CashEntry } from "@/features/cash-management/cash-entry";

export const metadata: Metadata = { title: "Cash Out Entry", description: "Record and review outgoing cash transactions." };

export default function CashOutPage() {
  return <CashEntry direction="Cash Out" />;
}

