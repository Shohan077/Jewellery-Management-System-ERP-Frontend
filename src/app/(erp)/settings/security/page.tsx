import type { Metadata } from "next";

import { SecuritySettings } from "@/features/reference-31/security-settings";

export const metadata: Metadata = { title: "Security Settings | Jewellery Manager" };

export default function SecuritySettingsPage() {
  return <SecuritySettings />;
}
