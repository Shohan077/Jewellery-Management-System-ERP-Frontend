import type { Metadata } from "next";

import { SalesReportScreen } from "@/features/reference-28/sales-report-screen";

export const metadata: Metadata = {
  title: "Sales Report",
  description: "Sales performance, category breakdown and recent transactions.",
};

export default function SalesReportPage() {
  return <SalesReportScreen />;
}
