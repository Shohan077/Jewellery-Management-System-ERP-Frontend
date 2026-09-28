import type { Metadata } from "next";
import { Reference54AccountsDashboard } from "@/features/reference-54/accounts-dashboard-screen";

export const metadata: Metadata = { title: "Accounts Dashboard Legacy" };

export default function AccountsLegacyPage() {
  return <Reference54AccountsDashboard />;
}
