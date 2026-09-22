import type { Metadata } from "next";

import { ExpenseEntry } from "@/features/cash-management/expense-entry";

export const metadata: Metadata = { title: "Expense Entry", description: "Record an account expense and update reports." };

export default function ExpenseEntryPage() {
  return <ExpenseEntry />;
}

