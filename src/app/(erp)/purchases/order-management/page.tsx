import type { Metadata } from "next";
import { PurchaseOrderManagement } from "@/features/purchase-operations/purchase-order-management";

export const metadata: Metadata = {
  title: "Purchase Order Management",
};

export default function PurchaseOrderManagementPage() {
  return <PurchaseOrderManagement />;
}
