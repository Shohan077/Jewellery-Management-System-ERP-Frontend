import type { Metadata } from "next";

import { PurchaseReturnList } from "@/features/purchase-returns/purchase-return-list";

export const metadata: Metadata = { title: "Purchase Return" };

export default function PurchaseReturnPage() {
  return <PurchaseReturnList />;
}
