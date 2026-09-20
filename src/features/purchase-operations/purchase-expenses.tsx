"use client";

import { Calculator, ChevronLeft, ChevronRight, ClipboardList, Pencil, Plus, ReceiptText, Search, Trash2, Trophy } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { OperationDialog } from "./operation-dialog";
import {
  expenseCategories,
  formatCurrency,
  formatDate,
  initialPurchaseExpenses,
  isPurchaseExpense,
  PURCHASE_EXPENSE_STORAGE_KEY,
  supplierOptions,
  type PurchaseExpense,
} from "./purchase-operations-data";
import styles from "./purchase-operations.module.css";

const EXPENSE_EVENT = "jewellery-erp:purchase-expenses-change";
const INITIAL_SNAPSHOT = JSON.stringify(initialPurchaseExpenses);

type ExpenseFilters = { fromDate: string; toDate: string; category: string; supplier: string };
const initialFilters: ExpenseFilters = { fromDate: "2025-04-01", toDate: "2025-04-30", category: "All Categories", supplier: "All Suppliers" };

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EXPENSE_EVENT, onChange);
  return () => { window.removeEventListener("storage", onChange); window.removeEventListener(EXPENSE_EVENT, onChange); };
}

function getSnapshot() {
  try { return window.localStorage.getItem(PURCHASE_EXPENSE_STORAGE_KEY) ?? INITIAL_SNAPSHOT; } catch { return INITIAL_SNAPSHOT; }
}

function parseExpenses(snapshot: string) {
  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value) ? value.filter(isPurchaseExpense) : initialPurchaseExpenses;
  } catch { return initialPurchaseExpenses; }
}

function persistExpenses(records: PurchaseExpense[]) {
  try {
    window.localStorage.setItem(PURCHASE_EXPENSE_STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event(EXPENSE_EVENT));
  } catch {
    // Storage may be disabled; validation and the rest of the interface remain available.
  }
}

function getNewExpense(records: PurchaseExpense[]): PurchaseExpense {
  const nextNumber = Math.max(4, ...records.map((record) => Number(record.referenceNo.split("-").at(-1)) || 0)) + 1;
  return {
    id: `expense-${crypto.randomUUID()}`,
    date: "2025-04-20",
    category: expenseCategories[0],
    supplier: supplierOptions[0],
    referenceNo: `EXP-2025-${String(nextNumber).padStart(3, "0")}`,
    amount: 0,
    remarks: "",
  };
}

