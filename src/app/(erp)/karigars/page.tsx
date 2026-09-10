import type { Metadata } from "next";

import { KarigarList } from "@/features/karigars/karigar-list";

export const metadata: Metadata = {
  title: "Karigar Management",
  description: "Manage jewellery craftsmen, skills, and employment status.",
};

export default function KarigarsPage() {
  return <KarigarList />;
}
