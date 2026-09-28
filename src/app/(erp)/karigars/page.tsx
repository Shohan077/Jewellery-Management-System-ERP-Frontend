import type { Metadata } from "next";
import { Reference63KarigarList } from "@/features/reference-63/screens";

export const metadata: Metadata = {
  title: "Karigar Management",
  description: "Manage jewellery craftsmen, skills, and employment status.",
};

export default function KarigarsPage() {
  return <Reference63KarigarList />;
}
