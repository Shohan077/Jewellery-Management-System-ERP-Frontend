import type { Metadata } from "next";

import { AccountingProfitLoss } from "@/features/accounting-suite/accounting-profit-loss";

export const metadata: Metadata = { title: "Accounting Profit & Loss", description: "Review business profitability and monthly trends." };

export default function AccountingProfitLossPage() {
  return <AccountingProfitLoss />;
}

