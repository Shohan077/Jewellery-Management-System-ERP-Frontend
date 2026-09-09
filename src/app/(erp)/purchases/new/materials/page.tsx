import type { Metadata } from "next";
import { CreatePurchaseInvoice } from "@/features/purchases/create-purchase-invoice";

export const metadata: Metadata = {
  title: "Create Material Purchase",
};

export default function CreateMaterialPurchasePage() {
  return <CreatePurchaseInvoice variant="materials" />;
}
