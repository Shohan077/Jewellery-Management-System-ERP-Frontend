import type { Metadata } from "next";
import { StockTransferForm } from "@/features/stock-transfers/stock-transfer-form";

export const metadata: Metadata = { title: "Stock Transfer" };

export default function NewStockTransferPage() {
  return <StockTransferForm />;
}
