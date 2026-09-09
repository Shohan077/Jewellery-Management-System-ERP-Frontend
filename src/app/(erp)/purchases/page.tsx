import type { Metadata } from "next";
import { PurchaseInvoiceList } from "@/features/purchases/purchase-invoice-list";

export const metadata: Metadata = {
  title: "Purchase Invoices",
};

export default function PurchaseInvoicesPage() {
  return <PurchaseInvoiceList />;
}
