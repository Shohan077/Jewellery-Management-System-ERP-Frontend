"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  BriefcaseBusiness,
  Eye,
  MapPin,
  Plus,
  Printer,
  ReceiptText,
  Search,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  baseLedgerTransactions,
  formatKarigarDate,
  formatTaka,
  getKarigarProfile,
  karigarFinanceProfiles,
  karigarInitials,
  karigarLedgerTabs,
  paymentToLedgerTransaction,
  tabMatchesTransaction,
  type KarigarLedgerTab,
  type KarigarLedgerTransaction,
} from "./karigar-finance-data";
import styles from "./karigar-finance.module.css";
import { useKarigarFinancePayments } from "./use-karigar-finance-payments";

type LedgerFilters = {
  karigarId: string;
  dateFrom: string;
  dateTo: string;
};

type LedgerRow = KarigarLedgerTransaction & { balance: number };

const INITIAL_FILTERS: LedgerFilters = {
  karigarId: "K-001",
  dateFrom: "2025-01-01",
  dateTo: "2025-04-30",
};

const TYPE_CLASSES = {
  Work: styles.workBadge,
  Payment: styles.paymentBadge,
  "Material Issue": styles.issueBadge,
  "Material Return": styles.returnBadge,
} satisfies Record<KarigarLedgerTransaction["type"], string>;

function Metric({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: typeof BriefcaseBusiness;
  label: string;
  tone: "green" | "blue" | "orange" | "purple";
  value: string;
}) {
  return (
    <Card as="article" className={styles.ledgerMetric}>
      <span className={`${styles.metricIcon} ${styles[tone]}`}><Icon aria-hidden="true" size={18} /></span>
      <div><span>{label}</span><strong>{value}</strong></div>
    </Card>
  );
}

