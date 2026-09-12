import type { Metadata } from "next";
import { NewPurchaseForm } from "@/features/purchase-management/new-purchase-form";

export const metadata: Metadata = {
  title: "New Purchase | Jewellery ERP",
};

export default function NewPurchasePage() {
  return <NewPurchaseForm />;
}
