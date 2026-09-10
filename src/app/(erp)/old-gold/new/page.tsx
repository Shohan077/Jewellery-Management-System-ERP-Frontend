import type { Metadata } from "next";
import { OldGoldPurchaseForm } from "@/features/old-gold/old-gold-purchase-form";

export const metadata: Metadata = {
  title: "Old Gold Purchase",
};

export default function NewOldGoldPurchasePage() {
  return <OldGoldPurchaseForm />;
}
