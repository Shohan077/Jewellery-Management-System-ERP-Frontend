import type { Metadata } from "next";
import { Reference65InventoryManagement } from "@/features/reference-65/screens";

export const metadata: Metadata = { title: "Inventory Management" };

export default function InventoryManagement65Page() {
  return <Reference65InventoryManagement />;
}
