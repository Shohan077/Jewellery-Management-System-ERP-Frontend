import type { Metadata } from "next";

import { PurchaseOrderForm } from "@/features/purchase-documents/orders/purchase-order-form";

export const metadata: Metadata = { title: "Purchase Order" };

export default function PurchaseOrderPage() {
  return <PurchaseOrderForm />;
}
