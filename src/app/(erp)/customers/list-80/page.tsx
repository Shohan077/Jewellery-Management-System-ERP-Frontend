import type { Metadata } from "next";
import { Reference80CustomerList } from "@/features/reference-80/customers";

export const metadata: Metadata = { title: "Customer List | Jewellery Manager" };

export default function CustomerList80Page() {
  return <Reference80CustomerList />;
}
