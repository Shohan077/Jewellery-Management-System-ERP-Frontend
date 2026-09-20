"use client";

import { CheckCircle2, CircleAlert, Pencil, Save, Trash2 } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  expenseCategories,
  formatDate,
  formatRupees,
  getExpenseSnapshot,
  INITIAL_EXPENSE_SNAPSHOT,
  parseExpenseSnapshot,
  persistExpenses,
  subscribeToExpenses,
  suppliers,
  type PurchaseExpenseRecord,
} from "./purchase-expense-data";
import styles from "./purchase-expense-reporting.module.css";

type ExpenseForm = Omit<PurchaseExpenseRecord, "amount"> & { amount: string };
type Feedback = { tone: "success" | "error" | "info"; message: string } | null;

const defaultForm: ExpenseForm = {
  id: "expense-0042",
  date: "2025-05-20",
  category: "Transportation",
  supplier: "Shree Gems Suppliers",
  referenceNo: "EXP/2025/0042",
  amount: "5,200.00",
  remarks: "Transport charges for gold purchase.",
};

function toAmount(value: string) {
  return Number(value.replaceAll(",", "").trim());
}

function inputAmount(value: number) {
  return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export function PurchaseExpenseEntry() {
  const snapshot = useSyncExternalStore(subscribeToExpenses, getExpenseSnapshot, () => INITIAL_EXPENSE_SNAPSHOT);
  const records = useMemo(() => parseExpenseSnapshot(snapshot), [snapshot]);
  const [form, setForm] = useState<ExpenseForm>({ ...defaultForm });
  const [feedback, setFeedback] = useState<Feedback>(null);

  const recent = records.filter((record) => record.referenceNo !== defaultForm.referenceNo).slice(0, 5);

  function update<Key extends keyof ExpenseForm>(key: Key, value: ExpenseForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  }

  function resetForm() {
    setForm({ ...defaultForm });
    setFeedback({ tone: "info", message: "The expense form was restored to the reference values." });
  }

  function editRecord(record: PurchaseExpenseRecord) {
    setForm({ ...record, amount: inputAmount(record.amount) });
    setFeedback({ tone: "info", message: `Editing ${record.referenceNo}.` });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteRecord(record: PurchaseExpenseRecord) {
    if (!window.confirm(`Delete ${record.referenceNo}?`)) return;
    try {
      persistExpenses(records.filter((candidate) => candidate.id !== record.id));
      if (form.id === record.id) setForm({ ...defaultForm });
      setFeedback({ tone: "success", message: `${record.referenceNo} was deleted.` });
    } catch {
      setFeedback({ tone: "error", message: "The expense could not be deleted from browser storage." });
    }
  }

  function saveExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = toAmount(form.amount);
    if (!form.date || !form.category || !form.referenceNo.trim() || !Number.isFinite(amount) || amount <= 0) {
      setFeedback({ tone: "error", message: "Complete the required fields and enter an amount greater than zero." });
      return;
    }

    const record: PurchaseExpenseRecord = {
      ...form,
      id: form.id || `expense-${crypto.randomUUID()}`,
      amount,
      referenceNo: form.referenceNo.trim(),
      remarks: form.remarks.trim(),
    };

    try {
      const exists = records.some((candidate) => candidate.id === record.id || candidate.referenceNo === record.referenceNo);
      const next = exists
        ? records.map((candidate) => candidate.id === record.id || candidate.referenceNo === record.referenceNo ? record : candidate)
        : [record, ...records];
      persistExpenses(next);
      setForm({ ...record, amount: inputAmount(record.amount) });
      setFeedback({ tone: "success", message: `${record.referenceNo} ${exists ? "updated" : "saved"} successfully.` });
    } catch {
      setFeedback({ tone: "error", message: "The expense could not be saved in browser storage." });
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageTitle}><h1>Screen 79 – Purchase Expense Entry</h1></header>

      <p aria-live="polite" className={feedback ? `${styles.feedback} ${styles[feedback.tone]}` : "sr-only"} role={feedback?.tone === "error" ? "alert" : "status"}>
        {feedback?.tone === "error" ? <CircleAlert aria-hidden="true" size={16} /> : <CheckCircle2 aria-hidden="true" size={16} />}
        {feedback?.message ?? ""}
      </p>

      <form onSubmit={saveExpense}>
        <Card className={styles.formCard}>
          <div className={styles.formGrid}>
            <label className={styles.control}><span>Expense Date <b>*</b></span><input className="field" onChange={(event) => update("date", event.target.value)} required type="date" value={form.date} /></label>
            <label className={styles.control}><span>Supplier (Optional)</span><select className="select" onChange={(event) => update("supplier", event.target.value)} value={form.supplier}>{suppliers.map((supplier) => <option key={supplier}>{supplier}</option>)}<option>-</option></select></label>
            <label className={styles.control}><span>Expense Category <b>*</b></span><select className="select" onChange={(event) => update("category", event.target.value)} required value={form.category}>{expenseCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className={styles.control}><span>Reference No</span><input className="field" onChange={(event) => update("referenceNo", event.target.value)} value={form.referenceNo} /></label>
            <label className={styles.control}><span>Amount <b>*</b></span><input className="field" inputMode="decimal" onBlur={() => { const amount = toAmount(form.amount); if (Number.isFinite(amount)) update("amount", inputAmount(amount)); }} onChange={(event) => update("amount", event.target.value)} required value={form.amount} /></label>
            <label className={styles.control}><span>Remarks</span><textarea className="textarea" onChange={(event) => update("remarks", event.target.value)} value={form.remarks} /></label>
          </div>
        </Card>

        <Card className={styles.entryTableCard}>
          <h2>Recent Expenses</h2>
          <div className={styles.tableScroller}>
            <table className={styles.table}>
              <caption className="sr-only">Five most recent purchase expenses</caption>
              <thead><tr><th>Date</th><th>Category</th><th>Supplier</th><th>Reference No</th><th>Amount (₹)</th><th>Action</th></tr></thead>
              <tbody>{recent.map((record) => <tr key={record.id}><td>{formatDate(record.date)}</td><td>{record.category}</td><td>{record.supplier}</td><td>{record.referenceNo}</td><td>{formatRupees(record.amount).replace("₹ ", "")}</td><td><div className={styles.rowActions}><button aria-label={`Edit ${record.referenceNo}`} onClick={() => editRecord(record)} type="button"><Pencil size={15} /></button><button aria-label={`Delete ${record.referenceNo}`} className={styles.deleteButton} onClick={() => deleteRecord(record)} type="button"><Trash2 size={15} /></button></div></td></tr>)}</tbody>
            </table>
          </div>
        </Card>

        <footer className={styles.entryActions}><button className="button" onClick={resetForm} type="button">Cancel</button><button className="button button--primary" type="submit"><Save aria-hidden="true" size={16} />Save Expense</button></footer>
      </form>
    </div>
  );
}
