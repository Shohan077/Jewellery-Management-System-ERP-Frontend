import type { Metadata } from "next";
import { DesignManagement } from "@/features/reference-32-catalog/design-management";

export const metadata: Metadata = { title: "Design Management | Jewellery ERP" };

export default function DesignManagementPage() {
  return <DesignManagement />;
}
