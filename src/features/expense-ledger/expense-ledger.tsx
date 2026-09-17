"use client";

import {
  CalendarDays,
  Eye,
  FilePenLine,
  Filter,
  Plus,
  ReceiptText,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  expenseCategories,
  expenseKpis,
  formatExpenseAmount,
  formatExpenseCurrency,
  formatExpenseDate,
  initialLedgerExpenses,
  paymentMethods,
  type ExpenseCategory,
  type LedgerExpense,
  type PaymentMethod,
  type PaymentStatus,
} from "./expense-ledger-data";
import styles from "./expense-ledger.module.css";

const PAGE_SIZE = 10;

type ExpenseDraft = {
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  notes: string;
};

type DialogState =
  | { mode: "add" }
  | { mode: "edit"; expense: LedgerExpense }
  | { mode: "view"; expense: LedgerExpense }
  | { mode: "delete"; expense: LedgerExpense }
  | null;

function emptyDraft(): ExpenseDraft {
  return {
    date: "2025-04-30",
    category: "Rent",
    description: "",
    amount: "",
    paymentMethod: "Bank",
    status: "Paid",
    notes: "",
  };
}

function draftFromExpense(expense: LedgerExpense): ExpenseDraft {
  return {
    date: expense.date,
    category: expense.category,
    description: expense.description,
    amount: String(expense.amount),
    paymentMethod: expense.paymentMethod,
    status: expense.status,
    notes: expense.notes,
  };
}

