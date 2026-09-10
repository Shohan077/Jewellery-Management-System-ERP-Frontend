import type { Metadata } from "next";
import { Suspense } from "react";
import { PurchaseOrderList } from "@/features/purchase-orders/purchase-order-list";

export const metadata: Metadata = { title: "Purchase Order List" };

export default function PurchaseOrderListPage() {
  return <Suspense fallback={null}><PurchaseOrderList /></Suspense>;
}
