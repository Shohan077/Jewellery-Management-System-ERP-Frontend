"use client";

import { Calculator, ChevronLeft, ChevronRight, Download, ReceiptText, Search, Trophy, WalletCards } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  formatBdt,
  formatDate,
  getCategorySnapshot,
  getExpenseSnapshot,
  INITIAL_CATEGORY_SNAPSHOT,
  INITIAL_EXPENSE_SNAPSHOT,
  parseCategories,
  parseExpenses,
  subscribeToExpenseData,
  suppliers,
} from "./purchase-expense-data";
import { SuiteHeader } from "./suite-components";
import styles from "./purchase-expense-suite.module.css";

type Filters = { from: string; to: string; category: string; supplier: string };
const defaultFilters: Filters = { from: "2025-04-01", to: "2025-04-30", category: "All Categories", supplier: "All Suppliers" };
const PAGE_SIZE = 6;

export function PurchaseExpenseReport() {
  const categorySnapshot = useSyncExternalStore(subscribeToExpenseData, getCategorySnapshot, () => INITIAL_CATEGORY_SNAPSHOT);
  const expenseSnapshot = useSyncExternalStore(subscribeToExpenseData, getExpenseSnapshot, () => INITIAL_EXPENSE_SNAPSHOT);
  const categories = useMemo(() => parseCategories(categorySnapshot), [categorySnapshot]);
  const expenses = useMemo(() => parseExpenses(expenseSnapshot), [expenseSnapshot]);
  const [draftFilters, setDraftFilters] = useState<Filters>({ ...defaultFilters });
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters });
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => expenses
    .filter((expense) => expense.date >= filters.from && expense.date <= filters.to)
    .filter((expense) => filters.category === "All Categories" || expense.category === filters.category)
    .filter((expense) => filters.supplier === "All Suppliers" || expense.supplier === filters.supplier)
    .sort((left, right) => right.date.localeCompare(left.date)), [expenses, filters]);
  const total = filtered.reduce((sum, expense) => sum + expense.amount, 0);
  const highest = filtered.reduce((maximum, expense) => Math.max(maximum, expense.amount), 0);
  const average = filtered.length ? total / filtered.length : 0;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draftFilters.from > draftFilters.to) {
      setMessage("From Date must be before To Date.");
      return;
    }
    setFilters({ ...draftFilters });
    setPage(1);
    setMessage("Report filters applied.");
  }

  function exportCsv() {
    const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const rows = [["Date", "Category", "Supplier", "Reference No", "Amount (BDT)", "Remarks"], ...filtered.map((expense) => [formatDate(expense.date), expense.category, expense.supplier, expense.referenceNo, expense.amount, expense.remarks])];
    const url = URL.createObjectURL(new Blob([`\uFEFF${rows.map((row) => row.map(quote).join(",")).join("\n")}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `purchase-expense-report-${filters.from}-${filters.to}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage("Purchase expense report exported as CSV.");
  }

  return (
    <div className={styles.page}>
      <SuiteHeader action={<button className={styles.primaryButton} disabled={!filtered.length} onClick={exportCsv} type="button"><Download size={16} />Export</button>} title="Purchase Expense Report" />
      <Card as="form" className={styles.filters} onSubmit={search}>
        <label className={styles.control}><span>From Date</span><input className="field" max={draftFilters.to} onChange={(event) => setDraftFilters((current) => ({ ...current, from: event.target.value }))} type="date" value={draftFilters.from} /></label>
        <label className={styles.control}><span>To Date</span><input className="field" min={draftFilters.from} onChange={(event) => setDraftFilters((current) => ({ ...current, to: event.target.value }))} type="date" value={draftFilters.to} /></label>
        <label className={styles.control}><span>Category</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, category: event.target.value }))} value={draftFilters.category}><option>All Categories</option>{categories.map((category) => <option key={category.id}>{category.name}</option>)}<option>Other</option></select></label>
        <label className={styles.control}><span>Supplier</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, supplier: event.target.value }))} value={draftFilters.supplier}><option>All Suppliers</option>{suppliers.map((supplier) => <option key={supplier}>{supplier}</option>)}</select></label>
        <button className={styles.primaryButton} type="submit"><Search size={16} />Search</button>
      </Card>
      <p aria-live="polite" className={message ? styles.feedback : "sr-only"}>{message}</p>

      <section aria-label="Purchase expense summary" className={styles.metrics}>
        <Card className={`${styles.metric} ${styles.metricBlue}`}><span><ReceiptText /></span><div><small>Total Expense</small><strong>{formatBdt(total)}</strong></div></Card>
        <Card className={`${styles.metric} ${styles.metricGreen}`}><span><WalletCards /></span><div><small>Total Transactions</small><strong>{filtered.length}</strong></div></Card>
        <Card className={`${styles.metric} ${styles.metricOrange}`}><span><Trophy /></span><div><small>Highest Expense</small><strong>{formatBdt(highest)}</strong></div></Card>
        <Card className={`${styles.metric} ${styles.metricPurple}`}><span><Calculator /></span><div><small>Average Expense</small><strong>{formatBdt(average)}</strong></div></Card>
      </section>

      <Card className={styles.tableCard}>
        <div className={styles.tableScroller}><table className={styles.table}><caption className="sr-only">Purchase expense report results</caption><thead><tr><th scope="col">SL</th><th scope="col">Date</th><th scope="col">Category</th><th scope="col">Supplier</th><th scope="col">Reference No</th><th scope="col">Amount (৳)</th><th scope="col">Remarks</th></tr></thead><tbody>{visible.map((expense, index) => <tr key={expense.id}><td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td><td>{formatDate(expense.date)}</td><td>{expense.category}</td><td>{expense.supplier || "-"}</td><td className={styles.reference}>{expense.referenceNo}</td><td>{formatBdt(expense.amount).replace("৳ ", "")}</td><td>{expense.remarks || "-"}</td></tr>)}{!visible.length ? <tr><td className={styles.emptyState} colSpan={7}>No expenses match the selected filters.</td></tr> : null}</tbody></table></div>
        <footer className={styles.tableFooter}><p>Showing {filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} entries</p><nav aria-label="Purchase expense report pagination" className={styles.pagination}><button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} type="button"><ChevronLeft size={16} /></button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button aria-current={number === currentPage ? "page" : undefined} className={number === currentPage ? styles.currentPage : ""} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}<button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} type="button"><ChevronRight size={16} /></button></nav></footer>
      </Card>
    </div>
  );
}
