import type { Metadata } from "next";
import { Reference76PurchaseOrders } from "@/features/reference-76/inventory-purchase";

export const metadata: Metadata = { title: "Purchase Orders | Jewellery ERP" };

export default function PurchaseOrders76Page() {
  return <Reference76PurchaseOrders />;
}
