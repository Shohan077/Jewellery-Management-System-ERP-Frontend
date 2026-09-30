import type { Metadata } from "next";
import { AccountLedger } from "@/features/accounting-suite/account-ledger";

export const metadata: Metadata = { title: "Account Ledger | Jewellery Manager", description: "View and filter detailed account ledger transactions." };

export default function AccountLedgerPage() {
  return <AccountLedger />;
}

