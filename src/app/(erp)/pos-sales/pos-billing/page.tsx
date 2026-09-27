import type { Metadata } from "next";
import { Reference52PosBilling } from "@/features/reference-52/pos-billing-screen";

export const metadata: Metadata = { title: "POS Billing" };

export default function PosBillingPage() {
  return <Reference52PosBilling />;
}
