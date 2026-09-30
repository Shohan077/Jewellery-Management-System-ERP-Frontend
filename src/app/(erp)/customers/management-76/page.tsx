import type { Metadata } from "next";
import { Reference76CustomerManagement } from "@/features/reference-76/supplier-customer";

export const metadata: Metadata = { title: "Customer Management | Jewellery ERP" };

export default function CustomerManagement76Page() {
  return <Reference76CustomerManagement />;
}
