import type { Metadata } from "next";

import { Reference60SalesReport } from "@/features/reference-60/screens";

export const metadata: Metadata = {
  title: "Sales Report",
  description: "Sales performance, category breakdown and recent transactions.",
};

export default function SalesReportPage() {
  return <Reference60SalesReport />;
}
