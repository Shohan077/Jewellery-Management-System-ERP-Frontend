import type { Metadata } from "next";
import { Reference58CustomerManagement } from "@/features/reference-58/screens";

export const metadata: Metadata = {
  title: "Customer Management | Jewellery Manager",
};

export default function CustomersPage() {
  return <Reference58CustomerManagement />;
}
