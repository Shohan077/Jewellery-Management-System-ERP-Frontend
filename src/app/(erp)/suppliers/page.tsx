import type { Metadata } from "next";

import { SupplierManagement153 } from "@/features/reference-39-management/management-lists";

export const metadata: Metadata = {
  title: "Supplier Management | Jewellery Manager",
  description: "View and manage jewellery suppliers.",
};

export default function SuppliersPage() {
  return <SupplierManagement153 />;
}
