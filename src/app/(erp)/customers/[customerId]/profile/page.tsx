import type { Metadata } from "next";
import { CustomerDetails } from "@/features/customers/customer-details";

export const metadata: Metadata = { title: "Customer Profile" };

export default async function CustomerProfilePage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  return <CustomerDetails customerId={customerId} profileVariant />;
}
