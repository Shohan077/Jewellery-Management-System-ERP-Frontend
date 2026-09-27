import type { Metadata } from "next";
import { Reference55Ledger } from "@/features/reference-55/ledger-screen";

export const metadata: Metadata = { title: "Ledger | Jewellery Manager", description: "View and filter detailed customer ledger transactions." };

export default function AccountLedgerPage() {
  return <Reference55Ledger />;
}

