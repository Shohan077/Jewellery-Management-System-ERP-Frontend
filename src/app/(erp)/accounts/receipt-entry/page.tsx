import type { Metadata } from "next";

import { AccountEntry } from "@/features/cash-management/account-entry";

export const metadata: Metadata = { title: "Receipt Entry", description: "Record and review account receipts." };

export default function ReceiptEntryPage() {
  return <AccountEntry mode="Receipt" />;
}

