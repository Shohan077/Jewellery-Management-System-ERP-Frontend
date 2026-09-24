import type { Metadata } from "next";
import { TaxCurrencySettings } from "@/features/reference-30/tax-currency-settings";

export const metadata: Metadata = { title: "Tax & Currency Settings | Jewellery Manager" };
export default function TaxCurrencyPage() { return <TaxCurrencySettings />; }
