import type { Metadata } from "next";
import { Reference53CustomerList } from "@/features/reference-53/customer-list-screen";

export const metadata: Metadata = { title: "Customer List" };

export default function CustomerListPage() {
  return <Reference53CustomerList />;
}
