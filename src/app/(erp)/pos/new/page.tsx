import type { Metadata } from "next";
import { Reference65PosSales } from "@/features/reference-65/screens";

export const metadata: Metadata = {
  title: "POS & Sales",
};

export default function PosNewSalePage() {
  return <Reference65PosSales />;
}
