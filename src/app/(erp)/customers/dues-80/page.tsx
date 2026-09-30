import type { Metadata } from "next";
import { Reference80CustomerDueList } from "@/features/reference-80/customer-dues";

export const metadata: Metadata = { title: "Customer Due List | Jewellery Manager" };

export default function CustomerDueList80Page() {
  return <Reference80CustomerDueList />;
}
