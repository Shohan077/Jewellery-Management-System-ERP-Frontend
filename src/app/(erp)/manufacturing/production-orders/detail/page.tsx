import type { Metadata } from "next";
import { Reference53ProductionOrderDetails } from "@/features/reference-53/production-order-details-screen";

export const metadata: Metadata = { title: "Production Order Details" };

export default function ProductionOrderDetailsPage() {
  return <Reference53ProductionOrderDetails />;
}
