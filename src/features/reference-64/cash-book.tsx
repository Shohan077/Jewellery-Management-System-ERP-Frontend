"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, CircleDollarSign, FilePenLine, Landmark, Plus, Search, Trash2, TrendingDown, TrendingUp, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Feedback, IconAction, Modal } from "@/features/reference-55/shared";
import base from "@/features/reference-55/reference-55.module.css";
import { cashFlowSeries, cashTransactionSeed, type CashTransaction, type CashTransactionKind } from "./data";
import { LineChart, MetricCard, PanelHeading, ResponsiveTable } from "./shared";
import styles from "./reference-64.module.css";

type CashDialog = { mode: "add" | "edit"; row?: CashTransaction } | null;

function amount(value: number) {
  return value ? new Intl.NumberFormat("en-IN").format(value) : "-";
}

function recalculateBalances(rows: CashTransaction[]) {
  let running = 0;
  return rows.map((row) => {
    if (row.type === "Opening") running = row.balance;
    else running += row.cashIn - row.cashOut;
    return { ...row, balance: running };
  });
}

export function Reference64CashBook() {
  const [rows, setRows] = useState<CashTransaction[]>(cashTransactionSeed);
  const [type, setType] = useState("All Types");
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<CashDialog>(null);
  const [message, setMessage] = useState("");

  const visibleRows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => (type === "All Types" || row.type === type) && (!needle || `${row.particulars} ${row.paymentMethod}`.toLowerCase().includes(needle)));
  }, [query, rows, type]);

  function saveTransaction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const kind = String(form.get("type")) as CashTransactionKind;
    const transactionAmount = Math.max(0, Number(form.get("amount")) || 0);
    const id = dialog?.row?.id ?? Math.max(0, ...rows.map((row) => row.id)) + 1;
    const next: CashTransaction = {
      id,
      date: "18 May, 2024",
      particulars: String(form.get("particulars")),
      type: kind,
      cashIn: kind === "Income" ? transactionAmount : 0,
      cashOut: kind === "Expense" ? transactionAmount : 0,
      balance: kind === "Opening" ? transactionAmount : 0,
      paymentMethod: String(form.get("paymentMethod")) as CashTransaction["paymentMethod"],
    };
    setRows((current) => recalculateBalances(dialog?.mode === "edit" ? current.map((row) => row.id === id ? next : row) : [...current, next]));
    setMessage(`${next.particulars} ${dialog?.mode === "edit" ? "updated" : "added"}.`);
    setDialog(null);
  }

  function removeTransaction(row: CashTransaction) {
    setRows((current) => recalculateBalances(current.filter((item) => item.id !== row.id)));
    setMessage(`${row.particulars} removed from the cash book.`);
  }

  return (
    <div className={styles.page}>
      <section className={styles.fourMetrics}>
        <MetricCard accent="green" icon={<WalletCards size={18} />} label="Opening Balance" value="৳ 1,25,650" />
        <MetricCard icon={<TrendingUp size={18} />} label="Total Cash In" note="12 Transactions" value="৳ 3,45,800" />
        <MetricCard accent="orange" icon={<TrendingDown size={18} />} label="Total Cash Out" note="18 Transactions" value="৳ 2,78,450" />
        <MetricCard accent="green" icon={<CircleDollarSign size={18} />} label="Closing Balance" value="৳ 1,93,000" />
      </section>

      <Card className={styles.cashToolbar}>
        <label className={styles.dateField}>
          <span className="sr-only">Transaction date range</span>
          <input aria-label="Transaction date range" defaultValue="May 18, 2024 - May 18, 2024" />
          <CalendarDays size={13} />
        </label>
        <select aria-label="Transaction type" onChange={(event) => setType(event.target.value)} value={type}>
          <option>All Types</option><option>Income</option><option>Expense</option><option>Opening</option>
        </select>
        <label className={styles.searchField}>
          <span className="sr-only">Search transactions</span>
          <input onChange={(event) => setQuery(event.target.value)} placeholder="Search particulars..." type="search" value={query} />
          <Search size={13} />
        </label>
        <span className={styles.toolbarSpacer} />
        <button className={base.primaryButton} onClick={() => setDialog({ mode: "add" })} type="button"><Plus size={12} />Add Transaction</button>
      </Card>

      {message ? <Feedback>{message}</Feedback> : null}

      <Card className={styles.tableCard}>
        <ResponsiveTable label="Cash book transactions" minWidth={965}>
          <thead><tr><th>#</th><th>Date</th><th>Particulars</th><th>Type</th><th className={styles.numeric}>Cash In (৳)</th><th className={styles.numeric}>Cash Out (৳)</th><th className={styles.numeric}>Balance (৳)</th><th>Payment Method</th><th className={styles.centered}>Action</th></tr></thead>
          <tbody>
            {visibleRows.length ? visibleRows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td><td>{row.date}</td><td>{row.particulars}</td>
                <td><span className={row.type === "Income" ? styles.income : row.type === "Expense" ? styles.expense : styles.muted}>{row.type === "Opening" ? "-" : row.type}</span></td>
                <td className={styles.numeric}>{amount(row.cashIn)}</td><td className={styles.numeric}>{amount(row.cashOut)}</td><td className={styles.numeric}>{amount(row.balance)}</td><td>{row.paymentMethod}</td>
                <td className={styles.centered}><span className={base.rowActions}><IconAction label={`Edit ${row.particulars}`} onClick={() => setDialog({ mode: "edit", row })}><FilePenLine size={12} /></IconAction><IconAction danger label={`Delete ${row.particulars}`} onClick={() => removeTransaction(row)}><Trash2 size={12} /></IconAction></span></td>
              </tr>
            )) : <tr><td className={styles.emptyCell} colSpan={9}>No transactions match the selected filters.</td></tr>}
          </tbody>
        </ResponsiveTable>
      </Card>

      <section className={styles.cashBottom}>
        <MetricCard icon={<Landmark size={18} />} label="Today’s Cash In" note="12 Transactions" value="৳ 3,45,800" />
        <MetricCard accent="orange" icon={<CircleDollarSign size={18} />} label="Today’s Cash Out" note="18 Transactions" value="৳ 2,78,450" />
        <Card className={styles.chartCard}>
          <PanelHeading>Cash Flow <small>(This Week)</small></PanelHeading>
          <LineChart labels={["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"]} max={400} series={cashFlowSeries} ticks={[{ value: 400, label: "400K" }, { value: 300, label: "300K" }, { value: 200, label: "200K" }, { value: 100, label: "100K" }, { value: 0, label: "0" }]} />
        </Card>
      </section>

      {dialog ? (
        <Modal onClose={() => setDialog(null)} title={dialog.mode === "add" ? "Add Transaction" : "Edit Transaction"}>
          <form className={base.formGrid} onSubmit={saveTransaction}>
            <label className={base.fullField}><span>Particulars</span><input defaultValue={dialog.row?.particulars} name="particulars" required /></label>
            <label><span>Transaction Type</span><select defaultValue={dialog.row?.type ?? "Income"} name="type"><option>Income</option><option>Expense</option><option>Opening</option></select></label>
            <label><span>Amount (৳)</span><input defaultValue={dialog.row ? dialog.row.type === "Opening" ? dialog.row.balance : dialog.row.cashIn || dialog.row.cashOut : ""} min="0" name="amount" required type="number" /></label>
            <label className={base.fullField}><span>Payment Method</span><select defaultValue={dialog.row?.paymentMethod === "-" ? "Cash" : dialog.row?.paymentMethod ?? "Cash"} name="paymentMethod"><option>Cash</option><option>Bank</option><option>Card</option><option>-</option></select></label>
            <footer className={base.modalActions}><button className={base.secondaryButton} onClick={() => setDialog(null)} type="button">Cancel</button><button className={base.primaryButton} type="submit">Save Transaction</button></footer>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

