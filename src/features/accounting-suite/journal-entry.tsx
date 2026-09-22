"use client";

import { Plus, Save, Send, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";

import { costCenters, initialJournalLines, JOURNAL_STORAGE_KEY, journalAccounts, type JournalLine } from "./accounting-data";
import styles from "./accounting-suite.module.css";

export function JournalEntry() {
  const [voucher, setVoucher] = useState("JE-2025-0045");
  const [date, setDate] = useState("2025-04-16");
  const [reference, setReference] = useState("Ref. BRS/16/04/25");
  const [notes, setNotes] = useState("Journal entry for adjustment of rent prepaid and office supplies.");
  const [lines, setLines] = useState<JournalLine[]>(initialJournalLines);
  const [status, setStatus] = useState<"Draft" | "Posted">("Draft");
  const [message, setMessage] = useState("");
  const totals = useMemo(() => ({ debit: lines.reduce((sum, line) => sum + line.debit, 0), credit: lines.reduce((sum, line) => sum + line.credit, 0) }), [lines]);

  function updateLine<Key extends keyof JournalLine>(id: string, key: Key, value: JournalLine[Key]) {
    setLines((current) => current.map((line) => line.id === id ? { ...line, [key]: value } : line));
    setMessage("");
  }

  function addLine() {
    setLines((current) => [...current, { id: `line-${crypto.randomUUID()}`, account: journalAccounts[0], description: "", debit: 0, credit: 0, costCenter: costCenters[0] }]);
  }

  function save(nextStatus: "Draft" | "Posted") {
    if (!voucher.trim() || !date || lines.length < 2) {
      setMessage("Enter a voucher number, date, and at least two journal lines.");
      return;
    }
    if (nextStatus === "Posted" && (totals.debit <= 0 || totals.debit !== totals.credit)) {
      setMessage("A journal must have equal, non-zero debit and credit totals before posting.");
      return;
    }
    window.localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify({ voucher, date, reference, notes, lines, status: nextStatus, savedAt: new Date().toISOString() }));
    setStatus(nextStatus);
    setMessage(nextStatus === "Posted" ? `${voucher} posted successfully.` : `${voucher} saved as draft.`);
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>Journal Entry</h1><p>Create and record journal entries.</p></header>
      <section className={styles.journalLayout}>
        <div className={styles.journalMain}>
          <Card className={styles.journalCard}>
            <div className={styles.journalMeta}><label><span>Voucher No <b>*</b></span><input className="field" onChange={(event) => setVoucher(event.target.value)} value={voucher} /></label><label><span>Entry Date <b>*</b></span><input className="field" onChange={(event) => setDate(event.target.value)} type="date" value={date} /></label><label><span>Reference</span><input className="field" onChange={(event) => setReference(event.target.value)} value={reference} /></label><label className={styles.fullSpan}><span>Notes</span><textarea className="textarea" onChange={(event) => setNotes(event.target.value)} value={notes} /></label></div>
            <h2>Journal Lines</h2>
            <div className={styles.tableScroller}><table className={`${styles.table} ${styles.journalTable}`}><caption className="sr-only">Journal debit and credit lines</caption><thead><tr><th>#</th><th>Account <b>*</b></th><th>Description</th><th>Debit (₹)</th><th>Credit (₹)</th><th>Cost Center</th><th>Action</th></tr></thead><tbody>{lines.map((line, index) => <tr key={line.id}><td>{index + 1}</td><td><select className="select" onChange={(event) => updateLine(line.id, "account", event.target.value)} value={line.account}>{journalAccounts.map((account) => <option key={account}>{account}</option>)}</select></td><td><input className="field" onChange={(event) => updateLine(line.id, "description", event.target.value)} value={line.description} /></td><td><input className="field" min="0" onChange={(event) => updateLine(line.id, "debit", Number(event.target.value))} step="0.01" type="number" value={line.debit || ""} /></td><td><input className="field" min="0" onChange={(event) => updateLine(line.id, "credit", Number(event.target.value))} step="0.01" type="number" value={line.credit || ""} /></td><td><select className="select" onChange={(event) => updateLine(line.id, "costCenter", event.target.value)} value={line.costCenter}>{costCenters.map((center) => <option key={center}>{center}</option>)}</select></td><td><button aria-label={`Delete journal line ${index + 1}`} disabled={lines.length <= 2} onClick={() => setLines((current) => current.filter((item) => item.id !== line.id))} type="button"><Trash2 size={14} /></button></td></tr>)}</tbody></table></div>
            <button className={styles.addRow} onClick={addLine} type="button"><Plus size={14} />Add Row</button>
            <footer className={styles.journalTotals}><span>Total Debit (₹) <strong>{totals.debit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></span><span>Total Credit (₹) <strong>{totals.credit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></span></footer>
          </Card>
          <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>
          <div className={styles.journalActions}><button className={styles.outlineButton} onClick={() => save("Draft")} type="button"><Save size={16} />Save Draft</button><button className={styles.primaryButton} onClick={() => save("Posted")} type="button"><Send size={16} />Post Entry</button></div>
        </div>
        <Card className={styles.statusCard}><h2>Entry Status</h2><dl><div><dt>{status} Status</dt><dd><span>{status}</span></dd></div><div><dt>Prepared By</dt><dd>Admin / Owner</dd></div><div><dt>Prepared On</dt><dd>16 Apr 2025<br />11:30 AM</dd></div><div><dt>Approval Required</dt><dd><span className={styles.approved}>Yes</span></dd></div><div><dt>Approved By</dt><dd>-</dd></div><div><dt>Approved On</dt><dd>-</dd></div></dl></Card>
      </section>
    </div>
  );
}

