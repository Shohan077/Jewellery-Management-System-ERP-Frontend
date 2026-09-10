import type { Metadata } from "next";

import { DiamondList } from "@/features/diamonds/diamond-list";

export const metadata: Metadata = {
  title: "Diamond Management",
  description: "View and manage the jewellery ERP diamond inventory.",
};

export default function DiamondsPage() {
  return <DiamondList />;
}
