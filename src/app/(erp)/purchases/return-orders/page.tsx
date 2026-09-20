import type { Metadata } from "next";

import { ReturnOrderList } from "@/features/purchase-documents/returns/return-order-list";

export const metadata: Metadata = { title: "Purchase Return List" };

export default function ReturnOrderListPage() {
  return <ReturnOrderList />;
}
