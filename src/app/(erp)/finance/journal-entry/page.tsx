import type { Metadata } from "next";

import { FinanceJournalEntry } from "@/features/finance-management/journal-entry";

export const metadata: Metadata = {
  title: "Journal Entry",
  description: "Create a balanced finance journal entry.",
};

export default function FinanceJournalEntryPage() {
  return <FinanceJournalEntry />;
}
