import type { Metadata } from "next";

import { BarcodePrinting } from "@/features/barcode-invoice/barcode-printing";

export const metadata: Metadata = {
  title: "Barcode Printing",
  description: "Prepare and print jewellery barcode labels.",
};

export default function BarcodePrintingPage() {
  return <BarcodePrinting />;
}