export function KarigarLedger() {
  const savedPayments = useKarigarFinancePayments();
  const [draftFilters, setDraftFilters] = useState<LedgerFilters>(INITIAL_FILTERS);
  const [filters, setFilters] = useState<LedgerFilters>(INITIAL_FILTERS);
  const [activeTab, setActiveTab] = useState<KarigarLedgerTab>("All Transactions");
  const [selectedRow, setSelectedRow] = useState<LedgerRow | null>(null);
  const [message, setMessage] = useState("");

  const profile = getKarigarProfile(filters.karigarId);
  const savedForKarigar = savedPayments.filter((payment) => payment.karigarId === filters.karigarId);

  const ledger = useMemo(() => {
    const matchingSaved = savedPayments.filter((payment) => payment.karigarId === filters.karigarId);
    const savedPaymentNumbers = new Set(matchingSaved.map((payment) => payment.paymentNo));
    const transactions = [
      ...baseLedgerTransactions.filter((transaction) => (
        transaction.karigarId === filters.karigarId
        && !(transaction.type === "Payment" && savedPaymentNumbers.has(transaction.referenceNo))
      )),
      ...matchingSaved.map(paymentToLedgerTransaction),
    ].sort((first, second) => first.date.localeCompare(second.date) || first.referenceNo.localeCompare(second.referenceNo));

    let balance = 0;
    return transactions.map((transaction) => {
      balance += transaction.debit - transaction.credit;
      return { ...transaction, balance };
    });
  }, [filters.karigarId, savedPayments]);

  const datedRows = ledger.filter((row) => row.date >= filters.dateFrom && row.date <= filters.dateTo);
  const visibleRows = datedRows.filter((row) => tabMatchesTransaction(activeTab, row.type));
  const totals = visibleRows.reduce((result, row) => ({
    debit: result.debit + row.debit,
    credit: result.credit + row.credit,
  }), { debit: 0, credit: 0 });
  const endingBalance = visibleRows.length ? visibleRows.at(-1)?.balance ?? 0 : 0;
  const addedPayments = savedForKarigar.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPayment = profile.totalPayment + addedPayments;
  const currentDue = Math.max(0, profile.workValue - totalPayment);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draftFilters.dateFrom > draftFilters.dateTo) {
      setMessage("Date From must be earlier than Date To.");
      return;
    }
    setFilters({ ...draftFilters });
    setActiveTab("All Transactions");
    setMessage("Ledger updated for the selected karigar and date range.");
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Karigar Ledger</h1>
          <nav aria-label="Breadcrumb"><Link href="/dashboard">Home</Link><span aria-hidden="true">›</span><Link href="/karigars">Karigar Management</Link><span aria-hidden="true">›</span><span aria-current="page">Karigar Ledger</span></nav>
        </div>
        <div className={styles.headerActions}>
          <Link className={styles.addPaymentButton} href="/karigar-management/payments/new"><Plus aria-hidden="true" size={15} />Add Payment</Link>
          <button className={styles.printButton} onClick={() => window.print()} type="button"><Printer aria-hidden="true" size={14} />Print Ledger</button>
        </div>
      </header>

      <Card as="form" className={styles.ledgerFilterCard} onSubmit={applyFilters}>
        <label><span>Select Karigar</span><select onChange={(event) => setDraftFilters((current) => ({ ...current, karigarId: event.target.value }))} value={draftFilters.karigarId}>{karigarFinanceProfiles.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.code})</option>)}</select></label>
        <div className={styles.dateFilters}>
          <label><span>Date From</span><input max={draftFilters.dateTo} onChange={(event) => setDraftFilters((current) => ({ ...current, dateFrom: event.target.value }))} type="date" value={draftFilters.dateFrom} /></label>
          <label><span>Date To</span><input min={draftFilters.dateFrom} onChange={(event) => setDraftFilters((current) => ({ ...current, dateTo: event.target.value }))} type="date" value={draftFilters.dateTo} /></label>
          <button className={styles.filterButton} type="submit"><Search aria-hidden="true" size={14} />Filter</button>
        </div>
      </Card>

      <section className={styles.ledgerOverview}>
        <Card as="article" className={styles.compactProfile}>
          <span aria-hidden="true" className={styles.avatar}>{karigarInitials(profile.name)}</span>
          <div><strong>{profile.name}</strong><small>{profile.code}</small><span><MapPin aria-hidden="true" size={11} />{profile.address}</span></div>
        </Card>
        <div className={styles.metricsGrid}>
          <Metric icon={BriefcaseBusiness} label="Total Work Value" tone="green" value={`৳ ${formatTaka(profile.workValue)}`} />
          <Metric icon={WalletCards} label="Total Payment" tone="blue" value={`৳ ${formatTaka(totalPayment)}`} />
          <Metric icon={ReceiptText} label="Current Due" tone="orange" value={`৳ ${formatTaka(currentDue)}`} />
          <Metric icon={BookOpenCheck} label="Total Orders" tone="purple" value={String(profile.totalOrders)} />
        </div>
      </section>

      <Card className={styles.ledgerTableCard}>
        <div className={styles.tabs} role="tablist" aria-label="Ledger transaction categories">
          {karigarLedgerTabs.map((tab) => <button aria-selected={activeTab === tab} className={activeTab === tab ? styles.activeTab : ""} key={tab} onClick={() => setActiveTab(tab)} role="tab" type="button">{tab}</button>)}
        </div>
        <div className={styles.tableScroller}>
          <table className={styles.ledgerTable}>
            <caption className="sr-only">Karigar ledger transactions</caption>
            <thead><tr><th scope="col">SL</th><th scope="col">Date</th><th scope="col">Type</th><th scope="col">Reference No</th><th scope="col">Description</th><th scope="col">Debit (৳)</th><th scope="col">Credit (৳)</th><th scope="col">Balance (৳)</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {visibleRows.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td><td>{formatKarigarDate(row.date)}</td><td><span className={`${styles.typeBadge} ${TYPE_CLASSES[row.type]}`}>{row.type}</span></td><td>{row.referenceNo}</td><td>{row.description}</td><td>{row.debit ? formatTaka(row.debit) : "-"}</td><td>{row.credit ? formatTaka(row.credit) : "-"}</td><td>{formatTaka(row.balance)}</td><td><button aria-label={`View ${row.referenceNo}`} className={styles.viewButton} onClick={() => setSelectedRow(row)} type="button"><Eye aria-hidden="true" size={13} /></button></td>
                </tr>
              ))}
              {!visibleRows.length ? <tr><td className={styles.emptyState} colSpan={9}>No transactions match the selected filters.</td></tr> : null}
            </tbody>
            {visibleRows.length ? <tfoot><tr><th colSpan={5} scope="row">Total</th><td>{formatTaka(totals.debit)}</td><td>{formatTaka(totals.credit)}</td><td>{formatTaka(endingBalance)}</td><td /></tr></tfoot> : null}
          </table>
        </div>
      </Card>

      <p aria-live="polite" className={message ? styles.toast : "sr-only"}>{message}</p>

      {selectedRow ? (
        <div className={styles.dialogBackdrop} onMouseDown={(event) => { if (event.currentTarget === event.target) setSelectedRow(null); }}>
          <Card aria-labelledby="transaction-title" aria-modal="true" className={styles.dialog} role="dialog">
            <header><div><h2 id="transaction-title">Transaction Details</h2><p>{selectedRow.referenceNo}</p></div><button aria-label="Close transaction details" onClick={() => setSelectedRow(null)} type="button"><X size={17} /></button></header>
            <dl>
              <div><dt>Date</dt><dd>{formatKarigarDate(selectedRow.date)}</dd></div><div><dt>Type</dt><dd><span className={`${styles.typeBadge} ${TYPE_CLASSES[selectedRow.type]}`}>{selectedRow.type}</span></dd></div><div><dt>Description</dt><dd>{selectedRow.description}</dd></div><div><dt>Debit</dt><dd>৳ {formatTaka(selectedRow.debit)}</dd></div><div><dt>Credit</dt><dd>৳ {formatTaka(selectedRow.credit)}</dd></div><div><dt>Balance</dt><dd>৳ {formatTaka(selectedRow.balance)}</dd></div><div className={styles.dialogNote}><dt>Note</dt><dd>{selectedRow.note}</dd></div>
            </dl>
            <footer><button className={styles.filterButton} onClick={() => setSelectedRow(null)} type="button">Close</button></footer>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
