import type { Metadata } from "next";

import { SupplierLedger } from "@/features/supplier-finance/supplier-ledger";

export const metadata: Metadata = {
  title: "Supplier Ledger",
  description: "Review supplier purchases, payments, and outstanding balances.",
};

export default function SupplierLedgerPage() {
  return <SupplierLedger />;
}
