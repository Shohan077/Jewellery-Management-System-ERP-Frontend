"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FilePenLine,
  Filter,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  formatSupplierCurrency,
  supplierCategories,
  suppliers as initialSuppliers,
  supplierStats,
} from "./supplier-data";
import type { SupplierCategory, SupplierRecord, SupplierStatus } from "./supplier-data";
import styles from "./supplier-list.module.css";

const PAGE_SIZE = 10;
const statusOptions = ["All Status", "Active", "Inactive"] as const;
type StatusFilter = (typeof statusOptions)[number];

function paginationItems(current: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", pageCount];
  if (current >= pageCount - 3) {
    return [1, "ellipsis", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", pageCount];
}

function SupplierStatusBadge({ status }: { status: SupplierStatus }) {
  return (
    <span className={`${styles.statusBadge} ${status === "Active" ? styles.activeStatus : styles.inactiveStatus}`}>
      {status}
    </span>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  trendTone: "positive" | "negative";
  valueTone?: "blue";
};

function StatCard({ label, value, trend, trendDirection, trendTone, valueTone }: StatCardProps) {
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;

  return (
    <Card className={styles.statCard}>
      <p>{label}</p>
      <div className={styles.statValueRow}>
        <strong className={valueTone === "blue" ? styles.blueValue : ""}>{value}</strong>
        <span className={trendTone === "positive" ? styles.positiveTrend : styles.negativeTrend}>
          <TrendIcon aria-hidden="true" size={13} />
          {trend}
        </span>
      </div>
      <small>vs last month</small>
    </Card>
  );
}

export function SupplierList() {
  const [records, setRecords] = useState<SupplierRecord[]>(initialSuppliers);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState<"All Categories" | SupplierCategory>("All Categories");
  const [status, setStatus] = useState<StatusFilter>("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [activityMessage, setActivityMessage] = useState("");
  const [newSupplierOpen, setNewSupplierOpen] = useState(false);

  const filteredSuppliers = useMemo(() => {
    const searchTerm = deferredQuery.trim().toLowerCase();
    return records.filter((supplier) => {
      const matchesQuery =
        searchTerm.length === 0 ||
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.contactPerson.toLowerCase().includes(searchTerm) ||
        supplier.phone.includes(searchTerm);
      const matchesCategory = category === "All Categories" || supplier.category === category;
      const matchesStatus = status === "All Status" || supplier.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, deferredQuery, records, status]);

  const pageCount = Math.max(1, Math.ceil(filteredSuppliers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const pageRows = filteredSuppliers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const firstVisible = filteredSuppliers.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const lastVisible = Math.min(safePage * PAGE_SIZE, filteredSuppliers.length);

  function showRowAction(action: string, supplier: SupplierRecord) {
    setActivityMessage(`${action} ${supplier.name}.`);
  }

  function addSupplier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("supplierName") ?? "").trim();
    const contactPerson = String(form.get("contactPerson") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const categoryValue = String(form.get("category") ?? "Jewellery") as SupplierCategory;

    setRecords((previous) => [
      {
        id: previous.reduce((largest, supplier) => Math.max(largest, supplier.id), 0) + 1,
        name,
        contactPerson,
        phone,
        totalPurchase: 0,
        dueAmount: 0,
        status: "Active",
        category: categoryValue,
      },
      ...previous,
    ]);
    setQuery("");
    setCategory("All Categories");
    setStatus("All Status");
    setCurrentPage(1);
    setNewSupplierOpen(false);
    setActivityMessage(`${name} was added as an active supplier.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={(
          <button className="button button--primary" onClick={() => setNewSupplierOpen(true)} type="button">
            <Plus aria-hidden="true" size={17} />
            New Supplier
          </button>
        )}
        description="View and manage all suppliers"
        title="Suppliers"
      />

      <section aria-label="Supplier overview" className={styles.statsGrid}>
        <StatCard label="Total Suppliers" trend="5%" trendDirection="down" trendTone="negative" value={supplierStats.total.toLocaleString("en-US")} valueTone="blue" />
        <StatCard label="Active Suppliers" trend="8%" trendDirection="up" trendTone="positive" value={supplierStats.active.toLocaleString("en-US")} />
        <StatCard label="Total Purchase" trend="1%" trendDirection="up" trendTone="positive" value={formatSupplierCurrency(supplierStats.totalPurchase)} />
        <StatCard label="Outstanding Due" trend="2%" trendDirection="up" trendTone="negative" value={formatSupplierCurrency(supplierStats.outstandingDue)} />
      </section>

      <Card className={styles.tableCard}>
        <div className={styles.toolbar}>
          <label className={styles.searchField}>
            <Search aria-hidden="true" size={17} />
            <span className="sr-only">Search suppliers</span>
            <input
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, contact, phone..."
              type="search"
              value={query}
            />
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter suppliers by category</span>
            <select
              onChange={(event) => {
                setCategory(event.target.value as "All Categories" | SupplierCategory);
                setCurrentPage(1);
              }}
              value={category}
            >
              <option>All Categories</option>
              {supplierCategories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className={styles.selectField}>
            <span className="sr-only">Filter suppliers by status</span>
            <select
              onChange={(event) => {
                setStatus(event.target.value as StatusFilter);
                setCurrentPage(1);
              }}
              value={status}
            >
              {statusOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <button
            className={`button ${styles.filterButton}`}
            onClick={() => setActivityMessage(`${filteredSuppliers.length.toLocaleString("en-US")} suppliers match the current filters.`)}
            type="button"
          >
            <Filter aria-hidden="true" size={16} />
            Filter
          </button>
        </div>

        <p aria-live="polite" className={activityMessage ? styles.activity : "sr-only"}>{activityMessage}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Jewellery suppliers</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Supplier Name</th>
                <th scope="col">Contact Person</th>
                <th scope="col">Phone</th>
                <th scope="col">Total Purchase</th>
                <th scope="col">Due Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((supplier, index) => (
                <tr key={supplier.id}>
                  <td className={styles.rowNumber}>{firstVisible + index}</td>
                  <td><strong className={styles.supplierName}>{supplier.name}</strong></td>
                  <td>{supplier.contactPerson}</td>
                  <td className={styles.phone}>{supplier.phone}</td>
                  <td className={styles.amount}>{formatSupplierCurrency(supplier.totalPurchase)}</td>
                  <td className={styles.amount}>{formatSupplierCurrency(supplier.dueAmount)}</td>
                  <td><SupplierStatusBadge status={supplier.status} /></td>
                  <td>
                    <div className={styles.rowActions}>
                      <button aria-label={`View ${supplier.name}`} onClick={() => showRowAction("Viewing", supplier)} title="View supplier" type="button"><Eye aria-hidden="true" size={15} /></button>
                      <button aria-label={`Edit ${supplier.name}`} onClick={() => showRowAction("Editing", supplier)} title="Edit supplier" type="button"><FilePenLine aria-hidden="true" size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td className={styles.emptyState} colSpan={8}>
                    <Search aria-hidden="true" size={25} />
                    <strong>No suppliers found</strong>
                    <span>Try a different search, category, or status.</span>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.tableFooter}>
          <p>Showing {firstVisible} to {lastVisible} of {filteredSuppliers.length.toLocaleString("en-US")} suppliers</p>
          <nav aria-label="Supplier list pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={safePage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} type="button">
              <ChevronLeft aria-hidden="true" size={17} />
            </button>
            {paginationItems(safePage, pageCount).map((item, index) => item === "ellipsis" ? (
              <span aria-hidden="true" className={styles.ellipsis} key={`ellipsis-${index}`}>…</span>
            ) : (
              <button aria-current={safePage === item ? "page" : undefined} className={safePage === item ? styles.currentPage : ""} key={item} onClick={() => setCurrentPage(item)} type="button">
                {item}
              </button>
            ))}
            <button aria-label="Next page" disabled={safePage === pageCount} onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))} type="button">
              <ChevronRight aria-hidden="true" size={17} />
            </button>
          </nav>
        </footer>
      </Card>

      {newSupplierOpen ? (
        <div className={styles.modalBackdrop} onClick={() => setNewSupplierOpen(false)} onKeyDown={(event) => {
          if (event.key === "Escape") setNewSupplierOpen(false);
        }} role="presentation">
          <section aria-labelledby="new-supplier-title" aria-modal="true" className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog">
            <div className={styles.modalHeader}>
              <div>
                <h2 id="new-supplier-title">Add New Supplier</h2>
                <p>Create a supplier record for future purchases.</p>
              </div>
              <button aria-label="Close new supplier form" className={styles.closeButton} onClick={() => setNewSupplierOpen(false)} type="button"><X aria-hidden="true" size={19} /></button>
            </div>
            <form className={styles.modalForm} onSubmit={addSupplier}>
              <label>
                <span>Supplier Name</span>
                <input autoFocus className="field" name="supplierName" placeholder="Enter supplier name" required />
              </label>
              <label>
                <span>Contact Person</span>
                <input className="field" name="contactPerson" placeholder="Enter contact person" required />
              </label>
              <label>
                <span>Phone</span>
                <input className="field" inputMode="tel" name="phone" pattern="01[0-9-]{9,10}" placeholder="01711-223344" required />
              </label>
              <label>
                <span>Category</span>
                <select className="select" defaultValue="Jewellery" name="category">
                  {supplierCategories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <div className={styles.modalActions}>
                <button className="button" onClick={() => setNewSupplierOpen(false)} type="button">Cancel</button>
                <button className="button button--primary" type="submit"><Plus aria-hidden="true" size={16} />Add Supplier</button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
