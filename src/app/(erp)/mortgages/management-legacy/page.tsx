import type { Metadata } from "next";
import { Reference62MortgageManagement } from "@/features/reference-62/screens";

export const metadata: Metadata = { title: "Mortgage / Pawn Management Legacy" };

export default function MortgageManagementLegacyPage() {
  return <Reference62MortgageManagement />;
}
