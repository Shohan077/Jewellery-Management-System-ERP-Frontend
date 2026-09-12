import type { Metadata } from "next";
import { PosNewSale } from "@/features/pos/pos-new-sale";

export const metadata: Metadata = {
  title: "POS - New Sale",
};

export default function PosNewSalePage() {
  return <PosNewSale />;
}
