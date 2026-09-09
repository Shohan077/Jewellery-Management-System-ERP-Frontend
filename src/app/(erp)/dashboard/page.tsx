import type { Metadata } from "next";
import { DashboardOverview } from "@/features/dashboard/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of sales, purchases, stock, and recent activity.",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
