import type { Metadata } from "next";
import { GoldRateManagement } from "@/features/gold-rates/gold-rate-management";

export const metadata: Metadata = {
  title: "Gold Rate Management",
};

export default function GoldRateManagementPage() {
  return <GoldRateManagement />;
}
