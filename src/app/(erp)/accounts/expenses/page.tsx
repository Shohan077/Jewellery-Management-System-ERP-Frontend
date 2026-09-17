import type { Metadata } from "next";
import { ExpenseLedger } from "@/features/expense-ledger/expense-ledger";

export const metadata: Metadata = {
  title: "Expense Management",
  description: "Track and manage jewellery ERP business expenses.",
};

export default function ExpenseLedgerPage() {
  return <ExpenseLedger />;
}
