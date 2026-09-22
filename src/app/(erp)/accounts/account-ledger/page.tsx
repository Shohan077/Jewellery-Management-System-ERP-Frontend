import type { Metadata } from "next";

import { AccountLedger } from "@/features/accounting-suite/account-ledger";

export const metadata: Metadata = { title: "Account Ledger", description: "View, filter, and export detailed account transactions." };

export default function AccountLedgerPage() {
  return <AccountLedger />;
}

