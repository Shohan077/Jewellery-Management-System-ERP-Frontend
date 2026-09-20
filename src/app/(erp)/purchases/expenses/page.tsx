import type { Metadata } from "next";
import { PurchaseExpenses } from "@/features/purchase-operations/purchase-expenses";

export const metadata: Metadata = {
  title: "Purchase Expenses",
};

export default function PurchaseExpensesPage() {
  return <PurchaseExpenses />;
}
