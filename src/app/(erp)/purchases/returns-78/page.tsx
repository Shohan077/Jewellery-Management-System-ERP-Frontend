import type { Metadata } from "next";
import { Reference78PurchaseReturn } from "@/features/reference-78/purchase-return";

export const metadata: Metadata = { title: "Purchase Return | Jewellery Manager" };

export default function PurchaseReturn78Page() {
  return <Reference78PurchaseReturn />;
}
