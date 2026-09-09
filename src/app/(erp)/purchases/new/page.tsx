import type { Metadata } from "next";
import { CreatePurchaseInvoice } from "@/features/purchases/create-purchase-invoice";

export const metadata: Metadata = {
  title: "Create Purchase Invoice",
};

export default function CreatePurchaseInvoicePage() {
  return <CreatePurchaseInvoice />;
}
