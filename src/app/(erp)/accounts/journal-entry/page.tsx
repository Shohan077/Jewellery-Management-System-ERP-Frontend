import type { Metadata } from "next";
import { Reference57JournalEntries } from "@/features/reference-57/screens";

export const metadata: Metadata = { title: "Journal Entry", description: "Create balanced accounting journal entries." };

export default function JournalEntryPage() {
  return <Reference57JournalEntries />;
}

