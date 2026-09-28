import type { Metadata } from "next";
import { Reference61PosBilling } from "@/features/reference-61/screens";

export const metadata: Metadata = { title: "POS Billing Legacy" };

export default function PosLegacyPage() {
  return <Reference61PosBilling />;
}
