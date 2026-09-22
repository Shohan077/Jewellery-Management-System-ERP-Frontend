import type { Metadata } from "next";

import { TrialBalance } from "@/features/accounting-suite/trial-balance";

export const metadata: Metadata = { title: "Trial Balance", description: "Review and export the trial balance for all accounts." };

export default function TrialBalancePage() {
  return <TrialBalance />;
}

