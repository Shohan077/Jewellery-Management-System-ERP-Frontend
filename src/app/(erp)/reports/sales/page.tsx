import type { Metadata } from "next";
import { Reference63SalesReport } from "@/features/reference-63/screens";

export const metadata: Metadata = {
  title: "Sales Report | Jewellery Manager",
};

export default function SalesReportPage() {
  return <Reference63SalesReport />;
}
