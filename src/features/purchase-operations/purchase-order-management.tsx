"use client";

import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { OperationDialog } from "./operation-dialog";
import {
  formatCurrency,
  formatDate,
  initialManagedPurchaseOrders,
  isManagedPurchaseOrder,
  PURCHASE_ORDER_STORAGE_KEY,
  supplierOptions,
  type ManagedPurchaseOrder,
  type PurchaseOrderStatus,
} from "./purchase-operations-data";
import styles from "./purchase-operations.module.css";

const ORDER_EVENT = "jewellery-erp:managed-purchase-orders-change";
const INITIAL_SNAPSHOT = JSON.stringify(initialManagedPurchaseOrders);
const statuses = ["All Status", "Pending", "Approved", "Ordered", "Cancelled"] as const;
type StatusFilter = (typeof statuses)[number];

type OrderFilters = {
  query: string;
  supplier: string;
  status: StatusFilter;
  fromDate: string;
  toDate: string;
};

const initialFilters: OrderFilters = { query: "", supplier: "All Suppliers", status: "All Status", fromDate: "2025-04-01", toDate: "2025-04-12" };

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(ORDER_EVENT, onChange);
  return () => { window.removeEventListener("storage", onChange); window.removeEventListener(ORDER_EVENT, onChange); };
}

function getSnapshot() {
  try { return window.localStorage.getItem(PURCHASE_ORDER_STORAGE_KEY) ?? INITIAL_SNAPSHOT; } catch { return INITIAL_SNAPSHOT; }
}

function parseOrders(snapshot: string) {
  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value) ? value.filter(isManagedPurchaseOrder) : initialManagedPurchaseOrders;
  } catch { return initialManagedPurchaseOrders; }
}

function persistOrders(records: ManagedPurchaseOrder[]) {
  try {
    window.localStorage.setItem(PURCHASE_ORDER_STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event(ORDER_EVENT));
  } catch {
    // The page remains interactive in memory when storage is unavailable.
  }
}

function getNextOrder(records: ManagedPurchaseOrder[]): ManagedPurchaseOrder {
  const nextNumber = Math.max(23, ...records.map((record) => Number(record.poNumber.split("-").at(-1)) || 0)) + 1;
  return {
    id: `po-${crypto.randomUUID()}`,
    poNumber: `PO-2025-${String(nextNumber).padStart(4, "0")}`,
    supplier: supplierOptions[0],
    orderDate: "2025-04-12",
    expectedDate: "2025-04-20",
    totalAmount: 0,
    status: "Pending",
  };
}

const statusClasses: Record<PurchaseOrderStatus, string> = {
  Pending: styles.pending,
  Approved: styles.approved,
  Ordered: styles.ordered,
  Cancelled: styles.cancelled,
};

function StatusBadge({ status }: { status: PurchaseOrderStatus }) {
  return <span className={`${styles.statusBadge} ${statusClasses[status]}`}>{status}</span>;
}

