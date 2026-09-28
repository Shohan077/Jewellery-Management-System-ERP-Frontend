import type { Metadata } from "next";
import { Reference61Dashboard } from "@/features/reference-61/screens";

export const metadata: Metadata = { title: "Dashboard Legacy" };

export default function DashboardLegacyPage() {
  return <Reference61Dashboard />;
}
