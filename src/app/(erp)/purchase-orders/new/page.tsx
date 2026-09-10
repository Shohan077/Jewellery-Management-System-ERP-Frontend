import type { Metadata } from "next";
import { CreatePurchaseOrder } from "@/features/purchase-orders/create-purchase-order";

export const metadata: Metadata = { title: "Create Purchase Order" };

export default function CreatePurchaseOrderPage() {
  return <CreatePurchaseOrder />;
}