export function PurchaseOrderManagement() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => INITIAL_SNAPSHOT);
  const records = useMemo(() => parseOrders(snapshot), [snapshot]);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  const [form, setForm] = useState<ManagedPurchaseOrder | null>(null);
  const [viewRecord, setViewRecord] = useState<ManagedPurchaseOrder | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<ManagedPurchaseOrder | null>(null);
  const [message, setMessage] = useState("");

  const filteredRecords = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return records.filter((record) => (
      (!query || record.poNumber.toLowerCase().includes(query) || record.supplier.toLowerCase().includes(query))
      && (filters.supplier === "All Suppliers" || record.supplier === filters.supplier)
      && (filters.status === "All Status" || record.status === filters.status)
      && record.orderDate >= filters.fromDate
      && record.orderDate <= filters.toDate
    ));
  }, [filters, records]);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draftFilters.fromDate > draftFilters.toDate) {
      setMessage("From Date must be before To Date.");
      return;
    }
    setFilters({ ...draftFilters });
    setMessage("Purchase order filters applied.");
  }

  function saveOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    if (form.expectedDate < form.orderDate) {
      setMessage("Expected Date must be on or after Order Date.");
      return;
    }
    const exists = records.some((record) => record.id === form.id);
    const next = exists ? records.map((record) => record.id === form.id ? form : record) : [form, ...records];
    persistOrders(next);
    setForm(null);
    setMessage(`${form.poNumber} ${exists ? "updated" : "created"} successfully.`);
  }

  function removeOrder() {
    if (!deleteRecord) return;
    persistOrders(records.filter((record) => record.id !== deleteRecord.id));
    setDeleteRecord(null);
    setMessage(`${deleteRecord.poNumber} deleted.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader action={<button className={`button ${styles.primaryButton}`} onClick={() => setForm(getNextOrder(records))} type="button"><Plus aria-hidden="true" size={17} />Create Purchase Order</button>} description="View and manage supplier purchase orders" title="Purchase Order" />

      <Card as="form" className={styles.filterCard} onSubmit={applyFilters}>
        <div className={`${styles.filterBar} ${styles.orderFilters}`}>
          <label className={`${styles.fieldLabel} ${styles.searchField}`}><span className="sr-only">Search purchase orders</span><Search aria-hidden="true" size={16} /><input className="field" onChange={(event) => setDraftFilters((current) => ({ ...current, query: event.target.value }))} placeholder="Search PO number or supplier..." type="search" value={draftFilters.query} /></label>
          <label className={styles.fieldLabel}><span className="sr-only">Supplier</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, supplier: event.target.value }))} value={draftFilters.supplier}><option>All Suppliers</option>{supplierOptions.map((supplier) => <option key={supplier}>{supplier}</option>)}</select></label>
          <label className={styles.fieldLabel}><span className="sr-only">Status</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, status: event.target.value as StatusFilter }))} value={draftFilters.status}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label className={styles.fieldLabel}><span>From Date</span><input className="field" max={draftFilters.toDate} onChange={(event) => setDraftFilters((current) => ({ ...current, fromDate: event.target.value }))} type="date" value={draftFilters.fromDate} /></label>
          <label className={styles.fieldLabel}><span>To Date</span><input className="field" min={draftFilters.fromDate} onChange={(event) => setDraftFilters((current) => ({ ...current, toDate: event.target.value }))} type="date" value={draftFilters.toDate} /></label>
          <button className={`button ${styles.primaryButton} ${styles.searchButton}`} type="submit"><Search aria-hidden="true" size={16} />Search</button>
        </div>
      </Card>

      <p aria-live="polite" className={message ? styles.message : "sr-only"}>{message}</p>

      <Card className={styles.tableCard}>
        <div className={styles.tableScroller}>
          <table>
            <caption className="sr-only">Purchase orders</caption>
            <thead><tr><th scope="col">SL</th><th scope="col">PO Number</th><th scope="col">Supplier Name</th><th scope="col">Order Date</th><th scope="col">Expected Date</th><th scope="col">Total Amount (৳)</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {filteredRecords.map((record, index) => <tr key={record.id}><td>{index + 1}</td><td className={styles.numberLink}>{record.poNumber}</td><td>{record.supplier}</td><td>{formatDate(record.orderDate)}</td><td>{formatDate(record.expectedDate)}</td><td>{formatCurrency(record.totalAmount)}</td><td><StatusBadge status={record.status} /></td><td><div className={styles.actions}><button aria-label={`View ${record.poNumber}`} className={styles.iconButton} onClick={() => setViewRecord(record)} type="button"><Eye aria-hidden="true" size={15} /></button><button aria-label={`Edit ${record.poNumber}`} className={styles.iconButton} onClick={() => setForm({ ...record })} type="button"><Pencil aria-hidden="true" size={15} /></button><button aria-label={`Delete ${record.poNumber}`} className={`${styles.iconButton} ${styles.deleteButton}`} onClick={() => setDeleteRecord(record)} type="button"><Trash2 aria-hidden="true" size={15} /></button></div></td></tr>)}
              {!filteredRecords.length ? <tr><td className={styles.emptyState} colSpan={8}>No purchase orders match these filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}><p>Showing 1 to {filteredRecords.length} of {filteredRecords.length} entries</p><nav aria-label="Purchase order pagination" className={styles.pagination}><button aria-label="Previous page" disabled type="button"><ChevronLeft size={15} /></button><button aria-current="page" className={styles.currentPage} type="button">1</button><button aria-label="Next page" disabled type="button"><ChevronRight size={15} /></button></nav></footer>
      </Card>

      {form ? <OperationDialog description="Enter the supplier, dates, amount, and current order status." onClose={() => setForm(null)} title={records.some((record) => record.id === form.id) ? `Edit ${form.poNumber}` : "Create Purchase Order"}><form className={styles.formGrid} onSubmit={saveOrder}><label className={styles.fieldLabel}><span>PO Number</span><input className="field" onChange={(event) => setForm((current) => current ? { ...current, poNumber: event.target.value } : current)} required value={form.poNumber} /></label><label className={styles.fieldLabel}><span>Supplier</span><select className="select" onChange={(event) => setForm((current) => current ? { ...current, supplier: event.target.value } : current)} value={form.supplier}>{supplierOptions.map((supplier) => <option key={supplier}>{supplier}</option>)}</select></label><label className={styles.fieldLabel}><span>Order Date</span><input className="field" onChange={(event) => setForm((current) => current ? { ...current, orderDate: event.target.value } : current)} required type="date" value={form.orderDate} /></label><label className={styles.fieldLabel}><span>Expected Date</span><input className="field" min={form.orderDate} onChange={(event) => setForm((current) => current ? { ...current, expectedDate: event.target.value } : current)} required type="date" value={form.expectedDate} /></label><label className={styles.fieldLabel}><span>Total Amount (৳)</span><input className="field" min="0" onChange={(event) => setForm((current) => current ? { ...current, totalAmount: Number(event.target.value) } : current)} required step="1" type="number" value={form.totalAmount} /></label><label className={styles.fieldLabel}><span>Status</span><select className="select" onChange={(event) => setForm((current) => current ? { ...current, status: event.target.value as PurchaseOrderStatus } : current)} value={form.status}>{statuses.slice(1).map((status) => <option key={status}>{status}</option>)}</select></label><footer className={styles.modalActions}><button className="button" onClick={() => setForm(null)} type="button">Cancel</button><button className={`button ${styles.primaryButton}`} type="submit">Save Purchase Order</button></footer></form></OperationDialog> : null}

      {viewRecord ? <OperationDialog description={viewRecord.supplier} onClose={() => setViewRecord(null)} title={viewRecord.poNumber}><dl className={styles.details}><div><dt>Order Date</dt><dd>{formatDate(viewRecord.orderDate)}</dd></div><div><dt>Expected Date</dt><dd>{formatDate(viewRecord.expectedDate)}</dd></div><div><dt>Total Amount</dt><dd>{formatCurrency(viewRecord.totalAmount)}</dd></div><div><dt>Status</dt><dd><StatusBadge status={viewRecord.status} /></dd></div></dl><footer className={styles.viewActions}><button className="button" onClick={() => setViewRecord(null)} type="button">Close</button></footer></OperationDialog> : null}

      {deleteRecord ? <OperationDialog description="This action removes the order from this browser." onClose={() => setDeleteRecord(null)} title={`Delete ${deleteRecord.poNumber}?`}><footer className={styles.formGrid}><div className={styles.modalActions}><button className="button" onClick={() => setDeleteRecord(null)} type="button">Cancel</button><button className={`button ${styles.primaryButton}`} onClick={removeOrder} type="button">Delete Order</button></div></footer></OperationDialog> : null}
    </div>
  );
}
