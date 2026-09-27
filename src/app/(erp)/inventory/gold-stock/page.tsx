import type { Metadata } from "next";
import { Reference52GoldStock } from "@/features/reference-52/gold-stock-screen";

export const metadata: Metadata = { title: "Gold Stock" };

export default function GoldStockPage() {
  return <Reference52GoldStock />;
}
