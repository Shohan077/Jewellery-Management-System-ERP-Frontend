import type { Metadata } from "next";

import { BranchSalesDashboard } from "@/features/branch-sales-dashboard/branch-sales-dashboard";

export const metadata: Metadata = {
  title: "Multi-Branch Sales Dashboard",
  description: "Compare sales performance across every jewellery branch.",
};

export default function BranchSalesDashboardPage() {
  return <BranchSalesDashboard />;
}
