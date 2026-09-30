import type { Metadata } from "next";
import { Reference78PurchaseReport } from "@/features/reference-78/purchase-report";

export const metadata: Metadata = { title: "Purchase Report | Jewellery Manager" };

export default function PurchaseReport78Page() {
  return <Reference78PurchaseReport />;
}
