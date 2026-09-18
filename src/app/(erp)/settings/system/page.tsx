import type { Metadata } from "next";

import { SystemPreferences } from "@/features/system-preferences/system-preferences";

export const metadata: Metadata = {
  title: "System Preferences",
  description: "Configure Jewellery ERP company and system preferences.",
};

export default function SystemPreferencesPage() {
  return <SystemPreferences />;
}
