import type { Metadata } from "next";
import { InventoryManagement165 } from "@/features/reference-42-erp-modules/erp-modules";

export const metadata: Metadata = { title: "Inventory Management Legacy" };

export default function InventoryManagementLegacyPage() {
  return <InventoryManagement165 />;
}
