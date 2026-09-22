import type { Metadata } from "next";

import { SupplierStatement } from "@/features/supplier-statement/supplier-statement";

export const metadata: Metadata = {
  title: "Supplier Statement",
  description: "Review supplier purchases, payments, and running balances.",
};

export default function SupplierStatementPage() {
  return <SupplierStatement />;
}
