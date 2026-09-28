import type { Metadata } from "next";
import { Reference66PurchaseManagement } from "@/features/reference-66/screens";

export const metadata: Metadata = {
  title: "Purchase Management",
};

export default function PurchaseInvoicesPage() {
  return <Reference66PurchaseManagement />;
}
