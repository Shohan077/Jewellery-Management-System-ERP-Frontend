"use client";

import { Building2, Mail, MapPin, Phone, Printer, Search } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  aminSupplier,
  formatStatementDate,
  formatStatementMoney,
  statementRows,
  supplierOptions,
} from "./supplier-statement-data";
import styles from "./supplier-statement.module.css";

const INITIAL_FILTERS = {
  supplier: "Amin Jewellery Supply",
  fromDate: "2025-04-01",
  toDate: "2025-04-30",
};

export function SupplierStatement() {
  const [draftFilters, setDraftFilters] = useState(INITIAL_FILTERS);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [message, setMessage] = useState("");

  const isAminSupplier = filters.supplier === aminSupplier.name;
  const rows = useMemo(
    () => isAminSupplier
      ? statementRows.filter((row) => row.date >= filters.fromDate && row.date <= filters.toDate)
      : [],
    [filters.fromDate, filters.toDate, isAminSupplier],
  );

  function viewStatement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draftFilters.fromDate > draftFilters.toDate) {
      setMessage("From date must be earlier than the to date.");
      return;
    }
    setFilters({ ...draftFilters });
    setMessage(`Statement refreshed for ${draftFilters.supplier}.`);
  }

  function printStatement() {
    setMessage("Statement is ready to print.");
    window.print();
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className={`button ${styles.printButton}`} onClick={printStatement} type="button">
            <Printer aria-hidden="true" size={16} />
            Print Statement
          </button>
        )}
        description="Review supplier purchases, payments, and closing balance"
        title="Supplier Statement"
      />

      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <span>Home</span><b aria-hidden="true">›</b><span>Purchase</span><b aria-hidden="true">›</b><strong>Supplier Statement</strong>
      </nav>

      <Card as="form" className={styles.filters} onSubmit={viewStatement}>
        <label>
          <span>Supplier <b>*</b></span>
          <select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, supplier: event.target.value }))} value={draftFilters.supplier}>
            {supplierOptions.map((supplier) => <option key={supplier}>{supplier}</option>)}
          </select>
        </label>
        <label>
          <span>From Date <b>*</b></span>
          <input className="field" max={draftFilters.toDate} onChange={(event) => setDraftFilters((current) => ({ ...current, fromDate: event.target.value }))} required type="date" value={draftFilters.fromDate} />
        </label>
        <label>
          <span>To Date <b>*</b></span>
          <input className="field" min={draftFilters.fromDate} onChange={(event) => setDraftFilters((current) => ({ ...current, toDate: event.target.value }))} required type="date" value={draftFilters.toDate} />
        </label>
        <button className={`button ${styles.viewButton}`} type="submit"><Search aria-hidden="true" size={16} />View Statement</button>
      </Card>

      <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>

      <Card className={styles.statementCard}>
        <section className={styles.supplierSummary}>
          <div className={styles.identity}>
            <div aria-hidden="true" className={styles.avatar}><Building2 size={23} /></div>
            <div className={styles.profile}>
              <div className={styles.nameLine}>
                <h2>{filters.supplier}</h2>
                {isAminSupplier ? <span>Active</span> : null}
              </div>
              {isAminSupplier ? (
                <address>
                  <p><MapPin aria-hidden="true" size={14} />{aminSupplier.address}</p>
                  <p><Phone aria-hidden="true" size={14} />{aminSupplier.phone}</p>
                  <p><Mail aria-hidden="true" size={14} />{aminSupplier.email}</p>
                </address>
              ) : <p className={styles.unavailable}>No saved account profile is available for this supplier.</p>}
            </div>
          </div>

          <dl className={styles.financialSummary}>
            <div><dt>Opening Balance</dt><dd>{formatStatementMoney(isAminSupplier ? aminSupplier.openingBalance : 0)}</dd></div>
            <div><dt>Total Purchase</dt><dd>{formatStatementMoney(isAminSupplier ? aminSupplier.totalPurchase : 0)}</dd></div>
            <div><dt>Total Payment</dt><dd>{formatStatementMoney(isAminSupplier ? aminSupplier.totalPayment : 0)}</dd></div>
            <div className={styles.closingRow}><dt>Closing Balance</dt><dd>{formatStatementMoney(isAminSupplier ? aminSupplier.closingBalance : 0)}</dd></div>
          </dl>
        </section>

        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Supplier statement transactions from {formatStatementDate(filters.fromDate)} to {formatStatementDate(filters.toDate)}</caption>
            <thead>
              <tr><th scope="col">SL</th><th scope="col">Date</th><th scope="col">Type</th><th scope="col">Reference No</th><th scope="col">Description</th><th scope="col">Debit (৳)</th><th scope="col">Credit (৳)</th><th scope="col">Balance (৳)</th></tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>{formatStatementDate(row.date)}</td>
                  <td><span className={`${styles.typeBadge} ${row.type === "Payment" ? styles.paymentType : styles.purchaseType}`}>{row.type}</span></td>
                  <td className={styles.reference}>{row.referenceNo}</td>
                  <td>{row.description}</td>
                  <td className={styles.money}>{row.debit ? formatStatementMoney(row.debit) : "-"}</td>
                  <td className={styles.money}>{row.credit ? formatStatementMoney(row.credit) : "-"}</td>
                  <td className={`${styles.money} ${styles.balance}`}>{formatStatementMoney(row.balance)}</td>
                </tr>
              ))}
              {!rows.length ? <tr><td className={styles.empty} colSpan={8}>No statement entries match the selected filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
