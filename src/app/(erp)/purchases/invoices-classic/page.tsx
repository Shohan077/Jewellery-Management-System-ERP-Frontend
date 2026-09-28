import type { Metadata } from "next";
import { PurchaseInvoiceList } from "@/features/purchases/purchase-invoice-list";
export const metadata: Metadata = { title: "Classic Purchase Invoices" };
export default function Page() { return <PurchaseInvoiceList />; }
