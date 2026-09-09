import type { Metadata } from "next";
import { InvoiceForm } from "@/features/sales/invoice-form";

export const metadata: Metadata = {
  title: "Create Sales Invoice",
};

export default function CreateSalesInvoicePage() {
  return <InvoiceForm />;
}
