import type { Metadata } from "next";

import { SupplierProfile } from "@/features/supplier-profile/supplier-profile";

export const metadata: Metadata = {
  title: "Supplier Details",
  description: "View and manage supplier information.",
};

export default async function SupplierDetailsPage({
  params,
}: {
  params: Promise<{ supplierId: string }>;
}) {
  const { supplierId } = await params;

  return <SupplierProfile supplierId={supplierId} />;
}
