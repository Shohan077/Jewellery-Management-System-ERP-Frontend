import type { Metadata } from "next";
import { CreateQuotation } from "@/features/quotations/create-quotation";

export const metadata: Metadata = {
  title: "Create Quotation",
};

export default function CreateQuotationPage() {
  return <CreateQuotation />;
}
