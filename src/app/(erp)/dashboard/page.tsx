import type { Metadata } from "next";
import { Reference52Dashboard } from "@/features/reference-52/dashboard-screen";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of sales, purchases, stock, and recent activity.",
};

export default function DashboardPage() {
  return <Reference52Dashboard />;
}
