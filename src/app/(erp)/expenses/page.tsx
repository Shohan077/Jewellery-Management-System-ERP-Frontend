import type { Metadata } from "next";
import { ExpenseManagement } from "@/features/expenses/expense-management";
export const metadata: Metadata = { title: "Expense Management" };
export default function ExpenseManagementPage() { return <ExpenseManagement />; }
