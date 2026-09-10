"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge, type PaymentStatus } from "@/components/ui/status-badge";
import { formatCurrency, invoices, type InvoiceRecord } from "./invoice-data";
import styles from "./invoice-list.module.css";

const PAGE_SIZE = 10;
const statuses = ["All", "Paid", "Due", "Returned"] as const;
type StatusFilter = (typeof statuses)[number];

const monthNumbers: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};

function toIsoDate(value: string) {
  const [day, month, year] = value.split(" ");
  return `${year}-${monthNumbers[month] ?? "01"}-${day}`;
}

function getPaginationItems(current: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", pageCount];
  if (current >= pageCount - 3) return [1, "ellipsis", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", pageCount];
}

function exportInvoices(records: InvoiceRecord[]) {
  const header = ["Invoice No", "Date", "Customer", "Mobile", "Amount", "Payment Status"];
  const rows = records.map((record) => [
    record.invoiceNo,
    record.date,
    record.customer,
    record.mobile,
    String(record.amount),
    record.status,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "sales-invoices.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function InvoiceList() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("search") ?? "");
  const deferredQuery = useDeferredValue(query);
  const [status, setStatus] = useState<StatusFilter>("All");
  const [dateFrom, setDateFrom] = useState("2025-04-01");
  const [dateTo, setDateTo] = useState("2025-04-30");
  const [dateFilterActive, setDateFilterActive] = useState(false);
  const [datePanelOpen, setDatePanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [activityMessage, setActivityMessage] = useState("");

  const statusCounts = useMemo(() => {
    const counts: Record<PaymentStatus, number> = { Paid: 0, Due: 0, Returned: 0 };
    for (const invoice of invoices) counts[invoice.status] += 1;
    return counts;
  }, []);

  const filteredInvoices = useMemo(() => {
    const searchTerm = deferredQuery.trim().toLowerCase();
    return invoices.filter((invoice) => {
      const matchesStatus = status === "All" || invoice.status === status;
      const invoiceDate = toIsoDate(invoice.date);
      const matchesDate = !dateFilterActive || ((!dateFrom || invoiceDate >= dateFrom) && (!dateTo || invoiceDate <= dateTo));
      const matchesSearch =
        searchTerm.length === 0 ||
        invoice.invoiceNo.toLowerCase().includes(searchTerm) ||
        invoice.customer.toLowerCase().includes(searchTerm) ||
        invoice.mobile.replaceAll(" ", "").includes(searchTerm.replaceAll(" ", ""));
      return matchesStatus && matchesDate && matchesSearch;
    });
  }, [dateFilterActive, dateFrom, dateTo, deferredQuery, status]);

  const pageCount = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const pageRows = filteredInvoices.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);
  const paginationItems = getPaginationItems(safeCurrentPage, pageCount);
  const allPageRowsSelected = pageRows.length > 0 && pageRows.every((invoice) => selected.has(invoice.id));
  const firstVisible = filteredInvoices.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const lastVisible = Math.min(safeCurrentPage * PAGE_SIZE, filteredInvoices.length);

  function changeStatus(nextStatus: StatusFilter) {
    setStatus(nextStatus);
    setCurrentPage(1);
    setSelected(new Set());
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

  function showAction(action: string, invoice: InvoiceRecord) {
    setActivityMessage(`${action}: ${invoice.invoiceNo} for ${invoice.customer}`);
  }

  function cycleStatusFilter() {
    const currentIndex = statuses.indexOf(status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    changeStatus(nextStatus);
    setActivityMessage(nextStatus === "All" ? "Payment filter cleared." : `Showing ${nextStatus.toLowerCase()} invoices.`);
  }

  const dateLabel = dateFilterActive
    ? `${dateFrom || "Any date"} – ${dateTo || "Any date"}`
    : "01 Apr 2025 - 30 Apr 2025";

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <Link className="button button--primary" href="/sales/invoices/new">
            <Plus aria-hidden="true" size={17} />
            New Invoice
          </Link>
        )}
        description="View and manage all sales invoices"
        title="Sales Invoice"
      />

      <div aria-label="Filter invoices by payment status" className={styles.tabs} role="tablist">
        {statuses.map((item) => {
          const count = item === "All" ? invoices.length : statusCounts[item];
          return (
            <button
              aria-selected={status === item}
              className={`${styles.tab} ${status === item ? styles.activeTab : ""}`}
              key={item}
              onClick={() => changeStatus(item)}
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
            <span className="sr-only">Search invoices</span>
            <input
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by invoice no, customer name or mobile..."
              type="search"
              value={query}
            />
          </label>
          <button className={`button ${styles.toolButton}`} onClick={cycleStatusFilter} type="button">
            <Filter aria-hidden="true" size={16} />
            {status === "All" ? "Filter" : status}
          </button>
          <div className={styles.dateControl}>
            <button aria-expanded={datePanelOpen} className={`button ${styles.toolButton}`} onClick={() => setDatePanelOpen((open) => !open)} type="button">
              <CalendarDays aria-hidden="true" size={16} />
              <span>{dateLabel}</span>
            </button>
            {datePanelOpen ? (
              <div className={styles.datePanel}>
                <label><span>From</span><input className="field" max={dateTo || undefined} onChange={(event) => setDateFrom(event.target.value)} type="date" value={dateFrom} /></label>
                <label><span>To</span><input className="field" min={dateFrom || undefined} onChange={(event) => setDateTo(event.target.value)} type="date" value={dateTo} /></label>
                <div className={styles.datePanelActions}>
                  <button className="button button--ghost" onClick={() => {
                    setDateFilterActive(false);
                    setDatePanelOpen(false);
                    setCurrentPage(1);
                    setActivityMessage("Date filter cleared.");
                  }} type="button">Clear</button>
                  <button className="button button--primary" onClick={() => {
                    setDateFilterActive(true);
                    setDatePanelOpen(false);
                    setCurrentPage(1);
                    setActivityMessage(`Date range applied: ${dateLabel}.`);
                  }} type="button">Apply</button>
                </div>
              </div>
            ) : null}
          </div>
          <button className={`button ${styles.toolButton}`} onClick={() => exportInvoices(filteredInvoices)} type="button">
            <Download aria-hidden="true" size={16} />
            Export
          </button>
        </div>

        <p aria-live="polite" className={activityMessage ? styles.activity : "sr-only"}>{activityMessage}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkboxCell} scope="col">
                  <input
                    aria-label="Select all invoices on this page"
                    checked={allPageRowsSelected}
                    onChange={toggleAllPageRows}
                    type="checkbox"
                  />
                </th>
                <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Invoice No</th>
                <th scope="col">Customer</th>
                <th scope="col">Amount</th>
                <th scope="col">Payment Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((invoice, index) => (
                <tr key={invoice.id}>
                  <td className={styles.checkboxCell}>
                    <input
                      aria-label={`Select invoice ${invoice.invoiceNo}`}
                      checked={selected.has(invoice.id)}
                      onChange={() => toggleRow(invoice.id)}
                      type="checkbox"
                    />
                  </td>
                  <td className={styles.rowNumber}>{firstVisible + index}</td>
                  <td className={styles.dateCell}>{invoice.date}</td>
                  <td><button className={styles.invoiceLink} onClick={() => showAction("Viewing", invoice)} type="button">{invoice.invoiceNo}</button></td>
                  <td>
                    <strong className={styles.customer}>{invoice.customer}</strong>
                    <span className={styles.mobile}>{invoice.mobile}</span>
                  </td>
                  <td className={styles.amount}>{formatCurrency(invoice.amount)}</td>
                  <td><StatusBadge status={invoice.status} /></td>
                  <td>
                    <div className={styles.actions}>
                      <button aria-label={`View ${invoice.invoiceNo}`} onClick={() => showAction("Viewing", invoice)} title="View invoice" type="button"><Eye size={15} /></button>
                      <button aria-label={`Edit ${invoice.invoiceNo}`} onClick={() => showAction("Editing", invoice)} title="Edit invoice" type="button"><FilePenLine size={15} /></button>
                      <Link aria-label={`Create invoice for ${invoice.customer}`} href={`/sales/invoices/new?customer=${encodeURIComponent(invoice.customer)}`} title="Create another invoice"><Plus size={15} /></Link>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td className={styles.emptyState} colSpan={8}>
                    <Search aria-hidden="true" size={24} />
                    <strong>No invoices found</strong>
                    <span>Try another search or payment status.</span>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.tableFooter}>
          <p>Showing {firstVisible} to {lastVisible} of {filteredInvoices.length.toLocaleString("en-US")} entries</p>
          <nav aria-label="Invoice list pagination" className={styles.pagination}>
            <button
              aria-label="Previous page"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              type="button"
            >
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
            <button
              aria-label="Next page"
              disabled={safeCurrentPage === pageCount}
              onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
              type="button"
            >
              <ChevronRight size={17} />
            </button>
          </nav>
        </footer>
      </Card>
    </div>
  );
}
