import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
export const metadata: Metadata = { title: "Mortgage Register" };
export default function MortgagesPage() {
  return <div style={{ display: "grid", gap: 18, maxWidth: 1480, margin: "0 auto" }}><PageHeader action={<Link className="button button--primary" href="/mortgages/new"><Plus size={16} />New Mortgage</Link>} description="Review pawn and mortgage entries" title="Mortgage Register" /><Card style={{ minHeight: 260, display: "grid", placeContent: "center", justifyItems: "center", padding: 28, textAlign: "center" }}><strong>Mortgage entries are saved locally from the New Mortgage form.</strong><p style={{ color: "var(--slate-500)", fontSize: 12 }}>Create an entry to start your register.</p></Card></div>;
}
