"use client";

import { Download, Mail, MapPin, Phone, Search } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  baseLedgerRows,
  formatInr,
  formatLedgerDate,
  parseSavedPayments,
  suppliers,
  SUPPLIER_PAYMENT_EVENT,
  SUPPLIER_PAYMENTS_STORAGE_KEY,
  type LedgerRow,
} from "./supplier-finance-data";
import styles from "./supplier-finance.module.css";

const EMPTY_SNAPSHOT = "[]";
const INITIAL_FILTERS = { supplier: "Shree Gems Suppliers", fromDate: "2025-04-01", toDate: "2025-05-20" };

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SUPPLIER_PAYMENT_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SUPPLIER_PAYMENT_EVENT, onChange);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(SUPPLIER_PAYMENTS_STORAGE_KEY) ?? EMPTY_SNAPSHOT;
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

function quoteCsv(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export function SupplierLedger() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_SNAPSHOT);
  const savedPayments = useMemo(() => parseSavedPayments(snapshot), [snapshot]);
  const [draftFilters, setDraftFilters] = useState(INITIAL_FILTERS);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [message, setMessage] = useState("");

  const ledger = useMemo(() => {
    if (filters.supplier !== "Shree Gems Suppliers") return [];
    const matchingPayments = savedPayments.filter((payment) => payment.supplier === filters.supplier);
    const savedReferences = new Set(matchingPayments.map((payment) => payment.referenceNo));
    const staticRows = baseLedgerRows.filter((row) => !savedReferences.has(row.referenceNo));
    const paymentRows: LedgerRow[] = matchingPayments.map((payment) => ({
      id: payment.id,
      date: payment.date,
      type: "Payment",
      referenceNo: payment.referenceNo,
      description: `Payment by ${payment.method}`,
      debit: 0,
      credit: payment.amount,
    }));
    let balance = 0;
    return [...staticRows, ...paymentRows]
      .sort((a, b) => a.date.localeCompare(b.date) || a.referenceNo.localeCompare(b.referenceNo))
      .map((row) => {
        balance += row.debit - row.credit;
        return { ...row, balance };
      });
  }, [filters.supplier, savedPayments]);

  const filteredRows = ledger.filter((row) => row.date >= filters.fromDate && row.date <= filters.toDate);
  const totalPurchase = ledger.reduce((sum, row) => sum + row.debit, 0);
  const visiblePayments = ledger.reduce((sum, row) => sum + row.credit, 0);
  const totalPayment = filters.supplier === "Shree Gems Suppliers" ? visiblePayments + 80_000 : visiblePayments;
  const dueAmount = Math.max(0, totalPurchase - totalPayment);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draftFilters.fromDate > draftFilters.toDate) {
      setMessage("From date must be before to date.");
      return;
    }
    setFilters({ ...draftFilters });
    setMessage(`${draftFilters.supplier} ledger updated for the selected period.`);
  }

  function exportLedger() {
    const headings = ["Date", "Type", "Reference No", "Description", "Debit", "Credit", "Balance"];
    const rows = filteredRows.map((row) => [
      formatLedgerDate(row.date), row.type, row.referenceNo, row.description, row.debit || "", row.credit || "", row.balance,
    ]);
    const csv = [headings, ...rows].map((row) => row.map(quoteCsv).join(",")).join("\n");
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    anchor.download = `supplier-ledger-${filters.fromDate}-${filters.toDate}.csv`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
    setMessage(`${filteredRows.length} ledger entries exported.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader description="Review supplier purchases, payments, and running balance" title="Supplier Ledger" />

      <Card as="form" className={styles.filterCard} onSubmit={applyFilters}>
        <div className={styles.ledgerFilters}>
          <label className={styles.fieldLabel}><span>Supplier <b>*</b></span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, supplier: event.target.value }))} value={draftFilters.supplier}>{suppliers.map((supplier) => <option key={supplier}>{supplier}</option>)}</select></label>
          <label className={styles.fieldLabel}><span>From Date</span><input className="field" max={draftFilters.toDate} onChange={(event) => setDraftFilters((current) => ({ ...current, fromDate: event.target.value }))} type="date" value={draftFilters.fromDate} /></label>
          <label className={styles.fieldLabel}><span>To Date</span><input className="field" min={draftFilters.fromDate} onChange={(event) => setDraftFilters((current) => ({ ...current, toDate: event.target.value }))} type="date" value={draftFilters.toDate} /></label>
          <button className={`button ${styles.primaryButton}`} type="submit"><Search aria-hidden="true" size={16} />Search</button>
          <button className={`button ${styles.exportButton}`} onClick={exportLedger} type="button"><Download aria-hidden="true" size={16} />Export</button>
        </div>
      </Card>

      <p aria-live="polite" className={`${styles.message} ${message ? "" : "sr-only"}`}>{message}</p>

      <section className={styles.ledgerSummary}>
        <Card as="article" className={styles.supplierCard}>
          <div aria-hidden="true" className={styles.avatar}>SG</div>
          <div className={styles.supplierIdentity}>
            <div><h2>{filters.supplier}</h2><span className={styles.activeBadge}>Active</span></div>
            <p><MapPin aria-hidden="true" size={14} />123, Jewel Street,<br />Zaveri Bazaar, Mumbai - 400002</p>
            <p><Phone aria-hidden="true" size={14} />+91 98765 43210</p>
            <p><Mail aria-hidden="true" size={14} />shreegems@gmail.com</p>
          </div>
        </Card>
        <div className={styles.metricGrid}>
          <Card as="article" className={styles.ledgerMetric}><span>Total Purchase</span><strong className={styles.purchaseValue}>{formatInr(totalPurchase)}</strong></Card>
          <Card as="article" className={styles.ledgerMetric}><span>Total Payment</span><strong className={styles.paymentValue}>{formatInr(totalPayment)}</strong></Card>
          <Card as="article" className={styles.ledgerMetric}><span>Due Amount</span><strong className={styles.dueValue}>{formatInr(dueAmount)}</strong></Card>
        </div>
      </section>

      <Card className={styles.ledgerTableCard}>
        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Supplier ledger transactions</caption>
            <thead><tr><th scope="col">Date</th><th scope="col">Type</th><th scope="col">Reference No</th><th scope="col">Description</th><th scope="col">Debit (₹)</th><th scope="col">Credit (₹)</th><th scope="col">Balance (₹)</th></tr></thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td>{formatLedgerDate(row.date)}</td><td>{row.type}</td><td className={styles.reference}>{row.referenceNo}</td><td>{row.description}</td>
                  <td>{row.debit ? formatInr(row.debit) : "-"}</td><td>{row.credit ? formatInr(row.credit) : "-"}</td><td className={styles.balance}>{formatInr(row.balance)}</td>
                </tr>
              ))}
              {!filteredRows.length ? <tr><td className={styles.emptyState} colSpan={7}>No ledger entries match the selected filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.ledgerTotal}><span>Current Due Amount (₹)</span><strong>{formatInr(dueAmount)}</strong></footer>
      </Card>
    </div>
  );
}
