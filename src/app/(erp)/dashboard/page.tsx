import type { Metadata } from "next";
import { Reference65Dashboard } from "@/features/reference-65/screens";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of sales, purchases, stock, and recent activity.",
};

export default function DashboardPage() {
  return <Reference65Dashboard />;
}
