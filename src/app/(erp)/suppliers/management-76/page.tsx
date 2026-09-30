import type { Metadata } from "next";
import { Reference76SupplierManagement } from "@/features/reference-76/supplier-customer";

export const metadata: Metadata = { title: "Supplier Management | Jewellery ERP" };

export default function SupplierManagement76Page() {
  return <Reference76SupplierManagement />;
}
