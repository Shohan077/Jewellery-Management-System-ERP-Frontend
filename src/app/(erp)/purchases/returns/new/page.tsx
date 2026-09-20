import type { Metadata } from "next";

import { PurchaseReturnCreate } from "@/features/purchase-returns/purchase-return-create";

export const metadata: Metadata = { title: "Create Purchase Return" };

export default function CreatePurchaseReturnPage() {
  return <PurchaseReturnCreate />;
}
