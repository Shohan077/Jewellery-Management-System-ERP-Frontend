import type { Metadata } from "next";
import { Reference62PurchaseManagement } from "@/features/reference-62/screens";

export const metadata: Metadata = { title: "Purchase Management Legacy" };

export default function PurchaseManagementLegacyPage() {
  return <Reference62PurchaseManagement />;
}
