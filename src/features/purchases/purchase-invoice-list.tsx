"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FilePenLine,
  Filter,
  Plus,
  Search,
  Upload,
} from "lucide-react";
import { useDeferredValue, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  formatPurchaseCurrency,
  purchaseInvoices,
  type PurchaseInvoice,
  type PurchasePaymentStatus,
} from "./purchase-data";
import styles from "./purchase-invoice-list.module.css";

const PAGE_SIZE = 10;
const stageTabs = ["All", "Draft", "Posted", "Returned"] as const;
const paymentFilters = ["All", "Paid", "Partial", "Due"] as const;
type StageFilter = (typeof stageTabs)[number];
type PaymentFilter = (typeof paymentFilters)[number];

function getPaginationItems(current: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", pageCount];
  if (current >= pageCount - 3) return [1, "ellipsis", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", pageCount];
}

function exportPurchases(records: PurchaseInvoice[]) {
  const header = ["Invoice No", "Date", "Supplier", "Total Amount", "Payment Status", "Stage"];
  const rows = records.map((record) => [
    record.invoiceNo,
    record.date,
    record.supplier,
    String(record.totalAmount),
    record.paymentStatus,
    record.stage,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "purchase-invoices.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function PurchasePaymentBadge({ status }: { status: PurchasePaymentStatus }) {
  if (status === "Partial") return <span className={styles.partialBadge}>Partial</span>;
  return <StatusBadge status={status} />;
}

export function PurchaseInvoiceList() {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [stage, setStage] = useState<StageFilter>("All");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("All");
  const [dateFrom, setDateFrom] = useState("2025-04-01");
  const [dateTo, setDateTo] = useState("2025-04-30");
  const [datePanelOpen, setDatePanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [activityMessage, setActivityMessage] = useState("");

  const stageCounts = useMemo(() => {
    const counts = { Draft: 0, Posted: 0, Returned: 0 };
    for (const invoice of purchaseInvoices) {
      if (invoice.stage !== "Pending") counts[invoice.stage] += 1;
    }
    return counts;
  }, []);

  const filteredPurchases = useMemo(() => {
    const searchTerm = deferredQuery.trim().toLowerCase();
    return purchaseInvoices.filter((invoice) => {
      const matchesStage = stage === "All" || invoice.stage === stage;
      const matchesPayment = paymentFilter === "All" || invoice.paymentStatus === paymentFilter;
      const matchesDate = (!dateFrom || invoice.isoDate >= dateFrom) && (!dateTo || invoice.isoDate <= dateTo);
      const matchesSearch =
        searchTerm.length === 0 ||
        invoice.invoiceNo.toLowerCase().includes(searchTerm) ||
        invoice.supplier.toLowerCase().includes(searchTerm);
      return matchesStage && matchesPayment && matchesDate && matchesSearch;
    });
  }, [dateFrom, dateTo, deferredQuery, paymentFilter, stage]);

  const pageCount = Math.max(1, Math.ceil(filteredPurchases.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const pageRows = filteredPurchases.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);
  const firstVisible = filteredPurchases.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const lastVisible = Math.min(safeCurrentPage * PAGE_SIZE, filteredPurchases.length);
  const allPageRowsSelected = pageRows.length > 0 && pageRows.every((invoice) => selected.has(invoice.id));
  const paginationItems = getPaginationItems(safeCurrentPage, pageCount);

  function resetPageState() {
    setCurrentPage(1);
    setSelected(new Set());
  }

  function changeStage(nextStage: StageFilter) {
    setStage(nextStage);
    resetPageState();
  }

  function cyclePaymentFilter() {
    const currentIndex = paymentFilters.indexOf(paymentFilter);
    const nextFilter = paymentFilters[(currentIndex + 1) % paymentFilters.length];
    setPaymentFilter(nextFilter);
    resetPageState();
    setActivityMessage(nextFilter === "All" ? "Payment filter cleared." : `Showing ${nextFilter.toLowerCase()} purchase invoices.`);
  }

  function toggleAllPageRows() {
    setSelected((previous) => {
      const next = new Set(previous);
      if (allPageRowsSelected) {
        for (const invoice of pageRows) next.delete(invoice.id);
      } else {
        for (const invoice of pageRows) next.add(invoice.id);
      }
      return next;
    });
  }

  function toggleRow(id: number) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const contents = await file.text();
    const rowCount = Math.max(0, contents.split(/\r?\n/).filter(Boolean).length - 1);
    setActivityMessage(`${file.name} checked successfully: ${rowCount.toLocaleString("en-US")} data rows found.`);
    event.target.value = "";
  }

  function showAction(action: string, invoice: PurchaseInvoice) {
    setActivityMessage(`${action}: ${invoice.invoiceNo} from ${invoice.supplier}.`);
  }

  const dateLabel = dateFrom === "2025-04-01" && dateTo === "2025-04-30"
    ? "01 Apr 2025 - 30 Apr 2025"
    : `${dateFrom || "Any date"} - ${dateTo || "Any date"}`;

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <div className={styles.headerActions}>
            <input
              accept=".csv,text/csv"
              className="sr-only"
              onChange={handleImport}
              ref={importInputRef}
              type="file"
            />
            <button className="button" onClick={() => importInputRef.current?.click()} type="button">
              <Upload aria-hidden="true" size={16} />
              Import
            </button>
            <button className="button" onClick={() => exportPurchases(filteredPurchases)} type="button">
              <Download aria-hidden="true" size={16} />
              Export
            </button>
            <Link className="button button--primary" href="/purchases/new">
              <Plus aria-hidden="true" size={17} />
              New Purchase
            </Link>
          </div>
        )}
        description="View and manage all purchase invoices"
        title="Purchase Invoices"
      />

      <div aria-label="Filter purchases by status" className={styles.tabs} role="tablist">
        {stageTabs.map((item) => {
          const count = item === "All" ? purchaseInvoices.length : stageCounts[item];
          return (
            <button
              aria-selected={stage === item}
              className={`${styles.tab} ${stage === item ? styles.activeTab : ""}`}
              key={item}
              onClick={() => changeStage(item)}
              role="tab"
              type="button"
            >
              {item} <span>({count.toLocaleString("en-US")})</span>
            </button>
          );
        })}
      </div>

      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <label className={styles.searchField}>
            <Search aria-hidden="true" size={17} />
            <span className="sr-only">Search purchase invoices</span>
            <input
              onChange={(event) => {
                setQuery(event.target.value);
                resetPageState();
              }}
              placeholder="Search by invoice no, supplier name..."
              type="search"
              value={query}
            />
          </label>
          <button className={`button ${styles.toolButton}`} onClick={cyclePaymentFilter} type="button">
            <Filter aria-hidden="true" size={16} />
            {paymentFilter === "All" ? "Filter" : paymentFilter}
          </button>
          <div className={styles.dateControl}>
            <button className={`button ${styles.toolButton}`} onClick={() => setDatePanelOpen((open) => !open)} type="button">
              <CalendarDays aria-hidden="true" size={16} />
              <span>{dateLabel}</span>
            </button>
            {datePanelOpen ? (
              <div className={styles.datePanel}>
                <label>
                  <span>From</span>
                  <input className="field" max={dateTo || undefined} onChange={(event) => setDateFrom(event.target.value)} type="date" value={dateFrom} />
                </label>
                <label>
                  <span>To</span>
                  <input className="field" min={dateFrom || undefined} onChange={(event) => setDateTo(event.target.value)} type="date" value={dateTo} />
                </label>
                <div className={styles.datePanelActions}>
                  <button
                    className="button button--ghost"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                      resetPageState();
                    }}
                    type="button"
                  >
                    Clear
                  </button>
                  <button
                    className="button button--primary"
                    onClick={() => {
                      setDatePanelOpen(false);
                      resetPageState();
                      setActivityMessage(`Date range applied: ${dateLabel}.`);
                    }}
                    type="button"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <p aria-live="polite" className={activityMessage ? styles.activity : "sr-only"}>{activityMessage}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkboxCell} scope="col">
                  <input aria-label="Select all purchases on this page" checked={allPageRowsSelected} onChange={toggleAllPageRows} type="checkbox" />
                </th>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Invoice No</th>
                <th scope="col">Supplier Name</th>
                <th scope="col">Total Amount</th>
                <th scope="col">Payment Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((invoice, index) => (
                <tr key={invoice.id}>
                  <td className={styles.checkboxCell}>
                    <input
                      aria-label={`Select purchase ${invoice.invoiceNo}`}
                      checked={selected.has(invoice.id)}
                      onChange={() => toggleRow(invoice.id)}
                      type="checkbox"
                    />
                  </td>
                  <td className={styles.rowNumber}>{firstVisible + index}</td>
                  <td className={styles.numeric}>{invoice.date}</td>
                  <td>
                    <button className={styles.invoiceLink} onClick={() => showAction("Viewing", invoice)} type="button">{invoice.invoiceNo}</button>
                  </td>
                  <td><strong className={styles.supplier}>{invoice.supplier}</strong></td>
                  <td className={`${styles.numeric} ${styles.amount}`}>{formatPurchaseCurrency(invoice.totalAmount)}</td>
                  <td><PurchasePaymentBadge status={invoice.paymentStatus} /></td>
                  <td>
                    <div className={styles.actions}>
                      <button aria-label={`View ${invoice.invoiceNo}`} onClick={() => showAction("Viewing", invoice)} title="View purchase" type="button"><Eye size={15} /></button>
                      <button aria-label={`Edit ${invoice.invoiceNo}`} onClick={() => showAction("Editing", invoice)} title="Edit purchase" type="button"><FilePenLine size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td className={styles.emptyState} colSpan={8}>
                    <Search aria-hidden="true" size={24} />
                    <strong>No purchase invoices found</strong>
                    <span>Try another search, status, or date range.</span>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.tableFooter}>
          <p>Showing {firstVisible} to {lastVisible} of {filteredPurchases.length.toLocaleString("en-US")} invoices</p>
          <nav aria-label="Purchase invoice pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button">
              <ChevronLeft size={17} />
            </button>
            {paginationItems.map((item, index) => item === "ellipsis" ? (
              <span aria-hidden="true" className={styles.ellipsis} key={`ellipsis-${index}`}>…</span>
            ) : (
              <button
                aria-current={safeCurrentPage === item ? "page" : undefined}
                className={safeCurrentPage === item ? styles.currentPage : ""}
                key={item}
                onClick={() => setCurrentPage(item)}
                type="button"
              >
                {item}
              </button>
            ))}
            <button aria-label="Next page" disabled={safeCurrentPage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button">
              <ChevronRight size={17} />
            </button>
          </nav>
        </footer>
      </Card>
    </div>
  );
}
