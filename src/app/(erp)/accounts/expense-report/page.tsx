import type { Metadata } from "next";

import { ExpenseReport } from "@/features/cash-management/expense-report";

export const metadata: Metadata = { title: "Expense Report", description: "Filter, analyse, and export account expenses." };

export default function ExpenseReportPage() {
  return <ExpenseReport />;
}

