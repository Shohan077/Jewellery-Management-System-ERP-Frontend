import type { Metadata } from "next";

import { CashLedger } from "@/features/cash-management/cash-ledger";

export const metadata: Metadata = { title: "Cash Ledger", description: "Filter and export the complete cash transaction ledger." };

export default function CashLedgerPage() {
  return <CashLedger />;
}

