import type { Metadata } from "next";
import { PurchaseReport } from "@/features/purchase-operations/purchase-report";

export const metadata: Metadata = {
  title: "Purchase Report",
};

export default function PurchaseReportPage() {
  return <PurchaseReport />;
}
