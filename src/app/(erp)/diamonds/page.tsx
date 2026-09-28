import type { Metadata } from "next";

import { Reference63DiamondList } from "@/features/reference-63/screens";

export const metadata: Metadata = {
  title: "Diamond List",
  description: "View and manage the jewellery ERP diamond inventory.",
};

export default function DiamondsPage() {
  return <Reference63DiamondList />;
}
