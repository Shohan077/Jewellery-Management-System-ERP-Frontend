import type { Metadata } from "next";

import { AccountEntry } from "@/features/cash-management/account-entry";

export const metadata: Metadata = { title: "Payment Entry", description: "Record and review account payments." };

export default function PaymentEntryPage() {
  return <AccountEntry mode="Payment" />;
}

