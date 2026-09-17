import type { Metadata } from "next";
import { GoldRateManager } from "@/features/gold-rate-manager/gold-rate-manager";

export const metadata: Metadata = {
  title: "Gold Rate Management",
  description: "Update and manage daily jewellery gold rates.",
};

export default function GoldRateManagerPage() {
  return <GoldRateManager />;
}
