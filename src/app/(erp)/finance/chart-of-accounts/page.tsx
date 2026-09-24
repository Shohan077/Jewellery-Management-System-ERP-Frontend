import type { Metadata } from "next";

import { ChartOfAccounts } from "@/features/finance-management/chart-of-accounts";

export const metadata: Metadata = {
  title: "Chart of Accounts",
  description: "Browse and manage jewellery business accounts.",
};

export default function ChartOfAccountsPage() {
  return <ChartOfAccounts />;
}
