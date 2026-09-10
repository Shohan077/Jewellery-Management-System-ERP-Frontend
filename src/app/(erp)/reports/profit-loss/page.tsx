import type { Metadata } from "next";
import { ProfitLossReport } from "@/features/reports/profit-loss-report";
export const metadata: Metadata = { title: "Profit & Loss Report" };
export default function ProfitLossReportPage() { return <ProfitLossReport />; }
