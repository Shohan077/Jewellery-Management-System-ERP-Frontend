import type { Metadata } from "next";
import { Reference80MortgageEntry } from "@/features/reference-80/mortgage-entry";

export const metadata: Metadata = { title: "Mortgage Entry | Jewellery Manager" };

export default function MortgageEntry80Page() {
  return <Reference80MortgageEntry />;
}
