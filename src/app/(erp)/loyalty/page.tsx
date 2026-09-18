import type { Metadata } from "next";

import { LoyaltyProgram } from "@/features/loyalty/loyalty-program";

export const metadata: Metadata = {
  title: "Loyalty Program",
  description: "Manage customer loyalty points, membership tiers, rewards and campaigns.",
};

export default function LoyaltyPage() {
  return <LoyaltyProgram />;
}
