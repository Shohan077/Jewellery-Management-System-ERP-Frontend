import type { Metadata } from "next";
import { Reference60PosBilling } from "@/features/reference-60/screens";

export const metadata: Metadata = { title: "POS Billing" };

export default function PosBillingPage() {
  return <Reference60PosBilling />;
}
