import type { Metadata } from "next";

import { JournalEntry } from "@/features/accounting-suite/journal-entry";

export const metadata: Metadata = { title: "Journal Entry", description: "Create balanced accounting journal entries." };

export default function JournalEntryPage() {
  return <JournalEntry />;
}

