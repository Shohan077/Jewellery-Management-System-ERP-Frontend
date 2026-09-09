import type { Metadata } from "next";

import { SupplierList } from "@/features/suppliers/supplier-list";

export const metadata: Metadata = {
  title: "Suppliers",
  description: "View and manage jewellery suppliers.",
};

export default function SuppliersPage() {
  return <SupplierList />;
}
