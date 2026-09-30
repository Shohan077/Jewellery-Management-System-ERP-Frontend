import type { Metadata } from "next";
import { Reference78SupplierList } from "@/features/reference-78/supplier-list";

export const metadata: Metadata = { title: "Supplier List | Jewellery Manager" };

export default function SupplierList78Page() {
  return <Reference78SupplierList />;
}
