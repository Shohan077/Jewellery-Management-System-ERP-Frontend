import type { Metadata } from "next";
import { InventoryStockView } from "@/features/inventory-stock-view/inventory-stock-view";

export const metadata: Metadata = {
  title: "Inventory Stock View",
  description: "View and manage current jewellery inventory stock.",
};

export default function InventoryStockViewPage() {
  return <InventoryStockView />;
}
