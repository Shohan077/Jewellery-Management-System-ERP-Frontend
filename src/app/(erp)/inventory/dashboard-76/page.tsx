import type { Metadata } from "next";
import { Reference76InventoryDashboard } from "@/features/reference-76/inventory-purchase";

export const metadata: Metadata = { title: "Inventory Dashboard | Jewellery ERP" };

export default function InventoryDashboard76Page() {
  return <Reference76InventoryDashboard />;
}
