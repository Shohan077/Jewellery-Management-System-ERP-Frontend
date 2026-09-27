import type { Metadata } from "next";
import { Reference54AccountsDashboard } from "@/features/reference-54/accounts-dashboard-screen";

export const metadata: Metadata = {
  title: "Accounts Dashboard | Jewellery ERP",
  description: "Monitor cash flow, balances, expenses, and recent accounting activity.",
};

export default function AccountsDashboardPage() {
  return <Reference54AccountsDashboard />;
}
