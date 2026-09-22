import type { Metadata } from "next";

import { PurchaseExpenseEntry } from "@/features/purchase-expense-reporting/purchase-expense-entry";

export const metadata: Metadata = {
  title: "Purchase Expense Entry",
};

export default function PurchaseExpenseEntryPage() {
  return <PurchaseExpenseEntry />;
}