function paginationItems(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

function isApril2025(date: string): boolean {
  return date >= "2025-04-01" && date <= "2025-04-30";
}

export function ExpenseLedger() {
  const [expenses, setExpenses] = useState<LedgerExpense[]>(initialLedgerExpenses);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [dateFrom, setDateFrom] = useState("2025-04-01");
  const [dateTo, setDateTo] = useState("2025-04-30");
  const [dateFilterActive, setDateFilterActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [draft, setDraft] = useState<ExpenseDraft>(emptyDraft);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [totalDelta, setTotalDelta] = useState(0);
  const [monthDelta, setMonthDelta] = useState(0);
  const [pendingDelta, setPendingDelta] = useState(0);

  const filteredExpenses = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    return expenses.filter((expense) => {
      const matchesSearch = !search || [
        expense.voucherNo,
        expense.category,
        expense.description,
        expense.paymentMethod,
      ].some((value) => value.toLowerCase().includes(search));
      const matchesDate = !dateFilterActive || (expense.date >= dateFrom && expense.date <= dateTo);
      return matchesSearch && matchesDate;
    });
  }, [dateFilterActive, dateFrom, dateTo, deferredQuery, expenses]);

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const firstIndex = filteredExpenses.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const lastIndex = Math.min(safePage * PAGE_SIZE, filteredExpenses.length);
  const pageExpenses = filteredExpenses.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function updateDraft<Key extends keyof ExpenseDraft>(key: Key, value: ExpenseDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function openAddDialog() {
    setDraft(emptyDraft());
    setFormError("");
    setDialog({ mode: "add" });
  }

  function openEditDialog(expense: LedgerExpense) {
    setDraft(draftFromExpense(expense));
    setFormError("");
    setDialog({ mode: "edit", expense });
  }

  function closeDialog() {
    setDialog(null);
    setFormError("");
  }

  function registerKpiChange(previous: LedgerExpense | null, next: LedgerExpense | null) {
    const previousAmount = previous?.amount ?? 0;
    const nextAmount = next?.amount ?? 0;
    setTotalDelta((current) => current + nextAmount - previousAmount);

    const previousMonth = previous && isApril2025(previous.date) ? previous.amount : 0;
    const nextMonth = next && isApril2025(next.date) ? next.amount : 0;
    setMonthDelta((current) => current + nextMonth - previousMonth);

    const previousPending = previous?.status === "Pending" ? previous.amount : 0;
    const nextPending = next?.status === "Pending" ? next.amount : 0;
    setPendingDelta((current) => current + nextPending - previousPending);
  }

  function saveExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(draft.amount);
    if (!draft.description.trim()) {
      setFormError("Enter an expense description.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Enter an amount greater than zero.");
      return;
    }

    if (dialog?.mode === "edit") {
      const updated: LedgerExpense = {
        ...dialog.expense,
        ...draft,
        description: draft.description.trim(),
        notes: draft.notes.trim(),
        amount,
      };
      setExpenses((current) => current.map((expense) => expense.id === updated.id ? updated : expense));
      registerKpiChange(dialog.expense, updated);
      setMessage(`${updated.voucherNo} updated successfully.`);
    } else {
      const nextSequence = expenses.reduce((largest, expense) => {
        const numericPart = Number(expense.voucherNo.replace(/\D/g, ""));
        return Number.isFinite(numericPart) ? Math.max(largest, numericPart) : largest;
      }, 0) + 1;
      const voucherNo = `EXP-${String(nextSequence).padStart(3, "0")}`;
      const created: LedgerExpense = {
        id: voucherNo,
        voucherNo,
        ...draft,
        description: draft.description.trim(),
        notes: draft.notes.trim(),
        amount,
      };
      setExpenses((current) => [created, ...current]);
      registerKpiChange(null, created);
      setCurrentPage(1);
      setMessage(`${voucherNo} added successfully.`);
    }

    closeDialog();
  }

  function deleteExpense(expense: LedgerExpense) {
    setExpenses((current) => current.filter((item) => item.id !== expense.id));
    registerKpiChange(expense, null);
    setMessage(`${expense.voucherNo} deleted.`);
    closeDialog();
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={
          <button className="button button--primary" onClick={openAddDialog} type="button">
            <Plus aria-hidden="true" size={16} />
            Add Expense
          </button>
        }
        description="Track and manage business expenses"
        title="Expense Management"
      />

      <section aria-label="Expense summary" className={styles.summaryGrid}>
        <Card className={styles.summaryCard}>
          <p>Total Expenses</p>
          <strong>{formatExpenseCurrency(expenseKpis.total + totalDelta)}</strong>
          <span className={styles.negative}>↓ 8%</span>
        </Card>
        <Card className={styles.summaryCard}>
          <p>This Month</p>
          <strong className={styles.blue}>{formatExpenseCurrency(expenseKpis.thisMonth + monthDelta)}</strong>
        </Card>
        <Card className={styles.summaryCard}>
          <p>Last Month</p>
          <strong>{formatExpenseCurrency(expenseKpis.lastMonth)}</strong>
        </Card>
        <Card className={styles.summaryCard}>
          <p>Pending Bills</p>
          <strong className={styles.negative}>{formatExpenseCurrency(expenseKpis.pendingBills + pendingDelta)}</strong>
        </Card>
      </section>

      <section aria-label="Expense filters" className={styles.filterBar}>
        <label className={styles.searchField}>
          <Search aria-hidden="true" size={17} />
          <span className="sr-only">Search expenses</span>
          <input
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by description, category or voucher no..."
            type="search"
            value={query}
          />
        </label>
        <div className={styles.dateRange}>
          <CalendarDays aria-hidden="true" size={16} />
          <label>
            <span className="sr-only">Start date</span>
            <input
              max={dateTo}
              onChange={(event) => {
                setDateFrom(event.target.value);
                setCurrentPage(1);
              }}
              type="date"
              value={dateFrom}
            />
          </label>
          <span aria-hidden="true">–</span>
          <label>
            <span className="sr-only">End date</span>
            <input
              min={dateFrom}
              onChange={(event) => {
                setDateTo(event.target.value);
                setCurrentPage(1);
              }}
              type="date"
              value={dateTo}
            />
          </label>
        </div>
        <button
          aria-pressed={dateFilterActive}
          className={styles.filterButton}
          onClick={() => {
            setDateFilterActive((active) => !active);
            setCurrentPage(1);
            setMessage(dateFilterActive ? "Date filter cleared." : "Date filter applied.");
          }}
          type="button"
        >
          <Filter aria-hidden="true" size={15} />
          {dateFilterActive ? "Clear" : "Filter"}
        </button>
      </section>

      <Card className={styles.tableCard}>
        <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>
        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Business expense ledger</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Voucher No</th>
                <th scope="col">Category</th>
                <th scope="col">Description</th>
                <th scope="col">Amount (৳)</th>
                <th scope="col">Payment Mode</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageExpenses.map((expense, index) => (
                <tr key={expense.id}>
                  <td>{firstIndex + index}</td>
                  <td>{formatExpenseDate(expense.date)}</td>
                  <td className={styles.voucher}>{expense.voucherNo}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td className={styles.amount}>{formatExpenseAmount(expense.amount)}</td>
                  <td>{expense.paymentMethod}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <button aria-label={`View ${expense.voucherNo}`} onClick={() => setDialog({ mode: "view", expense })} title="View expense" type="button"><Eye size={14} /></button>
                      <button aria-label={`Edit ${expense.voucherNo}`} onClick={() => openEditDialog(expense)} title="Edit expense" type="button"><FilePenLine size={14} /></button>
                      <button aria-label={`Delete ${expense.voucherNo}`} className={styles.deleteAction} onClick={() => setDialog({ mode: "delete", expense })} title="Delete expense" type="button"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageExpenses.length === 0 ? (
                <tr><td className={styles.emptyState} colSpan={8}>No expenses match the selected filters.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <footer className={styles.footer}>
        <p>Showing {firstIndex} to {lastIndex} of {filteredExpenses.length} expenses</p>
        <nav aria-label="Expense pages" className={styles.pagination}>
          <button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button">«</button>
          {paginationItems(safePage, totalPages).map((item, index) => item === "ellipsis" ? (
            <span aria-hidden="true" key={`ellipsis-${index}`}>…</span>
          ) : (
            <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.activePage : ""} key={item} onClick={() => setCurrentPage(item)} type="button">{item}</button>
          ))}
          <button aria-label="Next page" disabled={safePage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} type="button">»</button>
        </nav>
      </footer>

      {dialog?.mode === "add" || dialog?.mode === "edit" ? (
        <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
          <Card aria-labelledby="expense-form-title" aria-modal="true" as="section" className={styles.dialog} role="dialog">
            <div className={styles.dialogHeader}>
              <div>
                <h2 id="expense-form-title">{dialog.mode === "edit" ? "Edit Expense" : "Add Expense"}</h2>
                <p>{dialog.mode === "edit" ? `Update ${dialog.expense.voucherNo}` : "Record a new business expense."}</p>
              </div>
              <button aria-label="Close expense form" className={styles.closeButton} onClick={closeDialog} type="button"><X size={19} /></button>
            </div>
            <form className={styles.form} onSubmit={saveExpense}>
              <div className={styles.formGrid}>
                <label><span>Date <b>*</b></span><input className="field" onChange={(event) => updateDraft("date", event.target.value)} required type="date" value={draft.date} /></label>
                <label><span>Category <b>*</b></span><select className="select" onChange={(event) => updateDraft("category", event.target.value as ExpenseCategory)} value={draft.category}>{expenseCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
                <label className={styles.fullWidth}><span>Description <b>*</b></span><input autoFocus className="field" onChange={(event) => updateDraft("description", event.target.value)} placeholder="Enter expense description" required value={draft.description} /></label>
                <label><span>Amount (৳) <b>*</b></span><input className="field" min="1" onChange={(event) => updateDraft("amount", event.target.value)} required type="number" value={draft.amount} /></label>
                <label><span>Payment Mode <b>*</b></span><select className="select" onChange={(event) => updateDraft("paymentMethod", event.target.value as PaymentMethod)} value={draft.paymentMethod}>{paymentMethods.map((method) => <option key={method}>{method}</option>)}</select></label>
                <label><span>Payment Status</span><select className="select" onChange={(event) => updateDraft("status", event.target.value as PaymentStatus)} value={draft.status}><option>Paid</option><option>Pending</option></select></label>
                <label className={styles.fullWidth}><span>Notes</span><textarea className="textarea" onChange={(event) => updateDraft("notes", event.target.value)} placeholder="Enter notes (optional)..." value={draft.notes} /></label>
              </div>
              <p aria-live="assertive" className={formError ? styles.formError : "sr-only"}>{formError}</p>
              <div className={styles.dialogActions}>
                <button className="button" onClick={closeDialog} type="button">Cancel</button>
                <button className="button button--primary" type="submit"><ReceiptText size={16} />{dialog.mode === "edit" ? "Save Changes" : "Add Expense"}</button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}

      {dialog?.mode === "view" ? (
        <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
          <Card aria-labelledby="expense-details-title" aria-modal="true" as="section" className={styles.dialog} role="dialog">
            <div className={styles.dialogHeader}>
              <div><h2 id="expense-details-title">Expense Details</h2><p>{dialog.expense.voucherNo}</p></div>
              <button aria-label="Close expense details" className={styles.closeButton} onClick={closeDialog} type="button"><X size={19} /></button>
            </div>
            <dl className={styles.details}>
              <div><dt>Date</dt><dd>{formatExpenseDate(dialog.expense.date)}</dd></div>
              <div><dt>Category</dt><dd>{dialog.expense.category}</dd></div>
              <div><dt>Description</dt><dd>{dialog.expense.description}</dd></div>
              <div><dt>Amount</dt><dd>{formatExpenseCurrency(dialog.expense.amount)}</dd></div>
              <div><dt>Payment Mode</dt><dd>{dialog.expense.paymentMethod}</dd></div>
              <div><dt>Status</dt><dd><span className={dialog.expense.status === "Paid" ? styles.paid : styles.pending}>{dialog.expense.status}</span></dd></div>
              <div className={styles.fullWidth}><dt>Notes</dt><dd>{dialog.expense.notes || "No notes provided."}</dd></div>
            </dl>
            <div className={styles.dialogActions}><button className="button" onClick={closeDialog} type="button">Close</button><button className="button button--primary" onClick={() => openEditDialog(dialog.expense)} type="button"><FilePenLine size={15} />Edit Expense</button></div>
          </Card>
        </div>
      ) : null}

      {dialog?.mode === "delete" ? (
        <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
          <Card aria-labelledby="delete-expense-title" aria-modal="true" as="section" className={`${styles.dialog} ${styles.confirmDialog}`} role="alertdialog">
            <div className={styles.dialogHeader}>
              <div><h2 id="delete-expense-title">Delete {dialog.expense.voucherNo}?</h2><p>This action removes the expense from the ledger.</p></div>
              <button aria-label="Close delete confirmation" className={styles.closeButton} onClick={closeDialog} type="button"><X size={19} /></button>
            </div>
            <div className={styles.dialogActions}><button className="button" onClick={closeDialog} type="button">Cancel</button><button className={styles.dangerButton} onClick={() => deleteExpense(dialog.expense)} type="button"><Trash2 size={15} />Delete Expense</button></div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
