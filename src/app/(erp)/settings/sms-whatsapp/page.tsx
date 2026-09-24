import type { Metadata } from "next";

import { SmsWhatsappConfiguration } from "@/features/reference-31-communications/sms-whatsapp-configuration";

export const metadata: Metadata = { title: "SMS/WhatsApp Configuration | Jewellery Manager" };

export default function SmsWhatsappConfigurationPage() {
  return <SmsWhatsappConfiguration />;
}
