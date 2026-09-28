import type { Metadata } from "next";
import { Reference64CashBook } from "@/features/reference-64/screens";

export const metadata: Metadata = { title: "Cash Book | Jewellery Manager", description: "Review, filter and manage cash receipts and payments." };

export default function CashLedgerPage() {
  return <Reference64CashBook />;
}

