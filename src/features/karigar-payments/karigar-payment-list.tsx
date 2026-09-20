"use client";

import {
  Banknote,
  CalendarCheck2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Download,
  Eye,
  HandCoins,
  MoreHorizontal,
  RotateCcw,
  Search,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  KARIGAR_PAYMENTS_STORAGE_EVENT,
  KARIGAR_PAYMENTS_STORAGE_KEY,
  formatTaka,
  initialKarigarPayments,
  isKarigarPaymentRecord,
  karigarNames,
  karigarPaymentBaselineMetrics,
  type KarigarPaymentRecord,
} from "./karigar-payment-data";
import styles from "./karigar-payments.module.css";

const PAGE_SIZE = 8;
const EMPTY_SNAPSHOT = "[]";
const REPORTING_FROM = "2025-04-01";
const REPORTING_TO = "2025-04-12";

type AppliedFilters = {
  from: string;
  to: string;
  karigar: string;
} | null;

type Feedback = { tone: "error" | "success"; message: string } | null;

function subscribeToPayments(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(KARIGAR_PAYMENTS_STORAGE_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(KARIGAR_PAYMENTS_STORAGE_EVENT, handleChange);
  };
}

function getPaymentsSnapshot() {
  return window.localStorage.getItem(KARIGAR_PAYMENTS_STORAGE_KEY) ?? EMPTY_SNAPSHOT;
}

function parseSavedPayments(snapshot: string) {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter(isKarigarPaymentRecord) : [];
  } catch {
    return [];
  }
}

function mergePayments(saved: KarigarPaymentRecord[]) {
  const savedNumbers = new Set(saved.map((record) => record.paymentNo));
  return [...saved, ...initialKarigarPayments.filter((record) => !savedNumbers.has(record.paymentNo))]
    .sort((first, second) => second.dateIso.localeCompare(first.dateIso)
      || first.paymentNo.localeCompare(second.paymentNo, undefined, { numeric: true }));
}

function visiblePages(currentPage: number, pageCount: number) {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);
  let start = Math.max(1, currentPage - 2);
  start = Math.min(start, pageCount - 4);
  return Array.from({ length: 5 }, (_, index) => start + index);
}

function paymentMetrics(saved: KarigarPaymentRecord[]) {
  const originals = new Map(initialKarigarPayments.map((record) => [record.paymentNo, record]));
  let totalPayments = karigarPaymentBaselineMetrics.totalPayments;
  let paidThisMonth = karigarPaymentBaselineMetrics.paidThisMonth;
  let totalDue = karigarPaymentBaselineMetrics.totalDue;

  saved.forEach((record) => {
    const original = originals.get(record.paymentNo);
    if (!original) totalPayments += 1;

    const recordInMonth = record.dateIso >= REPORTING_FROM && record.dateIso <= REPORTING_TO;
    const originalInMonth = original
      ? original.dateIso >= REPORTING_FROM && original.dateIso <= REPORTING_TO
      : false;
    if (recordInMonth) paidThisMonth += record.paidAmount;
    if (originalInMonth && original) paidThisMonth -= original.paidAmount;

    totalDue += record.dueAmount - (original?.dueAmount ?? 0);
  });

  return {
    totalPayments,
    paidThisMonth: Math.max(0, paidThisMonth),
    totalDue: Math.max(0, totalDue),
    activeKarigars: karigarPaymentBaselineMetrics.activeKarigars,
  };
}

