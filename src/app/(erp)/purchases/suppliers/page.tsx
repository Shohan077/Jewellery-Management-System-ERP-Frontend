import type { Metadata } from "next";
import { Reference56SupplierList } from "@/features/reference-56/screens";

export const metadata: Metadata = {
  title: "Supplier Management",
  description: "Manage purchase suppliers, contacts, and account status.",
};

export default function PurchaseSupplierManagementPage() {
  return <Reference56SupplierList />;
}
