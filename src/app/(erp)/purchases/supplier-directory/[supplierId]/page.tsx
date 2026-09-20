import type { Metadata } from "next";

import { SupplierDetails } from "@/features/purchase-suppliers/supplier-details";

export const metadata: Metadata = {
  title: "Supplier Details",
  description: "View supplier profile and purchase history.",
};

export default async function SupplierDirectoryDetailsPage({
  params,
}: {
  params: Promise<{ supplierId: string }>;
}) {
  const { supplierId } = await params;
  return <SupplierDetails supplierId={supplierId} />;
}
