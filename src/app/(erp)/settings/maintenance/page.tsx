import type { Metadata } from "next";

import { SystemMaintenance } from "@/features/reference-31/system-maintenance";

export const metadata: Metadata = { title: "System Maintenance | Jewellery Manager" };

export default function SystemMaintenancePage() {
  return <SystemMaintenance />;
}
