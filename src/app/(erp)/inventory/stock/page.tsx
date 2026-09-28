import type { Metadata } from "next";
import { Reference60StockOverview } from "@/features/reference-60/screens";

export const metadata: Metadata = {
  title: "Stock Overview",
  description: "View jewellery inventory values, stock levels, and low-stock alerts.",
};

export default function InventoryStockPage() {
  return <Reference60StockOverview />;
}
