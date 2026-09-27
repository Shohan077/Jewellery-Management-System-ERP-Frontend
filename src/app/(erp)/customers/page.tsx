import type { Metadata } from "next";
import { Reference53CustomerList } from "@/features/reference-53/customer-list-screen";

export const metadata: Metadata = {
  title: "Customer List | Jewellery Manager",
};

export default function CustomersPage() {
  return <Reference53CustomerList />;
}
