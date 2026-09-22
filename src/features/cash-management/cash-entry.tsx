"use client";

import { ArrowDown, ArrowUp, Eye, Save, WalletCards } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  cashInSources,
  cashInTypes,
  cashOutPayees,
  cashOutTypes,
  EMPTY_CASH_SNAPSHOT,
  formatCashDate,
  formatMoney,
  getCashSnapshot,
  parseCashTransactions,
  paymentMethods,
  persistCashTransactions,
  recentCashIn,
  recentCashOut,
  subscribeCash,
  type CashDirection,
  type CashTransaction,
} from "./cash-data";
import styles from "./cash-management.module.css";

type CashForm = { date: string; party: string; category: string; reference: string; amount: string; method: string; remarks: string };

function defaultForm(): CashForm {
  return { date: "2025-04-16", party: "", category: "", reference: "", amount: "", method: "", remarks: "" };
}

export function CashEntry({ direction }: { direction: CashDirection }) {
  const snapshot = useSyncExternalStore(subscribeCash, getCashSnapshot, () => EMPTY_CASH_SNAPSHOT);
  const saved = useMemo(() => parseCashTransactions(snapshot), [snapshot]);
  const [form, setForm] = useState<CashForm>(defaultForm);
  const [message, setMessage] = useState("");
  const isIn = direction === "Cash In";
  const sources = isIn ? cashInSources : cashOutPayees;
  const categories = isIn ? cashInTypes : cashOutTypes;
  const seeded = isIn ? recentCashIn : recentCashOut;
  const recent = [...saved.filter((item) => item.direction === direction), ...seeded].slice(0, 8);
  const savedIn = saved.filter((item) => item.direction === "Cash In").reduce((sum, item) => sum + item.amount, 0);
  const savedOut = saved.filter((item) => item.direction === "Cash Out").reduce((sum, item) => sum + item.amount, 0);
  const todayAdded = saved.filter((item) => item.direction === direction && item.date === "2025-04-16").reduce((sum, item) => sum + item.amount, 0);
  const todayTotal = (isIn ? 125_400 : 82_350) + todayAdded;
  const cashBalance = (isIn ? 587_250 : 504_900) + savedIn - savedOut;

  function update<Key extends keyof CashForm>(key: Key, value: CashForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function clear() {
    setForm(defaultForm());
    setMessage(`${direction} form cleared.`);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(form.amount.replaceAll(",", ""));
    if (!form.party || !form.category || !form.method || !Number.isFinite(amount) || amount <= 0) {
      setMessage("Complete the required fields and enter an amount greater than zero.");
      return;
    }
    const prefix = isIn ? "CIN" : "COUT";
    const sequence = 100 + saved.length + 1;
    const record: CashTransaction = {
      id: `cash-${crypto.randomUUID()}`,
      date: form.date,
      direction,
      party: form.party,
      category: form.category,
      reference: form.reference.trim() || `${prefix}-2025-${String(sequence).padStart(3, "0")}`,
      amount,
      method: form.method,
      remarks: form.remarks.trim(),
    };
    persistCashTransactions([record, ...saved]);
    setForm(defaultForm());
    setMessage(`${record.reference} saved successfully.`);
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>{direction} Entry</h1><p>Home <span>›</span> Accounts &amp; Cash <span>›</span> {direction} Entry</p></header>
      <section className={styles.entryLayout}>
        <Card as="form" className={styles.formCard} onSubmit={save}>
          <h2>{direction} Details</h2>
          <div className={styles.entryFields}>
            <label><span>{isIn ? "Entry" : "Expense"} Date <b>*</b></span><input className="field" onChange={(event) => update("date", event.target.value)} required type="date" value={form.date} /></label>
            <label><span>{isIn ? "Received From" : "Paid To"} <b>*</b></span><select className="select" onChange={(event) => update("party", event.target.value)} required value={form.party}><option value="">Select / Enter {isIn ? "Source" : "Payee"}</option>{sources.map((source) => <option key={source}>{source}</option>)}</select></label>
            <label><span>{direction} Type <b>*</b></span><select className="select" onChange={(event) => update("category", event.target.value)} required value={form.category}><option value="">Select {direction} Type</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label><span>Reference No.</span><input className="field" onChange={(event) => update("reference", event.target.value)} placeholder="Enter Reference Number" value={form.reference} /></label>
            <label><span>Amount <b>*</b></span><input className="field" min="0.01" onChange={(event) => update("amount", event.target.value)} placeholder="0.00" required step="0.01" type="number" value={form.amount} /></label>
            <label><span>Payment Method <b>*</b></span><select className="select" onChange={(event) => update("method", event.target.value)} required value={form.method}><option value="">Select Payment Method</option>{paymentMethods.map((method) => <option key={method}>{method}</option>)}</select></label>
            <label><span>Remarks</span><textarea className="textarea" onChange={(event) => update("remarks", event.target.value)} placeholder="Enter remarks (optional)" value={form.remarks} /></label>
          </div>
          <p aria-live="polite" className={message ? styles.formMessage : "sr-only"}>{message}</p>
          <footer className={styles.formActions}><button className={styles.secondaryButton} onClick={clear} type="button">{isIn ? "Clear" : "Cancel"}</button><button className={styles.primaryButton} type="submit"><Save size={16} />Save {direction}</button></footer>
        </Card>

        <div className={styles.entryRight}>
          <Card className={styles.summaryPanel}><h2>{direction} Summary</h2><div className={styles.summaryItem}><i className={isIn ? styles.greenIcon : styles.redIcon}>{isIn ? <ArrowDown /> : <ArrowUp />}</i><div><span>Today {direction}</span><strong className={isIn ? styles.greenText : styles.redText}>{formatMoney(todayTotal)}</strong></div></div><div className={styles.summaryItem}><i className={styles.walletIcon}><WalletCards /></i><div><span>{isIn ? "Total" : "Remaining"} Cash Balance</span><strong className={styles.blueText}>{formatMoney(cashBalance)}</strong></div></div></Card>
          <Card className={styles.recentCard}><h2>Recent {direction} Entries</h2><div className={styles.tableScroller}><table className={styles.compactTable}><caption className="sr-only">Recent {direction.toLowerCase()} entries</caption><thead><tr><th>Date</th><th>{isIn ? "Source" : "Paid To"}</th>{!isIn ? <th>Category</th> : null}<th>Reference</th><th>Amount</th>{isIn ? <th>Method</th> : null}<th>Action</th></tr></thead><tbody>{recent.map((item) => <tr key={item.id}><td>{formatCashDate(item.date)}</td><td>{item.party}</td>{!isIn ? <td>{item.category}</td> : null}<td>{item.reference}</td><td>{formatMoney(item.amount).replace("₹ ", "")}</td>{isIn ? <td>{item.method}</td> : null}<td><button aria-label={`View ${item.reference}`} onClick={() => setMessage(`${item.reference}: ${item.party}, ${formatMoney(item.amount)} via ${item.method}. ${item.remarks}`)} type="button"><Eye size={14} /></button></td></tr>)}</tbody></table></div></Card>
        </div>
      </section>
    </div>
  );
}

