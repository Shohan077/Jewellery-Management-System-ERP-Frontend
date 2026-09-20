import type { Metadata } from "next";

import { SupplierListPage } from "@/features/purchase-suppliers/supplier-list";

export const metadata: Metadata = {
  title: "Supplier List",
  description: "View and manage purchase suppliers.",
};

export default function SupplierDirectoryPage() {
  return <SupplierListPage variant="directory" />;
}
