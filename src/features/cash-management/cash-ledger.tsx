"use client";

import { ArrowDown, ArrowUp, Download, Search, WalletCards } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  baseClosingBalance,
  baseTotalCashIn,
  baseTotalCashOut,
  EMPTY_CASH_SNAPSHOT,
  formatCashDate,
  formatMoney,
  getCashSnapshot,
  ledgerRows,
  openingBalance,
  parseCashTransactions,
  subscribeCash,
  type LedgerRow,
} from "./cash-data";
import styles from "./cash-management.module.css";

type Filters = { from: string; to: string; type: string; query: string };
const defaultFilters: Filters = { from: "2025-04-01", to: "2025-04-16", type: "All", query: "" };

export function CashLedger() {
  const snapshot = useSyncExternalStore(subscribeCash, getCashSnapshot, () => EMPTY_CASH_SNAPSHOT);
  const saved = useMemo(() => parseCashTransactions(snapshot), [snapshot]);
  const [draft, setDraft] = useState<Filters>(defaultFilters);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [message, setMessage] = useState("");

  const addedRows: LedgerRow[] = saved.map((item) => ({
    id: item.id,
    date: item.date,
    type: item.direction,
    reference: item.reference,
    description: item.party,
    cashIn: item.direction === "Cash In" ? item.amount : 0,
    cashOut: item.direction === "Cash Out" ? item.amount : 0,
  }));
  const allRows = [...ledgerRows, ...addedRows].sort((left, right) => left.date.localeCompare(right.date));
  const rowsWithBalance = allRows.reduce<{
    balance: number;
    rows: Array<LedgerRow & { balance: number }>;
  }>((result, row) => {
    const balance = row.type === "Opening Balance"
      ? result.balance
      : result.balance + row.cashIn - row.cashOut;
    return { balance, rows: [...result.rows, { ...row, balance }] };
  }, { balance: openingBalance, rows: [] }).rows;
  const filtered = rowsWithBalance.filter((row) => row.date >= filters.from && row.date <= filters.to)
    .filter((row) => filters.type === "All" || row.type === filters.type)
    .filter((row) => !filters.query || [row.reference, row.description, row.type].some((value) => value.toLowerCase().includes(filters.query.toLowerCase())));
  const savedIn = saved.filter((item) => item.direction === "Cash In").reduce((sum, item) => sum + item.amount, 0);
  const savedOut = saved.filter((item) => item.direction === "Cash Out").reduce((sum, item) => sum + item.amount, 0);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.from > draft.to) {
      setMessage("From Date must be before To Date.");
      return;
    }
    setFilters({ ...draft });
    setMessage("Ledger filters applied.");
  }

  function exportCsv() {
    const quote = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [["Date", "Type", "Reference No", "Description", "Cash In", "Cash Out", "Balance"], ...filtered.map((row) => [formatCashDate(row.date), row.type, row.reference, row.description, row.cashIn, row.cashOut, row.balance])].map((row) => row.map(quote).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `cash-ledger-${filters.from}-${filters.to}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Cash ledger exported as CSV.");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><h1>Cash Ledger</h1><p>Home <span>›</span> Accounts &amp; Cash <span>›</span> Cash Ledger</p></header>
      <Card as="form" className={styles.filterBar} onSubmit={applyFilters}>
        <label><span>From Date <b>*</b></span><input className="field" max={draft.to} onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))} type="date" value={draft.from} /></label>
        <label><span>To Date <b>*</b></span><input className="field" min={draft.from} onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))} type="date" value={draft.to} /></label>
        <label><span>Transaction Type</span><select className="select" onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value }))} value={draft.type}><option>All</option><option>Cash In</option><option>Cash Out</option><option>Opening Balance</option></select></label>
        <label><span>Search</span><div className={styles.searchField}><input onChange={(event) => setDraft((current) => ({ ...current, query: event.target.value }))} placeholder="Search reference, description..." type="search" value={draft.query} /><Search size={15} /></div></label>
        <button className={styles.primaryButton} type="submit"><Search size={15} />Search</button>
        <button className={styles.primaryButton} onClick={exportCsv} type="button"><Download size={15} />Export</button>
      </Card>

      <p aria-live="polite" className={message ? styles.formMessage : "sr-only"}>{message}</p>
      <section className={styles.kpiGrid}>
        <Card className={styles.kpi}><i className={styles.greenIcon}><WalletCards /></i><div><span>Opening Balance</span><strong>{formatMoney(openingBalance)}</strong></div></Card>
        <Card className={styles.kpi}><i className={styles.greenIcon}><ArrowDown /></i><div><span>Total Cash In</span><strong className={styles.greenText}>{formatMoney(baseTotalCashIn + savedIn)}</strong></div></Card>
        <Card className={styles.kpi}><i className={styles.redIcon}><ArrowUp /></i><div><span>Total Cash Out</span><strong className={styles.redText}>{formatMoney(baseTotalCashOut + savedOut)}</strong></div></Card>
        <Card className={styles.kpi}><i className={styles.blueIcon}><WalletCards /></i><div><span>Closing Balance</span><strong className={styles.blueText}>{formatMoney(baseClosingBalance + savedIn - savedOut)}</strong></div></Card>
      </section>

      <Card className={styles.tableCard}><div className={styles.tableScroller}><table className={styles.ledgerTable}><caption className="sr-only">Cash ledger transactions</caption><thead><tr><th>Date</th><th>Type</th><th>Reference No.</th><th>Description</th><th>Cash In (₹)</th><th>Cash Out (₹)</th><th>Balance (₹)</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id}><td>{formatCashDate(row.date)}</td><td><span className={`${styles.typeBadge} ${row.type === "Cash In" ? styles.inBadge : row.type === "Cash Out" ? styles.outBadge : ""}`}>{row.type}</span></td><td>{row.reference}</td><td>{row.description}</td><td>{row.cashIn ? formatMoney(row.cashIn).replace("₹ ", "") : "-"}</td><td>{row.cashOut ? formatMoney(row.cashOut).replace("₹ ", "") : "-"}</td><td>{formatMoney(row.balance).replace("₹ ", "")}</td></tr>)}{!filtered.length ? <tr><td className={styles.empty} colSpan={7}>No ledger rows match the selected filters.</td></tr> : null}</tbody><tfoot><tr><th colSpan={4}>Total</th><th>{formatMoney(baseTotalCashIn + savedIn).replace("₹ ", "")}</th><th>{formatMoney(baseTotalCashOut + savedOut).replace("₹ ", "")}</th><th /></tr></tfoot></table></div></Card>
    </div>
  );
}
