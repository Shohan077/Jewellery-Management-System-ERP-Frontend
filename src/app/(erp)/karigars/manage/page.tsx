import type { Metadata } from "next";

import { KarigarManagement } from "@/features/karigar-management/karigar-management";

export const metadata: Metadata = {
  title: "Karigar Management",
  description: "Manage jewellery craftsmen, skills, and work availability.",
};

export default function KarigarManagementPage() {
  return <KarigarManagement />;
}
