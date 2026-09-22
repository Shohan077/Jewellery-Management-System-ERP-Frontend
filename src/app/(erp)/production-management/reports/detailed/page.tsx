import type { Metadata } from "next";

import { DetailedProductionReport } from "@/features/production-report/detailed-production-report";

export const metadata: Metadata = {
  title: "Detailed Production Report | Jewellery Manager",
  description: "Filter, review, print, and export production orders and performance details.",
};

export default function DetailedProductionReportPage() {
  return <DetailedProductionReport />;
}
