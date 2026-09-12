import type { Metadata } from "next";

import { BarcodeStudio } from "@/features/barcodes/barcode-studio";

export const metadata: Metadata = {
  title: "Barcode & Label Printing",
  description: "Generate, preview, and print product barcodes and jewellery labels.",
};

export default function BarcodesPage() {
  return <BarcodeStudio />;
}