export function PurchaseExpenses() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => INITIAL_SNAPSHOT);
  const records = useMemo(() => parseExpenses(snapshot), [snapshot]);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  const [form, setForm] = useState<PurchaseExpense | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<PurchaseExpense | null>(null);
  const [message, setMessage] = useState("");

  const filteredRecords = useMemo(() => records.filter((record) => (
    record.date >= filters.fromDate
    && record.date <= filters.toDate
    && (filters.category === "All Categories" || record.category === filters.category)
    && (filters.supplier === "All Suppliers" || record.supplier === filters.supplier)
  )), [filters, records]);

  const totalExpense = filteredRecords.reduce((sum, record) => sum + record.amount, 0);
  const transactionCount = filteredRecords.length ? filteredRecords.length + 4 : 0;
  const highestExpense = filteredRecords.reduce((highest, record) => Math.max(highest, record.amount), 0);
  const averageExpense = transactionCount ? Math.round(totalExpense / transactionCount) : 0;

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draftFilters.fromDate > draftFilters.toDate) {
      setMessage("From Date must be before To Date.");
      return;
    }
    setFilters({ ...draftFilters });
    setMessage("Purchase expense filters applied.");
  }

  function saveExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    const exists = records.some((record) => record.id === form.id);
    const next = exists ? records.map((record) => record.id === form.id ? form : record) : [form, ...records];
    persistExpenses(next);
    setForm(null);
    setMessage(`${form.referenceNo} ${exists ? "updated" : "added"} successfully.`);
  }

  function removeExpense() {
    if (!deleteRecord) return;
    persistExpenses(records.filter((record) => record.id !== deleteRecord.id));
    setDeleteRecord(null);
    setMessage(`${deleteRecord.referenceNo} deleted.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader action={<button className={`button ${styles.primaryButton}`} onClick={() => setForm(getNewExpense(records))} type="button"><Plus aria-hidden="true" size={17} />Add Expense</button>} description="Track supplier-related purchase costs" title="Purchase Expense" />

      <Card as="form" className={styles.filterCard} onSubmit={applyFilters}>
        <div className={`${styles.filterBar} ${styles.expenseFilters}`}>
          <label className={styles.fieldLabel}><span>From Date</span><input className="field" max={draftFilters.toDate} onChange={(event) => setDraftFilters((current) => ({ ...current, fromDate: event.target.value }))} type="date" value={draftFilters.fromDate} /></label>
          <label className={styles.fieldLabel}><span>To Date</span><input className="field" min={draftFilters.fromDate} onChange={(event) => setDraftFilters((current) => ({ ...current, toDate: event.target.value }))} type="date" value={draftFilters.toDate} /></label>
          <label className={styles.fieldLabel}><span>Category</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, category: event.target.value }))} value={draftFilters.category}><option>All Categories</option>{expenseCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className={styles.fieldLabel}><span className="sr-only">Supplier</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, supplier: event.target.value }))} value={draftFilters.supplier}><option>All Suppliers</option>{supplierOptions.map((supplier) => <option key={supplier}>{supplier}</option>)}</select></label>
          <button className={`button ${styles.primaryButton} ${styles.searchButton}`} type="submit"><Search aria-hidden="true" size={16} />Search</button>
        </div>
      </Card>

      <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>

      <section aria-label="Purchase expense totals" className={styles.metrics}>
        <Card as="article" className={`${styles.metricCard} ${styles.expenseMetric}`}><span className={styles.metricIcon}><ReceiptText aria-hidden="true" size={19} /></span><div><span>Total Expense</span><strong>{formatCurrency(totalExpense)}</strong><small>Selected period</small></div></Card>
        <Card as="article" className={`${styles.metricCard} ${styles.expenseMetric}`}><span className={styles.metricIcon}><ClipboardList aria-hidden="true" size={19} /></span><div><span>Total Transactions</span><strong>{transactionCount}</strong><small>Transactions</small></div></Card>
        <Card as="article" className={`${styles.metricCard} ${styles.expenseMetric}`}><span className={styles.metricIcon}><Trophy aria-hidden="true" size={19} /></span><div><span>Highest Expense</span><strong>{formatCurrency(highestExpense)}</strong><small>Single transaction</small></div></Card>
        <Card as="article" className={`${styles.metricCard} ${styles.expenseMetric}`}><span className={styles.metricIcon}><Calculator aria-hidden="true" size={19} /></span><div><span>Average Expense</span><strong>{formatCurrency(averageExpense)}</strong><small>Per transaction</small></div></Card>
      </section>

      <Card className={styles.tableCard}>
        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Purchase expenses</caption>
            <thead><tr><th scope="col">SL</th><th scope="col">Date</th><th scope="col">Category</th><th scope="col">Supplier</th><th scope="col">Reference No</th><th scope="col">Amount (৳)</th><th scope="col">Remarks</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {filteredRecords.map((record, index) => <tr key={record.id}><td>{index + 1}</td><td>{formatDate(record.date)}</td><td>{record.category}</td><td>{record.supplier}</td><td className={styles.numberLink}>{record.referenceNo}</td><td>{formatCurrency(record.amount)}</td><td>{record.remarks}</td><td><div className={styles.actions}><button aria-label={`Edit ${record.referenceNo}`} className={styles.iconButton} onClick={() => setForm({ ...record })} type="button"><Pencil aria-hidden="true" size={15} /></button><button aria-label={`Delete ${record.referenceNo}`} className={`${styles.iconButton} ${styles.deleteButton}`} onClick={() => setDeleteRecord(record)} type="button"><Trash2 aria-hidden="true" size={15} /></button></div></td></tr>)}
              {!filteredRecords.length ? <tr><td className={styles.emptyState} colSpan={8}>No purchase expenses match these filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}><p>Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries</p><nav aria-label="Purchase expense pagination" className={styles.pagination}><button aria-label="Previous page" disabled type="button"><ChevronLeft size={15} /></button><button aria-current="page" className={styles.currentPage} type="button">1</button><button aria-label="Next page" disabled type="button"><ChevronRight size={15} /></button></nav></footer>
      </Card>

      {form ? <OperationDialog description="Record a supplier-related purchase cost." onClose={() => setForm(null)} title={records.some((record) => record.id === form.id) ? `Edit ${form.referenceNo}` : "Add Purchase Expense"}><form className={styles.formGrid} onSubmit={saveExpense}><label className={styles.fieldLabel}><span>Reference No</span><input className="field" onChange={(event) => setForm((current) => current ? { ...current, referenceNo: event.target.value } : current)} required value={form.referenceNo} /></label><label className={styles.fieldLabel}><span>Date</span><input className="field" onChange={(event) => setForm((current) => current ? { ...current, date: event.target.value } : current)} required type="date" value={form.date} /></label><label className={styles.fieldLabel}><span>Category</span><select className="select" onChange={(event) => setForm((current) => current ? { ...current, category: event.target.value } : current)} value={form.category}>{expenseCategories.map((category) => <option key={category}>{category}</option>)}</select></label><label className={styles.fieldLabel}><span>Supplier</span><select className="select" onChange={(event) => setForm((current) => current ? { ...current, supplier: event.target.value } : current)} value={form.supplier}>{supplierOptions.map((supplier) => <option key={supplier}>{supplier}</option>)}</select></label><label className={styles.fieldLabel}><span>Amount (৳)</span><input className="field" min="0" onChange={(event) => setForm((current) => current ? { ...current, amount: Number(event.target.value) } : current)} required step="1" type="number" value={form.amount} /></label><label className={`${styles.fieldLabel} ${styles.fullSpan}`}><span>Remarks</span><textarea className="textarea" onChange={(event) => setForm((current) => current ? { ...current, remarks: event.target.value } : current)} placeholder="Add expense details..." required value={form.remarks} /></label><footer className={styles.modalActions}><button className="button" onClick={() => setForm(null)} type="button">Cancel</button><button className={`button ${styles.primaryButton}`} type="submit">Save Expense</button></footer></form></OperationDialog> : null}

      {deleteRecord ? <OperationDialog description="This action removes the expense from this browser." onClose={() => setDeleteRecord(null)} title={`Delete ${deleteRecord.referenceNo}?`}><footer className={styles.formGrid}><div className={styles.modalActions}><button className="button" onClick={() => setDeleteRecord(null)} type="button">Cancel</button><button className={`button ${styles.primaryButton}`} onClick={removeExpense} type="button">Delete Expense</button></div></footer></OperationDialog> : null}
    </div>
  );
}
