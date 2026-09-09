import type { Metadata } from "next";
import { Suspense } from "react";
import { InvoiceList } from "@/features/sales/invoice-list";

export const metadata: Metadata = {
  title: "Sales Invoices",
};

export default function SalesInvoicesPage() {
  return (
    <Suspense fallback={<div className="surface-card" style={{ minHeight: 420 }} />}>
      <InvoiceList />
    </Suspense>
  );
}
