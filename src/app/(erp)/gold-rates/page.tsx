import type { Metadata } from "next";
import { Reference53GoldRates } from "@/features/reference-53/gold-rates-screen";

export const metadata: Metadata = {
  title: "Gold Rates",
};

export default function GoldRatesPage() {
  return <Reference53GoldRates />;
}
