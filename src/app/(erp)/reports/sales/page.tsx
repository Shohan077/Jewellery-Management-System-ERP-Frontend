import type { Metadata } from "next";
import { SalesReport } from "@/features/reports/sales-report";

export const metadata: Metadata = {
  title: "Sales Report",
};

export default function SalesReportPage() {
  return <SalesReport />;
}
