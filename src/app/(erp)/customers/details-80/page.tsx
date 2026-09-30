import type { Metadata } from "next";
import { Reference80CustomerDetails } from "@/features/reference-80/customers";

export const metadata: Metadata = { title: "Customer Details | Jewellery Manager" };

export default function CustomerDetails80Page() {
  return <Reference80CustomerDetails />;
}
