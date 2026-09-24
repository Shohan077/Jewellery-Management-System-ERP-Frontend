import type { Metadata } from "next";
import { CompanyProfile } from "@/features/reference-30/company-profile";

export const metadata: Metadata = { title: "Company Profile | Jewellery Manager" };
export default function CompanyProfilePage() { return <CompanyProfile />; }
