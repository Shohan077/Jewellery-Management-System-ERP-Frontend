import type { Metadata } from "next";

import { SalesReturnForm } from "@/features/sales-returns/sales-return-form";

export const metadata: Metadata = {
  title: "Sales Return",
  description: "Create and process a jewellery sales return.",
};

export default function NewSalesReturnPage() {
  return <SalesReturnForm />;
}
