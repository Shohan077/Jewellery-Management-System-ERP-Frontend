import type { Metadata } from "next";

import { ReportsDashboard } from "@/features/reports-dashboard/reports-dashboard";

export const metadata: Metadata = {
  title: "Reports & Analytics",
  description: "Jewellery ERP business reports and analytics dashboard.",
};

export default function ReportsDashboardPage() {
  return <ReportsDashboard />;
}
