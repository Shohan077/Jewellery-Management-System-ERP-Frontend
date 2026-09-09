import type { Metadata } from "next";
import { CustomerDetails } from "@/features/customers/customer-details";

export const metadata: Metadata = {
  title: "Customer Details",
};

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  return <CustomerDetails customerId={customerId} />;
}
