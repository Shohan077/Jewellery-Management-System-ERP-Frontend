import type { Metadata } from "next";

import { InvoiceSettings } from "@/features/barcode-invoice/invoice-settings";

export const metadata: Metadata = {
  title: "Invoice Settings",
  description: "Configure invoice branding, numbering, and content.",
};

export default function InvoiceSettingsPage() {
  return <InvoiceSettings />;
}

