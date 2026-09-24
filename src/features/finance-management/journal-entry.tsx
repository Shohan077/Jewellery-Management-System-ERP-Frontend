"use client";

import {
  CloudUpload,
  FileDown,
  FileUp,
  Plus,
  RotateCcw,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  downloadFinanceFile,
  formatFinanceNumber,
  initialJournalRows,
  journalAccountOptions,
  type JournalRow,
} from "./finance-data";
import { FinanceFeedback, FinancePageHeader } from "./finance-ui";
import styles from "./finance-management.module.css";

const initialForm = {
  voucher: "JV-2025-0001",
  date: "2025-04-10",
  reference: "REF-12345",
  remarks: "Purchase of gold raw material",
  entryType: "General Journal",
  branch: "Main Branch",
};

export function FinanceJournalEntry() {
  const [form, setForm] = useState(initialForm);
  const [rows, setRows] = useState<JournalRow[]>(initialJournalRows);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"New" | "Draft" | "Posted">("New");
  const attachmentInput = useRef<HTMLInputElement>(null);
  const importInput = useRef<HTMLInputElement>(null);

  const totals = useMemo(() => ({
    debit: rows.reduce((sum, row) => sum + row.debit, 0),
    credit: rows.reduce((sum, row) => sum + row.credit, 0),
  }), [rows]);

  function updateForm<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function updateRow<Key extends keyof JournalRow>(id: string, key: Key, value: JournalRow[Key]) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [key]: value } : row));
    setMessage("");
  }

  function chooseAccount(id: string, code: string) {
    const account = journalAccountOptions.find((option) => option.code === code);
    setRows((current) => current.map((row) => row.id === id ? { ...row, accountCode: code, accountName: account?.name ?? "" } : row));
  }

  function addRow() {
    setRows((current) => [...current, { id: `journal-${crypto.randomUUID()}`, accountCode: "", accountName: "", description: "", debit: 0, credit: 0 }]);
    setMessage("A new journal row was added.");
  }

  function removeRow(id: string) {
    setRows((current) => current.filter((row) => row.id !== id));
    setMessage("Journal row removed.");
  }

  function resetEntry(nextVoucher = initialForm.voucher) {
    setForm({ ...initialForm, voucher: nextVoucher });
    setRows(initialJournalRows.map((row) => ({ ...row })));
    setAttachment(null);
    setStatus("New");
    setMessage("Journal entry reset.");
  }

  function newEntry() {
    const serial = String(Number(form.voucher.split("-").at(-1) ?? "1") + 1).padStart(4, "0");
    setForm({ ...initialForm, voucher: `JV-2025-${serial}`, reference: "", remarks: "" });
    setRows([{ id: `journal-${crypto.randomUUID()}`, accountCode: "", accountName: "", description: "", debit: 0, credit: 0 }]);
    setAttachment(null);
    setStatus("New");
    setMessage("A new journal entry is ready.");
  }

  function save(nextStatus: "Draft" | "Posted") {
    if (!form.voucher.trim() || !form.date || !rows.length || rows.some((row) => !row.accountCode)) {
      setMessage("Complete the voucher, date, and account fields before saving.");
      return;
    }
    if (nextStatus === "Posted" && (totals.debit <= 0 || totals.debit !== totals.credit)) {
      setMessage("Debit and credit totals must be equal and greater than zero before posting.");
      return;
    }
    window.localStorage.setItem("jewellery-erp:finance-journal", JSON.stringify({ ...form, rows, status: nextStatus, attachment: attachment?.name ?? null }));
    setStatus(nextStatus);
    setMessage(nextStatus === "Draft" ? `${form.voucher} saved as draft.` : `${form.voucher} posted successfully.`);
  }

  function exportJournal() {
    const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [
      ["Account Code", "Account Name", "Description", "Debit", "Credit"],
      ...rows.map((row) => [row.accountCode, row.accountName, row.description, row.debit, row.credit]),
      ["", "", "Total", totals.debit, totals.credit],
    ].map((row) => row.map(quote).join(",")).join("\n");
    downloadFinanceFile(`${form.voucher || "journal-entry"}.csv`, `\uFEFF${csv}`);
    setMessage("Journal entry exported as CSV.");
  }

  function acceptAttachment(file?: File) {
    if (!file) return;
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
      setMessage("Choose a PDF, JPG, or PNG file up to 5 MB.");
      return;
    }
    setAttachment(file);
    setMessage(`${file.name} attached.`);
  }

  function dropAttachment(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    acceptAttachment(event.dataTransfer.files[0]);
  }

  return (
    <div className={styles.page}>
      <FinancePageHeader
        action={<><input accept=".csv,.json" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) setMessage(`${file.name} selected for journal import.`); event.target.value = ""; }} ref={importInput} type="file" /><button className={styles.whiteButton} onClick={() => importInput.current?.click()} type="button"><FileUp size={14} />Import</button><button className={styles.whiteButton} onClick={exportJournal} type="button"><FileDown size={14} />Export</button><button className={styles.blueButton} onClick={newEntry} type="button"><Plus size={14} />New Journal Entry</button></>}
        current="Journal Entry"
        title="Journal Entry"
      />

      <section className={styles.journalTop}>
        <Card className={styles.journalInfoCard}>
          <h2>Journal Entry Information <span className={styles.entryState}>{status}</span></h2>
          <div className={styles.journalFormGrid}>
            <label><span>Voucher No <b>*</b></span><input className="field" onChange={(event) => updateForm("voucher", event.target.value)} value={form.voucher} /></label>
            <label><span>Date <b>*</b></span><input className="field" onChange={(event) => updateForm("date", event.target.value)} type="date" value={form.date} /></label>
            <label className={styles.gridWide}><span>Reference</span><input className="field" onChange={(event) => updateForm("reference", event.target.value)} value={form.reference} /></label>
            <label className={styles.gridWide}><span>Remarks</span><textarea className="textarea" onChange={(event) => updateForm("remarks", event.target.value)} value={form.remarks} /></label>
          </div>
        </Card>

        <Card className={styles.additionalCard}>
          <h2>Additional Information</h2>
          <div className={styles.additionalFields}>
            <label><span>Entry Type</span><select className="select" onChange={(event) => updateForm("entryType", event.target.value)} value={form.entryType}><option>General Journal</option><option>Adjustment Journal</option><option>Opening Journal</option></select></label>
            <label><span>Branch</span><select className="select" onChange={(event) => updateForm("branch", event.target.value)} value={form.branch}><option>Main Branch</option><option>Dhaka Branch</option><option>Chattogram Branch</option></select></label>
          </div>
          <span className={styles.attachmentLabel}>Attachment</span>
          <input accept=".pdf,.jpg,.jpeg,.png" className="sr-only" onChange={(event) => acceptAttachment(event.target.files?.[0])} ref={attachmentInput} type="file" />
          <div className={styles.dropZone} onDragOver={(event) => event.preventDefault()} onDrop={dropAttachment}>
            <CloudUpload aria-hidden="true" size={34} />
            {attachment ? <><strong>{attachment.name}</strong><button onClick={() => { setAttachment(null); setMessage("Attachment removed."); }} type="button">Remove file</button></> : <><strong>Drag &amp; drop files here or</strong><button onClick={() => attachmentInput.current?.click()} type="button">Browse Files</button></>}
            <small>Supported: PDF, JPG, PNG, (Max 5 MB)</small>
          </div>
        </Card>
      </section>

      <Card className={styles.journalDetails}>
        <header><h2>Journal Entry Details</h2><button className={styles.blueButton} onClick={addRow} type="button"><Plus size={13} />Add Row</button></header>
        <FinanceFeedback>{message}</FinanceFeedback>
        <div className={styles.tableScroller}>
          <table className={styles.journalTable}>
            <caption className="sr-only">Journal entry debit and credit details</caption>
            <thead><tr><th>SL</th><th>Account Code</th><th>Account Name</th><th>Description</th><th>Debit (৳)</th><th>Credit (৳)</th><th>Action</th></tr></thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td><select aria-label={`Account code row ${index + 1}`} className={styles.tableControl} onChange={(event) => chooseAccount(row.id, event.target.value)} value={row.accountCode}><option value="">Select</option>{journalAccountOptions.map((account) => <option key={account.code} value={account.code}>{account.code}</option>)}</select></td>
                  <td><span className={styles.accountName}>{row.accountName || "Choose account"}</span></td>
                  <td><input aria-label={`Description row ${index + 1}`} className={styles.tableControl} onChange={(event) => updateRow(row.id, "description", event.target.value)} placeholder="Add description..." value={row.description} /></td>
                  <td><input aria-label={`Debit row ${index + 1}`} className={`${styles.tableControl} ${styles.amountControl}`} inputMode="decimal" onChange={(event) => updateRow(row.id, "debit", Number(event.target.value.replaceAll(",", "")) || 0)} value={formatFinanceNumber(row.debit)} /></td>
                  <td><input aria-label={`Credit row ${index + 1}`} className={`${styles.tableControl} ${styles.amountControl}`} inputMode="decimal" onChange={(event) => updateRow(row.id, "credit", Number(event.target.value.replaceAll(",", "")) || 0)} value={formatFinanceNumber(row.credit)} /></td>
                  <td><button aria-label={`Delete journal row ${index + 1}`} className={styles.deleteRow} onClick={() => removeRow(row.id)} type="button"><Trash2 size={13} /></button></td>
                </tr>
              ))}
              <tr className={styles.addPrompt}><td></td><td colSpan={5}><button onClick={addRow} type="button"><Plus size={12} />Add new row...</button></td><td></td></tr>
            </tbody>
            <tfoot><tr><th colSpan={4}>Total</th><th>{formatFinanceNumber(totals.debit)}</th><th>{formatFinanceNumber(totals.credit)}</th><th></th></tr></tfoot>
          </table>
        </div>
      </Card>

      <footer className={styles.journalActions}>
        <button className={styles.mutedButton} onClick={() => save("Draft")} type="button"><Save size={14} />Save as Draft</button>
        <button className={styles.greenButton} onClick={() => save("Posted")} type="button"><Send size={14} />Post Entry</button>
        <button className={styles.mutedButton} onClick={() => resetEntry()} type="button"><RotateCcw size={14} />Reset</button>
      </footer>
    </div>
  );
}
