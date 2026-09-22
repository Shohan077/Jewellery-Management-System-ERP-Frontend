"use client";

import { CheckCircle2, FileText, RotateCcw, Save, UploadCloud, X } from "lucide-react";
import { useMemo, useRef, useState, useSyncExternalStore, type DragEvent, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  getCategorySnapshot,
  getExpenseSnapshot,
  INITIAL_CATEGORY_SNAPSHOT,
  INITIAL_EXPENSE_SNAPSHOT,
  parseCategories,
  parseExpenses,
  persistExpenses,
  subscribeToExpenseData,
  suppliers,
  type ExpenseAttachment,
  type PurchaseExpense,
} from "./purchase-expense-data";
import { SuiteHeader } from "./suite-components";
import styles from "./purchase-expense-suite.module.css";

type EntryForm = Omit<PurchaseExpense, "id" | "amount" | "attachment"> & { amount: string; attachment?: ExpenseAttachment };

const defaultForm: EntryForm = {
  date: "2025-04-20",
  category: "Transportation",
  supplier: "Amin Jewellery Supply",
  referenceNo: "EXP-2025-001",
  amount: "12500",
  remarks: "Delivery charge",
};

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
const maxFileSize = 5 * 1024 * 1024;

export function PurchaseExpenseEntry() {
  const categorySnapshot = useSyncExternalStore(subscribeToExpenseData, getCategorySnapshot, () => INITIAL_CATEGORY_SNAPSHOT);
  const expenseSnapshot = useSyncExternalStore(subscribeToExpenseData, getExpenseSnapshot, () => INITIAL_EXPENSE_SNAPSHOT);
  const categories = useMemo(() => parseCategories(categorySnapshot).filter((category) => category.status === "Active"), [categorySnapshot]);
  const expenses = useMemo(() => parseExpenses(expenseSnapshot), [expenseSnapshot]);
  const [form, setForm] = useState<EntryForm>({ ...defaultForm });
  const [dragging, setDragging] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function update<Key extends keyof EntryForm>(key: Key, value: EntryForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  }

  function acceptFile(file?: File) {
    setDragging(false);
    if (!file) return;
    if (!allowedTypes.has(file.type)) {
      setFeedback({ tone: "error", message: "Upload a PDF, JPG, or PNG file." });
      return;
    }
    if (file.size > maxFileSize) {
      setFeedback({ tone: "error", message: "Attachment must be 5 MB or smaller." });
      return;
    }
    update("attachment", { name: file.name, size: file.size, type: file.type });
    setFeedback({ tone: "success", message: `${file.name} is ready to attach.` });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    acceptFile(event.dataTransfer.files[0]);
  }

  function clearForm() {
    setForm({ ...defaultForm });
    if (fileInput.current) fileInput.current.value = "";
    setFeedback(null);
  }

  function saveExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(form.amount.replaceAll(",", ""));
    if (!form.date || !form.category || !form.referenceNo.trim() || !Number.isFinite(amount) || amount <= 0) {
      setFeedback({ tone: "error", message: "Complete the required fields and enter a valid amount." });
      return;
    }
    const existing = expenses.find((expense) => expense.referenceNo.toLowerCase() === form.referenceNo.trim().toLowerCase());
    const record: PurchaseExpense = {
      ...form,
      id: existing?.id ?? `expense-${crypto.randomUUID()}`,
      amount,
      referenceNo: form.referenceNo.trim(),
      remarks: form.remarks.trim(),
    };
    persistExpenses(existing ? expenses.map((expense) => expense.id === existing.id ? record : expense) : [record, ...expenses]);
    setFeedback({ tone: "success", message: `${record.referenceNo} ${existing ? "updated" : "saved"} successfully and is now available in the report.` });
  }

  return (
    <div className={styles.page}>
      <SuiteHeader title="Purchase Expense Entry" />
      <p aria-live="polite" className={feedback ? `${styles.feedback} ${feedback.tone === "error" ? styles.feedbackError : ""}` : "sr-only"}>{feedback ? <CheckCircle2 size={16} /> : null}{feedback?.message ?? ""}</p>
      <Card as="form" className={styles.entryCard} onSubmit={saveExpense}>
        <div className={styles.entryGrid}>
          <label className={styles.control}><span>Expense Date <b>*</b></span><input className="field" onChange={(event) => update("date", event.target.value)} required type="date" value={form.date} /></label>
          <label className={styles.control}><span>Expense Category <b>*</b></span><select className="select" onChange={(event) => update("category", event.target.value)} required value={form.category}>{categories.map((category) => <option key={category.id}>{category.name}</option>)}{!categories.some((category) => category.name === form.category) ? <option>{form.category}</option> : null}</select></label>
          <label className={styles.control}><span>Amount (৳) <b>*</b></span><input className="field" min="0.01" onChange={(event) => update("amount", event.target.value)} required step="0.01" type="number" value={form.amount} /></label>
          <label className={styles.control}><span>Supplier (Optional)</span><select className="select" onChange={(event) => update("supplier", event.target.value)} value={form.supplier}><option value="">No supplier</option>{suppliers.map((supplier) => <option key={supplier}>{supplier}</option>)}</select></label>
          <label className={styles.control}><span>Reference No</span><input className="field" onChange={(event) => update("referenceNo", event.target.value)} value={form.referenceNo} /></label>
          <label className={styles.control}><span>Remarks</span><input className="field" onChange={(event) => update("remarks", event.target.value)} value={form.remarks} /></label>

          <div className={`${styles.control} ${styles.fullSpan}`}><span>Attachment (Optional)</span><div className={`${styles.dropZone} ${dragging ? styles.dragging : ""}`} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={(event) => { if (event.currentTarget === event.target) setDragging(false); }} onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>{form.attachment ? <div className={styles.filePreview}><FileText size={30} /><div><strong>{form.attachment.name}</strong><span>{(form.attachment.size / 1024).toFixed(1)} KB</span></div><button aria-label="Remove attachment" onClick={() => update("attachment", undefined)} type="button"><X size={17} /></button></div> : <button className={styles.uploadPrompt} onClick={() => fileInput.current?.click()} type="button"><UploadCloud size={34} /><strong>Drag & drop file here or click to upload</strong><span>Supports: PDF, JPG, PNG (Max 5 MB)</span></button>}<input accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="sr-only" onChange={(event) => acceptFile(event.target.files?.[0])} ref={fileInput} type="file" /></div></div>
        </div>
        <footer className={styles.entryActions}><button className="button" onClick={clearForm} type="button"><RotateCcw size={17} />Clear</button><button className={styles.primaryButton} type="submit"><Save size={17} />Save Expense</button></footer>
      </Card>
    </div>
  );
}
