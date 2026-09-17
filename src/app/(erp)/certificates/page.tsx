import type { Metadata } from "next";

import { CertificateManagement } from "@/features/certificates/certificate-management";

export const metadata: Metadata = {
  title: "Certificate Management",
  description: "Manage jewellery product certificates and hallmark information.",
};

export default function CertificatesPage() {
  return <CertificateManagement />;
}
