import type { Metadata } from "next";
import { Reference55CashBook } from "@/features/reference-55/cash-book-screen";

export const metadata: Metadata = { title: "Cash Book | Jewellery Manager", description: "Review, filter and manage cash receipts and payments." };

export default function CashLedgerPage() {
  return <Reference55CashBook />;
}

