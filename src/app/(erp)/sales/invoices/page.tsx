import type { Metadata } from "next";
import { Reference56SalesInvoice } from "@/features/reference-56/screens";

export const metadata: Metadata = {
  title: "Sales Invoices",
};

export default function SalesInvoicesPage() {
  return <Reference56SalesInvoice />;
}