function downloadReceipt(record: KarigarPaymentRecord) {
  const receipt = [
    "Jewellery ERP — Karigar Payment Receipt",
    `Payment No: ${record.paymentNo}`,
    `Date: ${record.date}`,
    `Karigar: ${record.karigar}`,
    `Reference: ${record.reference}`,
    `Paid Amount: BDT ${formatTaka(record.paidAmount)}`,
    `Due Amount: BDT ${formatTaka(record.dueAmount)}`,
    `Method: ${record.method}`,
    `Status: ${record.status}`,
    record.remarks ? `Remarks: ${record.remarks}` : "",
  ].filter(Boolean).join("\n");
  const url = URL.createObjectURL(new Blob([receipt], { type: "text/plain;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${record.paymentNo}-receipt.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function PaymentStatus({ record }: { record: KarigarPaymentRecord }) {
  return (
    <span className={`${styles.statusBadge} ${record.status === "Paid" ? styles.paid : styles.partial}`}>
      {record.status}
    </span>
  );
}

function PaymentDetails({
  onClose,
  onDownload,
  onSettle,
  record,
}: {
  onClose: () => void;
  onDownload: () => void;
  onSettle: () => void;
  record: KarigarPaymentRecord;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("button")?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} ref={dialogRef}>
      <Card aria-describedby="payment-details-description" aria-labelledby="payment-details-title" aria-modal="true" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div>
            <h2 id="payment-details-title">{record.paymentNo}</h2>
            <p id="payment-details-description">Karigar payment details and settlement summary</p>
          </div>
          <button aria-label="Close payment details" onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button>
        </header>
        <div className={styles.modalBody}>
          <div className={styles.detailsHero}>
            <span aria-hidden="true"><HandCoins size={22} /></span>
            <div><small>Karigar</small><strong>{record.karigar}</strong></div>
            <PaymentStatus record={record} />
          </div>
          <dl className={styles.detailsGrid}>
            <div><dt>Date</dt><dd>{record.date}</dd></div>
            <div><dt>Reference</dt><dd>{record.reference}</dd></div>
            <div><dt>Labour Amount</dt><dd>৳ {formatTaka(record.labourAmount)}</dd></div>
            <div><dt>Bonus</dt><dd>৳ {formatTaka(record.bonus)}</dd></div>
            <div><dt>Deduction</dt><dd>৳ {formatTaka(record.deduction)}</dd></div>
            <div><dt>Previous Due</dt><dd>৳ {formatTaka(record.previousDue)}</dd></div>
            <div><dt>Paid Amount</dt><dd>৳ {formatTaka(record.paidAmount)}</dd></div>
            <div><dt>Due Amount</dt><dd>৳ {formatTaka(record.dueAmount)}</dd></div>
            <div><dt>Method</dt><dd>{record.method}</dd></div>
          </dl>
          {record.remarks ? <p className={styles.detailsRemarks}><strong>Remarks</strong>{record.remarks}</p> : null}
          <footer className={styles.modalActions}>
            <button className="button" onClick={onDownload} type="button"><Download aria-hidden="true" size={15} />Receipt</button>
            {record.status === "Partial" ? <button className="button button--primary" onClick={onSettle} type="button"><CheckCircle2 aria-hidden="true" size={15} />Settle Due</button> : null}
          </footer>
        </div>
      </Card>
    </div>
  );
}

export function KarigarPaymentList() {
  const snapshot = useSyncExternalStore(
    subscribeToPayments,
    getPaymentsSnapshot,
    () => EMPTY_SNAPSHOT,
  );
  const savedPayments = useMemo(() => parseSavedPayments(snapshot), [snapshot]);
  const records = useMemo(() => mergePayments(savedPayments), [savedPayments]);
  const metrics = useMemo(() => paymentMetrics(savedPayments), [savedPayments]);

  const [fromDate, setFromDate] = useState(REPORTING_FROM);
  const [toDate, setToDate] = useState(REPORTING_TO);
  const [karigar, setKarigar] = useState("All Karigar");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(null);
  const [page, setPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<KarigarPaymentRecord | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const filteredRecords = useMemo(() => {
    if (!appliedFilters) return records;
    return records.filter((record) => record.dateIso >= appliedFilters.from
      && record.dateIso <= appliedFilters.to
      && (appliedFilters.karigar === "All Karigar" || record.karigar === appliedFilters.karigar));
  }, [appliedFilters, records]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleRecords = filteredRecords.slice(start, start + PAGE_SIZE);

  function searchPayments() {
    if (!fromDate || !toDate) {
      setFeedback({ tone: "error", message: "Choose both a from date and a to date." });
      return;
    }
    if (fromDate > toDate) {
      setFeedback({ tone: "error", message: "The from date must be before the to date." });
      return;
    }
    setAppliedFilters({ from: fromDate, to: toDate, karigar });
    setPage(1);
    setFeedback({ tone: "success", message: "Karigar payment filters applied." });
  }

  function clearFilters() {
    setFromDate(REPORTING_FROM);
    setToDate(REPORTING_TO);
    setKarigar("All Karigar");
    setAppliedFilters(null);
    setPage(1);
    setFeedback({ tone: "success", message: "Filters cleared. All karigar payments are shown." });
  }

  function persistPayment(record: KarigarPaymentRecord) {
    try {
      const stored = parseSavedPayments(window.localStorage.getItem(KARIGAR_PAYMENTS_STORAGE_KEY) ?? EMPTY_SNAPSHOT);
      const next = [record, ...stored.filter((item) => item.paymentNo !== record.paymentNo)];
      window.localStorage.setItem(KARIGAR_PAYMENTS_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(KARIGAR_PAYMENTS_STORAGE_EVENT));
      setSelectedPayment((current) => current?.paymentNo === record.paymentNo ? record : current);
      setFeedback({ tone: "success", message: `${record.paymentNo} has been fully settled.` });
    } catch {
      setFeedback({ tone: "error", message: `${record.paymentNo} could not be updated in browser storage.` });
    }
  }

  function settlePayment(record: KarigarPaymentRecord) {
    if (record.dueAmount <= 0) return;
    persistPayment({
      ...record,
      paidAmount: record.paidAmount + record.dueAmount,
      dueAmount: 0,
      status: "Paid",
    });
  }

  return (
    <div className={styles.listPage}>
      <PageHeader description="View all karigar payment records" title="Karigar Payment List" />

      <section aria-label="Karigar payment summary" className={styles.kpiGrid}>
        <Card className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <div><span>Total Payments</span><strong>{metrics.totalPayments}</strong><small>Payments</small></div><CalendarCheck2 aria-hidden="true" />
        </Card>
        <Card className={`${styles.kpiCard} ${styles.kpiBlue}`}>
          <div><span>Paid This Month</span><strong>৳ {formatTaka(metrics.paidThisMonth)}</strong></div><WalletCards aria-hidden="true" />
        </Card>
        <Card className={`${styles.kpiCard} ${styles.kpiPurple}`}>
          <div><span>Total Due</span><strong>৳ {formatTaka(metrics.totalDue)}</strong></div><Banknote aria-hidden="true" />
        </Card>
        <Card className={`${styles.kpiCard} ${styles.kpiAmber}`}>
          <div><span>Active Karigars</span><strong>{metrics.activeKarigars}</strong><small>Karigars</small></div><UsersRound aria-hidden="true" />
        </Card>
      </section>

      <Card className={styles.listCard}>
        <div className={styles.filterBar}>
          <label className={styles.control}><span>From Date</span><input className="field" onChange={(event) => { setFromDate(event.target.value); setFeedback(null); }} type="date" value={fromDate} /></label>
          <label className={styles.control}><span>To Date</span><input className="field" onChange={(event) => { setToDate(event.target.value); setFeedback(null); }} type="date" value={toDate} /></label>
          <label className={styles.control}><span>Karigar</span><select className="select" onChange={(event) => { setKarigar(event.target.value); setFeedback(null); }} value={karigar}><option>All Karigar</option>{karigarNames.map((name) => <option key={name}>{name}</option>)}</select></label>
          <button className="button button--primary" onClick={searchPayments} type="button"><Search aria-hidden="true" size={16} />Search</button>
        </div>

        <p
          aria-live="polite"
          className={feedback ? `${styles.feedback} ${styles[feedback.tone]} ${styles.listFeedback}` : "sr-only"}
          role={feedback?.tone === "error" ? "alert" : "status"}
        >
          {feedback?.tone === "success" ? <CheckCircle2 aria-hidden="true" size={16} /> : <CircleAlert aria-hidden="true" size={16} />}
          {feedback?.message ?? ""}
          {appliedFilters ? <button onClick={clearFilters} type="button"><RotateCcw aria-hidden="true" size={14} />Clear filters</button> : null}
        </p>

        <div className={styles.tableScroller}>
          <table className={styles.paymentTable}>
            <caption className="sr-only">Karigar payment records</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Payment No</th><th scope="col">Date</th><th scope="col">Karigar</th><th scope="col">Reference</th><th scope="col">Paid Amount (৳)</th><th scope="col">Due Amount (৳)</th><th scope="col">Method</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {visibleRecords.map((record, index) => (
                <tr key={record.id}>
                  <td>{start + index + 1}</td>
                  <td><strong>{record.paymentNo}</strong></td>
                  <td>{record.date}</td>
                  <td>{record.karigar}</td>
                  <td>{record.reference}</td>
                  <td>{formatTaka(record.paidAmount)}</td>
                  <td>{formatTaka(record.dueAmount)}</td>
                  <td>{record.method}</td>
                  <td><PaymentStatus record={record} /></td>
                  <td className={styles.actionCell}>
                    <details className={styles.actionMenu}>
                      <summary aria-label={`Actions for ${record.paymentNo}`} title={`Actions for ${record.paymentNo}`}><MoreHorizontal aria-hidden="true" size={17} /></summary>
                      <div role="menu">
                        <button onClick={(event) => { setSelectedPayment(record); event.currentTarget.closest("details")?.removeAttribute("open"); }} role="menuitem" type="button"><Eye aria-hidden="true" size={14} />View details</button>
                        <button onClick={(event) => { downloadReceipt(record); event.currentTarget.closest("details")?.removeAttribute("open"); }} role="menuitem" type="button"><Download aria-hidden="true" size={14} />Download receipt</button>
                        {record.status === "Partial" ? <button onClick={(event) => { settlePayment(record); event.currentTarget.closest("details")?.removeAttribute("open"); }} role="menuitem" type="button"><CheckCircle2 aria-hidden="true" size={14} />Settle due</button> : null}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
              {visibleRecords.length === 0 ? <tr><td className={styles.emptyState} colSpan={10}><strong>No karigar payments found</strong><span>Adjust the date range or karigar and search again.</span><button className="button" onClick={clearFilters} type="button">Clear filters</button></td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>

      <footer className={styles.listFooter}>
        <p>Showing {filteredRecords.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filteredRecords.length)} of {filteredRecords.length} records</p>
        <nav aria-label="Karigar payment pagination" className={styles.pagination}>
          <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={16} /></button>
          {visiblePages(currentPage, pageCount).map((number) => <button aria-current={number === currentPage ? "page" : undefined} className={number === currentPage ? styles.currentPage : ""} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}
          <button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight aria-hidden="true" size={16} /></button>
        </nav>
      </footer>

      {selectedPayment ? (
        <PaymentDetails
          onClose={() => setSelectedPayment(null)}
          onDownload={() => downloadReceipt(selectedPayment)}
          onSettle={() => settlePayment(selectedPayment)}
          record={selectedPayment}
        />
      ) : null}
    </div>
  );
}
