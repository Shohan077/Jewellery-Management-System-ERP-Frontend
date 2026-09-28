import type { Metadata } from "next";
import { Reference56SupplierList } from "@/features/reference-56/screens";

export const metadata: Metadata = {
  title: "Supplier Management | Jewellery Manager",
  description: "View and manage jewellery suppliers.",
};

export default function SuppliersPage() {
  return <Reference56SupplierList />;
}
