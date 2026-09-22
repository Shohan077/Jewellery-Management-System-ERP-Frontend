import type { Metadata } from "next";

import { SupplierPaymentEntry } from "@/features/supplier-finance/supplier-payment-entry";

export const metadata: Metadata = {
  title: "Supplier Payment Entry",
  description: "Record and allocate payments against supplier invoices.",
};

export default function SupplierPaymentEntryPage() {
  return <SupplierPaymentEntry />;
}
