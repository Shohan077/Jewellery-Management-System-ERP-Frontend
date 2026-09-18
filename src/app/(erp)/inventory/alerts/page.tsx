import type { Metadata } from "next";

import { StockAlerts } from "@/features/stock-alerts/stock-alerts";

export const metadata: Metadata = {
  title: "Stock Alerts | Jewellery ERP",
  description: "Monitor low-stock jewellery products and configure inventory alerts.",
};

export default function StockAlertsPage() {
  return <StockAlerts />;
}
