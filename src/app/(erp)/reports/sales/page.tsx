import type { Metadata } from "next";
import { Reference55SalesReport } from "@/features/reference-55/sales-report-screen";

export const metadata: Metadata = {
  title: "Sales Report | Jewellery Manager",
};

export default function SalesReportPage() {
  return <Reference55SalesReport />;
}
