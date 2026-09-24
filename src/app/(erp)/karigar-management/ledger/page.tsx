import type { Metadata } from "next";

import { KarigarLedger160 } from "@/features/reference-40-karigar/karigar-157-160";

export const metadata: Metadata = {
  title: "Karigar Ledger | Jewellery Manager",
  description: "Review karigar work, material, payment, and balance transactions.",
};

export default function KarigarLedgerPage() {
  return <KarigarLedger160 />;
}
