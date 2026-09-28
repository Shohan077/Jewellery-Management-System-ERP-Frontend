import type { Metadata } from "next";
import { Reference55CashBook } from "@/features/reference-55/cash-book-screen";

export const metadata: Metadata = { title: "Cash Book Legacy" };

export default function CashLedgerLegacyPage() {
  return <Reference55CashBook />;
}
