"use client";

import { ArrowDown, ArrowUp, Eye, Save, WalletCards } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  EMPTY_CASH_SNAPSHOT,
  formatCashDate,
  formatMoney,
  getCashSnapshot,
  parseCashTransactions,
  paymentHistory,
  persistCashTransactions,
  receiptHistory,
  subscribeCash,
  type CashTransaction,
} from "./cash-data";
import styles from "./cash-management.module.css";

type Mode = "Receipt" | "Payment";
type EntryForm = { date: string; party: string; category: string; reference: string; amount: string; method: string; remarks: string };

const receiptParties = ["Sales - Walk In", "Customer Advance", "Diamond Sale", "Old Gold Purchase", "Interest Received"];
const receiptTypes = ["Sales Receipt", "Advance Receipt", "Old Gold", "Other Receipt"];
const paymentParties = ["Sunita Karigar", "Ramesh Suppliers", "Electricity Board", "Rent Payment", "Transport Service"];
const paymentTypes = ["Wages", "Raw Materials", "Utilities", "Rent", "Transport"];
const methods = ["Cash", "Bank", "UPI", "Card", "Cheque"];
const emptyForm = (): EntryForm => ({ date: "2025-04-16", party: "", category: "", reference: "", amount: "", method: "", remarks: "" });

export function AccountEntry({ mode }: { mode: Mode }) {
  const snapshot = useSyncExternalStore(subscribeCash, getCashSnapshot, () => EMPTY_CASH_SNAPSHOT);
  const saved = useMemo(() => parseCashTransactions(snapshot), [snapshot]);
  const [form, setForm] = useState<EntryForm>(emptyForm);
  const [message, setMessage] = useState("");
  const isReceipt = mode === "Receipt";
  const direction = isReceipt ? "Cash In" : "Cash Out";
  const seed = isReceipt ? receiptHistory : paymentHistory;
  const matchingSaved = saved.filter((entry) => entry.direction === direction);
  const recent = [...matchingSaved, ...seed].slice(0, 8);
  const savedIn = saved.filter((entry) => entry.direction === "Cash In").reduce((sum, entry) => sum + entry.amount, 0);
  const savedOut = saved.filter((entry) => entry.direction === "Cash Out").reduce((sum, entry) => sum + entry.amount, 0);
  const todayAdded = matchingSaved.filter((entry) => entry.date === "2025-04-16").reduce((sum, entry) => sum + entry.amount, 0);
  const todayTotal = (isReceipt ? 165_750 : 122_300) + todayAdded;
  const balance = (isReceipt ? 545_300 : 423_000) + savedIn - savedOut;
  const parties = isReceipt ? receiptParties : paymentParties;
  const types = isReceipt ? receiptTypes : paymentTypes;

  function update<Key extends keyof EntryForm>(key: Key, value: EntryForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function clear() {
    setForm(emptyForm());
    setMessage(`${mode} form cleared.`);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(form.amount.replaceAll(",", ""));
    if (!form.party || !form.category || !form.method || !Number.isFinite(amount) || amount <= 0) {
      setMessage("Complete all required fields and enter a valid amount.");
      return;
    }
    const prefix = isReceipt ? "RCT" : "PAY";
    const entry: CashTransaction = {
      id: `account-entry-${crypto.randomUUID()}`,
      date: form.date,
      direction,
      party: form.party,
      category: form.category,
      reference: form.reference.trim() || `${prefix}-2025-${String(100 + saved.length + 1).padStart(3, "0")}`,
      amount,
      method: form.method,
      remarks: form.remarks.trim(),
    };
    persistCashTransactions([entry, ...saved]);
    setForm(emptyForm());
    setMessage(`${entry.reference} saved successfully.`);
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>{mode} Entry</h1><p>Home <span>›</span> Accounts &amp; Cash <span>›</span> {mode} Entry</p></header>
      <section className={styles.entryLayout}>
        <Card as="form" className={styles.formCard} onSubmit={save}>
          <h2>{mode} Details</h2>
          <div className={styles.entryFields}>
            <label><span>{mode} Date <b>*</b></span><input className="field" onChange={(event) => update("date", event.target.value)} required type="date" value={form.date} /></label>
            <label><span>{isReceipt ? "Received From" : "Paid To"} <b>*</b></span><select className="select" onChange={(event) => update("party", event.target.value)} value={form.party}><option value="">Select / Enter {isReceipt ? "Source" : "Payee"}</option>{parties.map((party) => <option key={party}>{party}</option>)}</select></label>
            <label><span>{mode} Type <b>*</b></span><select className="select" onChange={(event) => update("category", event.target.value)} value={form.category}><option value="">Select {mode} Type</option>{types.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label><span>Reference No.</span><input className="field" onChange={(event) => update("reference", event.target.value)} placeholder="Enter Reference Number" value={form.reference} /></label>
            <label><span>Amount <b>*</b></span><input className="field" min="0.01" onChange={(event) => update("amount", event.target.value)} placeholder="0.00" required step="0.01" type="number" value={form.amount} /></label>
            <label><span>Payment Method <b>*</b></span><select className="select" onChange={(event) => update("method", event.target.value)} value={form.method}><option value="">Select Payment Method</option>{methods.map((method) => <option key={method}>{method}</option>)}</select></label>
            <label><span>Remarks</span><textarea className="textarea" onChange={(event) => update("remarks", event.target.value)} placeholder="Enter remarks (optional)" value={form.remarks} /></label>
          </div>
          <p aria-live="polite" className={message ? styles.formMessage : "sr-only"}>{message}</p>
          <footer className={styles.formActions}><button className={styles.secondaryButton} onClick={clear} type="button">{isReceipt ? "Clear" : "Cancel"}</button><button className={styles.primaryButton} type="submit"><Save size={16} />Save {mode}</button></footer>
        </Card>

        <div className={styles.entryRight}>
          <Card className={styles.summaryPanel}><h2>{mode} Summary</h2><div className={styles.summaryItem}><i className={isReceipt ? styles.greenIcon : styles.redIcon}>{isReceipt ? <ArrowDown /> : <ArrowUp />}</i><div><span>Today&apos;s Total {mode}s</span><strong className={isReceipt ? styles.greenText : styles.redText}>{formatMoney(todayTotal)}</strong></div></div><div className={styles.summaryItem}><i className={styles.walletIcon}><WalletCards /></i><div><span>{isReceipt ? "Current" : "Remaining"} Cash Balance</span><strong className={styles.blueText}>{formatMoney(balance)}</strong></div></div></Card>
          <Card className={styles.recentCard}><h2>Recent {mode}s</h2><div className={styles.tableScroller}><table className={styles.compactTable}><caption className="sr-only">Recent {mode.toLowerCase()} entries</caption><thead><tr><th>Date</th><th>{isReceipt ? "Source" : "Payee"}</th>{!isReceipt ? <th>Category</th> : null}<th>Reference</th><th>Amount</th><th>Method</th><th>Action</th></tr></thead><tbody>{recent.map((entry) => <tr key={entry.id}><td>{formatCashDate(entry.date)}</td><td>{entry.party}</td>{!isReceipt ? <td>{entry.category}</td> : null}<td>{entry.reference}</td><td>{formatMoney(entry.amount).replace("₹ ", "")}</td><td>{entry.method}</td><td><button aria-label={`View ${entry.reference}`} onClick={() => setMessage(`${entry.reference}: ${entry.party}, ${formatMoney(entry.amount)}. ${entry.remarks}`)} type="button"><Eye size={14} /></button></td></tr>)}</tbody></table></div></Card>
        </div>
      </section>
    </div>
  );
}

