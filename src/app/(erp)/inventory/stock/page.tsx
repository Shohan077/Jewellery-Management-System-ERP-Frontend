import type { Metadata } from "next";
import { InventoryStock } from "@/features/inventory/inventory-stock";

export const metadata: Metadata = {
  title: "Inventory Stock",
  description: "View and manage jewellery inventory stock.",
};

export default function InventoryStockPage() {
  return <InventoryStock />;
}
