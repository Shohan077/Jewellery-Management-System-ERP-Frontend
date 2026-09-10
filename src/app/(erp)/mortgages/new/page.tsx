import type { Metadata } from "next";
import { MortgageEntryForm } from "@/features/mortgages/mortgage-entry-form";
export const metadata: Metadata = { title: "New Mortgage Entry" };
export default function NewMortgagePage() { return <MortgageEntryForm />; }
