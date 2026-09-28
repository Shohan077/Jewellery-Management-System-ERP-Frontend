import type { Metadata } from "next";
import { Reference61SalesReport } from "@/features/reference-61/screens";

export const metadata: Metadata = { title: "Sales Report" };

export default function SalesReportPage() {
  return <Reference61SalesReport />;
}
