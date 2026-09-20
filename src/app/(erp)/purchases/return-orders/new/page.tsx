import type { Metadata } from "next";

import { ReturnOrderCreate } from "@/features/purchase-documents/returns/return-order-create";

export const metadata: Metadata = { title: "Create Purchase Return" };

export default function CreateReturnOrderPage() {
  return <ReturnOrderCreate />;
}
