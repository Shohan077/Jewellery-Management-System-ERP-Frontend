import type { Metadata } from "next";

import { KarigarPayment } from "@/features/karigar-finance/karigar-payment";

export const metadata: Metadata = {
  title: "Karigar Payment | Jewellery Manager",
  description: "Record a karigar payment and update the linked ledger.",
};

export default function NewKarigarPaymentPage() {
  return <KarigarPayment />;
}
