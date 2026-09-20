import type { Metadata } from "next";

import { PurchaseOrderList } from "@/features/purchase-documents/orders/purchase-order-list";

export const metadata: Metadata = { title: "Purchase Order List" };

export default function PurchaseOrderListPage() {
  return <PurchaseOrderList />;
}
