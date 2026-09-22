"use client";

import { Calculator, CircleDollarSign, Download, Search, Trophy, WalletCards } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  expenseCategories,
  formatDate,
  formatRupees,
  getExpenseSnapshot,
  INITIAL_EXPENSE_SNAPSHOT,
  parseExpenseSnapshot,
  subscribeToExpenses,
  suppliers,
} from "./purchase-expense-data";
import styles from "./purchase-expense-reporting.module.css";

type Filters = { fromDate: string; toDate: string; category: string; supplier: string };

const initialFilters: Filters = {
  fromDate: "2025-05-01",
  toDate: "2025-05-20",
  category: "All",
  supplier: "All",
};

export function PurchaseExpenseReport() {
  const snapshot = useSyncExternalStore(subscribeToExpenses, getExpenseSnapshot, () => INITIAL_EXPENSE_SNAPSHOT);
  const records = useMemo(() => parseExpenseSnapshot(snapshot), [snapshot]);
  const [draftFilters, setDraftFilters] = useState<Filters>({ ...initialFilters });
  const [filters, setFilters] = useState<Filters>({ ...initialFilters });
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => records
    .filter((record) => record.date >= filters.fromDate && record.date <= filters.toDate)
    .filter((record) => filters.category === "All" || record.category === filters.category)
    .filter((record) => filters.supplier === "All" || record.supplier === filters.supplier)
    .sort((left, right) => right.date.localeCompare(left.date)), [filters, records]);

  const total = filtered.reduce((sum, record) => sum + record.amount, 0);
  const highest = filtered.reduce((top, record) => record.amount > (top?.amount ?? -1) ? record : top, filtered[0]);
  const average = filtered.length ? total / filtered.length : 0;
  const visible = filtered.slice(0, 6);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draftFilters.fromDate > draftFilters.toDate) {
      setMessage("From Date must be before To Date.");
      return;
    }
    setFilters({ ...draftFilters });
    const matchCount = records
      .filter((record) => record.date >= draftFilters.fromDate && record.date <= draftFilters.toDate)
      .filter((record) => draftFilters.category === "All" || record.category === draftFilters.category)
      .filter((record) => draftFilters.supplier === "All" || record.supplier === draftFilters.supplier)
      .length;
    setMessage(`Showing ${matchCount} matching transactions.`);
  }

  function exportReport() {
    const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = [
      ["Date", "Category", "Supplier", "Reference No", "Amount (INR)", "Remarks"],
      ...filtered.map((record) => [formatDate(record.date), record.category, record.supplier, record.referenceNo, record.amount.toFixed(2), record.remarks]),
    ];
    const csv = rows.map((row) => row.map(quote).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    link.download = `purchase-expense-report-${filters.fromDate}-${filters.toDate}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
    setMessage("Purchase expense report exported as CSV.");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageTitle}><h1>Screen 80 – Purchase Expense Report</h1></header>

      <Card as="form" className={styles.filterCard} onSubmit={applyFilters}>
        <label className={styles.control}><span>From Date</span><input className="field" max={draftFilters.toDate} onChange={(event) => setDraftFilters((current) => ({ ...current, fromDate: event.target.value }))} type="date" value={draftFilters.fromDate} /></label>
        <label className={styles.control}><span>To Date</span><input className="field" min={draftFilters.fromDate} onChange={(event) => setDraftFilters((current) => ({ ...current, toDate: event.target.value }))} type="date" value={draftFilters.toDate} /></label>
        <label className={styles.control}><span>Category</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, category: event.target.value }))} value={draftFilters.category}><option>All</option>{expenseCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className={styles.control}><span>Supplier</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, supplier: event.target.value }))} value={draftFilters.supplier}><option>All</option>{suppliers.map((supplier) => <option key={supplier}>{supplier}</option>)}<option>-</option></select></label>
        <button className="button button--primary" type="submit"><Search aria-hidden="true" size={16} />Search</button>
        <button className="button" disabled={!filtered.length} onClick={exportReport} type="button"><Download aria-hidden="true" size={16} />Export</button>
      </Card>

      <p aria-live="polite" className={message ? styles.reportMessage : "sr-only"}>{message}</p>

      <section aria-label="Expense report summary" className={styles.metrics}>
        <Card className={`${styles.metric} ${styles.metricBlue}`}><span><Calculator aria-hidden="true" /></span><div><small>Total Expense</small><strong>{formatRupees(total)}</strong></div></Card>
        <Card className={`${styles.metric} ${styles.metricGreen}`}><span><WalletCards aria-hidden="true" /></span><div><small>Total Transactions</small><strong>{filtered.length}</strong></div></Card>
        <Card className={`${styles.metric} ${styles.metricPurple}`}><span><Trophy aria-hidden="true" /></span><div><small>Highest Expense</small><strong>{formatRupees(highest?.amount ?? 0)}</strong><em>{highest?.category ?? "No expenses"}</em></div></Card>
        <Card className={`${styles.metric} ${styles.metricOrange}`}><span><CircleDollarSign aria-hidden="true" /></span><div><small>Average Expense</small><strong>{formatRupees(average)}</strong></div></Card>
      </section>

      <Card className={styles.reportTableCard}>
        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Purchase expense report</caption>
            <thead><tr><th>Date</th><th>Category</th><th>Supplier</th><th>Reference No</th><th>Amount (₹)</th><th>Remarks</th></tr></thead>
            <tbody>
              {visible.map((record) => <tr key={record.id}><td>{formatDate(record.date)}</td><td>{record.category}</td><td>{record.supplier}</td><td>{record.referenceNo}</td><td>{formatRupees(record.amount).replace("₹ ", "")}</td><td>{record.remarks}</td></tr>)}
              {!visible.length ? <tr><td className={styles.emptyState} colSpan={6}>No expense records match the selected filters.</td></tr> : null}
            </tbody>
            <tfoot><tr><th colSpan={4}>Total</th><th>{formatRupees(total)}</th><th>{filtered.length} Transactions</th></tr></tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}
