import type { Metadata } from "next";

import { ProductionReport } from "@/features/production-report/production-report";

export const metadata: Metadata = {
  title: "Production Report | Jewellery Manager",
  description: "Production performance, item output, and karigar completion analytics.",
};

export default function ProductionReportPage() {
  return <ProductionReport />;
}
