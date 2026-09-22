"use client";

import { Eye, Save } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  EMPTY_CASH_SNAPSHOT,
  expenseHistory,
  formatCashDate,
  formatMoney,
  getCashSnapshot,
  parseCashTransactions,
  persistCashTransactions,
  subscribeCash,
  type CashTransaction,
} from "./cash-data";
import styles from "./cash-management.module.css";

const categories = ["Office Supplies", "Refreshments", "Telephone", "Vehicle Fuel", "Printing & Stationery", "Courier Charges", "Bank Charges", "Raw Materials", "Wages", "Rent", "Utilities", "Transport"];
const payees = ["Kiran Stationers", "Cafe Delight", "BSNL", "Indian Oil", "Print Point", "DTDC", "SBI Bank", "Ramesh Suppliers", "Sunita Karigar", "Office Landlord", "Electricity Board", "Transport Service"];
const methods = ["Cash", "Bank", "UPI", "Card", "Cheque"];
const emptyForm = { date: "2025-04-16", category: "", party: "", reference: "", amount: "", method: "", remarks: "" };

export function ExpenseEntry() {
  const snapshot = useSyncExternalStore(subscribeCash, getCashSnapshot, () => EMPTY_CASH_SNAPSHOT);
  const saved = useMemo(() => parseCashTransactions(snapshot), [snapshot]);
  const [form, setForm] = useState({ ...emptyForm });
  const [message, setMessage] = useState("");
  const recent = [...saved.filter((entry) => entry.direction === "Cash Out"), ...expenseHistory].slice(0, 9);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.category || !form.party || !form.method || !Number.isFinite(amount) || amount <= 0) {
      setMessage("Complete all required fields and enter a valid amount.");
      return;
    }
    const entry: CashTransaction = {
      id: `expense-entry-${crypto.randomUUID()}`,
      date: form.date,
      direction: "Cash Out",
      party: form.party,
      category: form.category,
      reference: form.reference.trim() || `EXP-2025-${String(60 + saved.length + 1).padStart(3, "0")}`,
      amount,
      method: form.method,
      remarks: form.remarks.trim(),
    };
    persistCashTransactions([entry, ...saved]);
    setForm({ ...emptyForm });
    setMessage(`${entry.reference} saved and added to the expense report.`);
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>Expense Entry</h1><p>Home <span>›</span> Accounts &amp; Cash <span>›</span> Expense Entry</p></header>
      <section className={styles.expenseLayout}>
        <Card as="form" className={`${styles.formCard} ${styles.expenseForm}`} onSubmit={save}>
          <div className={styles.entryFields}>
            <label><span>Expense Date <b>*</b></span><input className="field" onChange={(event) => update("date", event.target.value)} type="date" value={form.date} /></label>
            <label><span>Expense Category <b>*</b></span><select className="select" onChange={(event) => update("category", event.target.value)} value={form.category}><option value="">Select Expense Category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label><span>Paid To <b>*</b></span><select className="select" onChange={(event) => update("party", event.target.value)} value={form.party}><option value="">Select / Enter Payee</option>{payees.map((payee) => <option key={payee}>{payee}</option>)}</select></label>
            <label><span>Reference No.</span><input className="field" onChange={(event) => update("reference", event.target.value)} placeholder="Enter Reference Number" value={form.reference} /></label>
            <label><span>Amount <b>*</b></span><input className="field" min="0.01" onChange={(event) => update("amount", event.target.value)} placeholder="0.00" step="0.01" type="number" value={form.amount} /></label>
            <label><span>Payment Method <b>*</b></span><select className="select" onChange={(event) => update("method", event.target.value)} value={form.method}><option value="">Select Payment Method</option>{methods.map((method) => <option key={method}>{method}</option>)}</select></label>
            <label><span>Remarks</span><textarea className="textarea" onChange={(event) => update("remarks", event.target.value)} placeholder="Enter remarks (optional)" value={form.remarks} /></label>
          </div>
          <p aria-live="polite" className={message ? styles.formMessage : "sr-only"}>{message}</p>
          <footer className={styles.formActions}><button className={styles.secondaryButton} onClick={() => { setForm({ ...emptyForm }); setMessage("Expense form cleared."); }} type="button">Cancel</button><button className={styles.primaryButton} type="submit"><Save size={16} />Save Expense</button></footer>
        </Card>

        <Card className={styles.recentCard}><h2>Recent Expenses</h2><div className={styles.tableScroller}><table className={`${styles.compactTable} ${styles.expenseTable}`}><caption className="sr-only">Recent expense entries</caption><thead><tr><th>Date</th><th>Category</th><th>Paid To</th><th>Amount</th><th>Action</th></tr></thead><tbody>{recent.map((entry) => <tr key={entry.id}><td>{formatCashDate(entry.date)}</td><td>{entry.category}</td><td>{entry.party}</td><td>{formatMoney(entry.amount)}</td><td><button aria-label={`View ${entry.reference}`} onClick={() => setMessage(`${entry.reference}: ${entry.remarks || entry.category}, paid via ${entry.method}.`)} type="button"><Eye size={14} /></button></td></tr>)}</tbody></table></div></Card>
      </section>
    </div>
  );
}

