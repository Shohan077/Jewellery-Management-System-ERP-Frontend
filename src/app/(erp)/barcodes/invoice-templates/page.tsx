import type { Metadata } from "next";

import { InvoiceTemplates } from "@/features/barcode-invoice/invoice-templates";

export const metadata: Metadata = {
  title: "Invoice Templates",
  description: "Choose and save a jewellery invoice template.",
};

export default function InvoiceTemplatesPage() {
  return <InvoiceTemplates />;
}

