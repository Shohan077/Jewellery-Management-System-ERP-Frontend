import type { Metadata } from "next";

import { ExpenseCategoryManager } from "@/features/purchase-expense-suite/expense-category-manager";

export const metadata: Metadata = { title: "Purchase Expense Categories" };

export default function PurchaseExpenseCategoriesPage() {
  return <ExpenseCategoryManager />;
}
