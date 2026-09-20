import type { Metadata } from "next";

import { SupplierListPage } from "@/features/purchase-suppliers/supplier-list";

export const metadata: Metadata = {
  title: "Supplier Management",
  description: "Manage purchase suppliers, contacts, and account status.",
};

export default function PurchaseSupplierManagementPage() {
  return <SupplierListPage variant="management" />;
}
