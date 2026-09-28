import type { Metadata } from "next";
import { Reference55SalesReport } from "@/features/reference-55/sales-report-screen";

export const metadata: Metadata = { title: "Legacy Sales Report" };
export default function LegacySalesReportPage() { return <Reference55SalesReport />; }
