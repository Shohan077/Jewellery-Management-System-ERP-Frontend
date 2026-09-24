import type { Metadata } from "next";

import { EmailConfiguration } from "@/features/reference-31-communications/email-configuration";

export const metadata: Metadata = { title: "Email Configuration | Jewellery Manager" };

export default function EmailConfigurationPage() {
  return <EmailConfiguration />;
}
