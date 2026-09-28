import type { Metadata } from "next";
import { Reference67CashAccounting } from "@/features/reference-67/screens";

export const metadata: Metadata = {
  title: "Cash & Accounting | Jewellery ERP",
  description: "Monitor cash flow, balances, expenses, and recent accounting activity.",
};

export default function AccountsDashboardPage() {
  return <Reference67CashAccounting />;
}
