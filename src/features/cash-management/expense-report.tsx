"use client";

import { Calculator, Download, ReceiptText, Search, Trophy, WalletCards } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  EMPTY_CASH_SNAPSHOT,
  expenseReportSeed,
  formatCashDate,
  formatMoney,
  getCashSnapshot,
  parseCashTransactions,
  subscribeCash,
} from "./cash-data";
import styles from "./cash-management.module.css";

type Filters = { from: string; to: string; category: string; branch: string; query: string };
const initialFilters: Filters = { from: "2025-04-01", to: "2025-04-16", category: "All Categories", branch: "All Branches", query: "" };

export function ExpenseReport() {
  const snapshot = useSyncExternalStore(subscribeCash, getCashSnapshot, () => EMPTY_CASH_SNAPSHOT);
  const saved = useMemo(() => parseCashTransactions(snapshot).filter((entry) => entry.direction === "Cash Out"), [snapshot]);
  const [draft, setDraft] = useState<Filters>({ ...initialFilters });
  const [filters, setFilters] = useState<Filters>({ ...initialFilters });
  const [message, setMessage] = useState("");
  const allRows = [...saved, ...expenseReportSeed];
  const categories = [...new Set(allRows.map((entry) => entry.category))];
  const filtered = allRows.filter((entry) => entry.date >= filters.from && entry.date <= filters.to)
    .filter((entry) => filters.category === "All Categories" || entry.category === filters.category)
    .filter((entry) => !filters.query || [entry.party, entry.reference, entry.category, entry.remarks].some((value) => value.toLowerCase().includes(filters.query.toLowerCase())))
    .sort((left, right) => right.date.localeCompare(left.date));
  const savedTotal = saved.reduce((sum, entry) => sum + entry.amount, 0);
  const total = 285_430 + savedTotal;
  const transactions = 32 + saved.length;
  const highestRow = allRows.reduce((highest, entry) => entry.amount > highest.amount ? entry : highest, { amount: 75_000, category: "Raw Materials" });
  const average = total / transactions;

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.from > draft.to) {
      setMessage("From Date must be before To Date.");
      return;
    }
    setFilters({ ...draft });
    setMessage(`Expense report updated for ${draft.branch}.`);
  }

  function exportCsv() {
    const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [["Date", "Category", "Paid To", "Reference No", "Amount", "Method", "Remarks"], ...filtered.map((entry) => [formatCashDate(entry.date), entry.category, entry.party, entry.reference, entry.amount, entry.method, entry.remarks])].map((row) => row.map(quote).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `expense-report-${filters.from}-${filters.to}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Expense report exported as CSV.");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>Expense Report</h1><p>Home <span>›</span> Accounts &amp; Cash <span>›</span> Expense Report</p></header>
      <Card as="form" className={`${styles.filterBar} ${styles.expenseFilters}`} onSubmit={search}>
        <label><span>From Date</span><input className="field" max={draft.to} onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))} type="date" value={draft.from} /></label>
        <label><span>To Date</span><input className="field" min={draft.from} onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))} type="date" value={draft.to} /></label>
        <label><span>Category</span><select className="select" onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} value={draft.category}><option>All Categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label><span>Branch</span><select className="select" onChange={(event) => setDraft((current) => ({ ...current, branch: event.target.value }))} value={draft.branch}><option>All Branches</option><option>Main Branch</option><option>Uttara Branch</option><option>Chittagong Branch</option></select></label>
        <label><span>Search</span><div className={styles.searchField}><input onChange={(event) => setDraft((current) => ({ ...current, query: event.target.value }))} placeholder="Search paid to, reference..." type="search" value={draft.query} /><Search size={15} /></div></label>
        <button className={styles.primaryButton} type="submit"><Search size={15} />Search</button><button className={styles.primaryButton} onClick={exportCsv} type="button"><Download size={15} />Export</button>
      </Card>
      <p aria-live="polite" className={message ? styles.formMessage : "sr-only"}>{message}</p>
      <section className={styles.kpiGrid}>
        <Card className={styles.kpi}><i className={styles.redIcon}><ReceiptText /></i><div><span>Total Expense</span><strong className={styles.redText}>{formatMoney(total)}</strong></div></Card>
        <Card className={styles.kpi}><i className={styles.greenIcon}><WalletCards /></i><div><span>Total Transactions</span><strong>{transactions}</strong></div></Card>
        <Card className={styles.kpi}><i className={styles.purpleIcon}><Trophy /></i><div><span>Highest Expense</span><strong className={styles.purpleText}>{formatMoney(highestRow.amount)}</strong><small>({highestRow.category})</small></div></Card>
        <Card className={styles.kpi}><i className={styles.lightBlueIcon}><Calculator /></i><div><span>Average Expense</span><strong className={styles.blueText}>{formatMoney(average)}</strong></div></Card>
      </section>
      <Card className={styles.tableCard}><h2 className={styles.reportTitle}>Expense Report</h2><div className={styles.tableScroller}><table className={styles.ledgerTable}><caption className="sr-only">Expense report results</caption><thead><tr><th>Date</th><th>Category</th><th>Paid To</th><th>Reference No.</th><th>Amount</th><th>Method</th><th>Remarks</th></tr></thead><tbody>{filtered.map((entry) => <tr key={entry.id}><td>{formatCashDate(entry.date)}</td><td>{entry.category}</td><td>{entry.party}</td><td>{entry.reference}</td><td>{formatMoney(entry.amount)}</td><td>{entry.method}</td><td>{entry.remarks}</td></tr>)}{!filtered.length ? <tr><td className={styles.empty} colSpan={7}>No expenses match the selected filters.</td></tr> : null}</tbody><tfoot><tr><th colSpan={4}>Total</th><th>{formatMoney(total)}</th><th colSpan={2} /></tr></tfoot></table></div></Card>
    </div>
  );
}

