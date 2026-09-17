import type { Metadata } from "next";
import { PaymentManagement } from "@/features/payments/payment-management";

export const metadata: Metadata = {
  title: "Payment Management",
};

export default function PaymentManagementPage() {
  return <PaymentManagement />;
}
