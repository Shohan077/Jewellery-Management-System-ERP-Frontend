import type { Metadata } from "next";

import { Reference54KarigarManagement } from "@/features/reference-54/karigar-management-screen";

export const metadata: Metadata = {
  title: "Karigar Management",
  description: "Manage jewellery craftsmen, skills, and employment status.",
};

export default function KarigarsPage() {
  return <Reference54KarigarManagement />;
}
