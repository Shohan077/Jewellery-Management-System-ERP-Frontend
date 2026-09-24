import type { Metadata } from "next";

import { KarigarManagement157 } from "@/features/reference-40-karigar/karigar-157-160";

export const metadata: Metadata = {
  title: "Karigar Management",
  description: "Manage jewellery craftsmen, skills, and work availability.",
};

export default function KarigarManagementPage() {
  return <KarigarManagement157 />;
}
