import type { Metadata } from "next";

import { PurchaseExpenseReport } from "@/features/purchase-expense-reporting/purchase-expense-report";

export const metadata: Metadata = {
  title: "Purchase Expense Report",
};

export default function PurchaseExpenseReportPage() {
  return <PurchaseExpenseReport />;
}
