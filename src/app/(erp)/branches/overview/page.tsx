import type { Metadata } from "next";

import { BranchOverview } from "@/features/branch-overview/branch-overview";

export const metadata: Metadata = {
  title: "Branch Management Overview",
  description: "Manage jewellery branches, stock distribution, and transfers.",
};

export default function BranchOverviewPage() {
  return <BranchOverview />;
}
