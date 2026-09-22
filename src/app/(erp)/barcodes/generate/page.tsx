import type { Metadata } from "next";

import { BarcodeGeneration } from "@/features/barcode-invoice/barcode-generation";

export const metadata: Metadata = {
  title: "Barcode Generation",
  description: "Generate and print product barcodes.",
};

export default function BarcodeGenerationPage() {
  return <BarcodeGeneration />;
}

