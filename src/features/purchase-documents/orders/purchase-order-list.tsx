"use client";

import Link from "next/link";
import { Eye, Filter, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  formatPurchaseOrderDate,
  formatPurchaseOrderMoney,
  INITIAL_PURCHASE_ORDER_SNAPSHOT,
  parsePurchaseOrders,
  PURCHASE_ORDER_STORAGE_EVENT,
  PURCHASE_ORDER_STORAGE_KEY,
  supplierOptions,
  type PurchaseOrder,
  type PurchaseOrderStatus,
} from "./purchase-order-data";
import styles from "./purchase-orders.module.css";

type Filters = { query: string; supplier: string; fromDate: string; toDate: string };
const initialFilters: Filters = { query: "", supplier: "All Suppliers", fromDate: "2025-04-01", toDate: "2025-04-30" };

const statusStyle: Record<PurchaseOrderStatus, string> = {
  Pending: styles.pending,
  Approved: styles.approved,
  Received: styles.received,
  Cancelled: styles.cancelled,
};

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(PURCHASE_ORDER_STORAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(PURCHASE_ORDER_STORAGE_EVENT, onStoreChange);
  };
}

function readSnapshot() {
  try {
    return window.localStorage.getItem(PURCHASE_ORDER_STORAGE_KEY) ?? INITIAL_PURCHASE_ORDER_SNAPSHOT;
  } catch {
    return INITIAL_PURCHASE_ORDER_SNAPSHOT;
  }
}

export function PurchaseOrderList() {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, () => INITIAL_PURCHASE_ORDER_SNAPSHOT);
  const orders = useMemo(() => parsePurchaseOrders(snapshot), [snapshot]);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = new URLSearchParams(window.location.search).get("saved");
    if (!saved) return;
    const timer = window.setTimeout(() => setMessage(`${saved} was saved successfully.`), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedOrder) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedOrder(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedOrder]);

  const visibleOrders = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesQuery = !query || `${order.orderNo} ${order.supplier}`.toLowerCase().includes(query);
      const matchesSupplier = filters.supplier === "All Suppliers" || order.supplier === filters.supplier;
      const matchesDates = order.orderDate >= filters.fromDate && order.orderDate <= filters.toDate;
      return matchesQuery && matchesSupplier && matchesDates;
    });
  }, [filters, orders]);

  function applyFilters() {
    if (draftFilters.fromDate > draftFilters.toDate) {
      setMessage("From date must be before or equal to the to date.");
      return;
    }
    setFilters({ ...draftFilters });
    setMessage("Purchase order filters applied.");
  }

  function clearFilters() {
    setDraftFilters(initialFilters);
    setFilters(initialFilters);
    setMessage("Filters reset.");
  }

  function deleteOrder(order: PurchaseOrder) {
    if (!window.confirm(`Delete ${order.orderNo}? This cannot be undone.`)) return;
    try {
      const next = orders.filter((entry) => entry.orderNo !== order.orderNo);
      window.localStorage.setItem(PURCHASE_ORDER_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(PURCHASE_ORDER_STORAGE_EVENT));
      setMessage(`${order.orderNo} was deleted.`);
      if (selectedOrder?.orderNo === order.orderNo) setSelectedOrder(null);
    } catch {
      setMessage("The order could not be deleted because browser storage is unavailable.");
    }
  }

  return (
    <div className={styles.listPage}>
      <PageHeader action={<Link className="button button--primary" href="/purchases/orders/new"><Plus aria-hidden="true" size={17} />New Purchase Order</Link>} description="View and manage all purchase orders" title="Purchase Order List" />
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/dashboard">Home</Link><span aria-hidden="true">›</span><Link href="/purchases">Purchase</Link><span aria-hidden="true">›</span><span aria-current="page">Purchase Order List</span></nav>

      <Card className={styles.listCard}>
        <div className={styles.filters}>
          <label className={styles.searchField}><span className="sr-only">Search purchase orders</span><span className={styles.searchControl}><Search aria-hidden="true" size={16} /><input onChange={(event) => setDraftFilters((current) => ({ ...current, query: event.target.value }))} placeholder="Search purchase order..." value={draftFilters.query} /></span></label>
          <label><span className="sr-only">Supplier</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, supplier: event.target.value }))} value={draftFilters.supplier}><option>All Suppliers</option>{supplierOptions.map((supplier) => <option key={supplier}>{supplier}</option>)}</select></label>
          <label><span className="sr-only">From date</span><input aria-label="From date" className="field" onChange={(event) => setDraftFilters((current) => ({ ...current, fromDate: event.target.value }))} type="date" value={draftFilters.fromDate} /></label>
          <span aria-hidden="true" className={styles.dateSeparator}>–</span>
          <label><span className="sr-only">To date</span><input aria-label="To date" className="field" onChange={(event) => setDraftFilters((current) => ({ ...current, toDate: event.target.value }))} type="date" value={draftFilters.toDate} /></label>
          <button className="button" onClick={applyFilters} type="button"><Filter aria-hidden="true" size={16} />Filter</button>
          <button aria-label="Clear filters" className={styles.clearButton} onClick={clearFilters} title="Clear filters" type="button"><X aria-hidden="true" size={17} /></button>
        </div>

        <p aria-live="polite" className={message ? styles.listMessage : "sr-only"}>{message}</p>
        <div className={styles.tableScroller}>
          <table className={styles.orderTable}>
            <caption className="sr-only">Purchase orders</caption>
            <thead><tr><th scope="col">SL</th><th scope="col">PO No</th><th scope="col">Order Date</th><th scope="col">Supplier</th><th scope="col">Items</th><th scope="col">Total Amount (৳)</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>{visibleOrders.length ? visibleOrders.map((order, index) => <tr key={order.orderNo}><td>{index + 1}</td><td className={styles.orderNumber}>{order.orderNo}</td><td>{formatPurchaseOrderDate(order.orderDate)}</td><td><strong>{order.supplier}</strong></td><td>{order.itemCount}</td><td>{formatPurchaseOrderMoney(order.totalAmount)}</td><td><span className={`${styles.statusBadge} ${statusStyle[order.status]}`}>{order.status}</span></td><td><div className={styles.rowActions}><button aria-label={`View ${order.orderNo}`} onClick={() => setSelectedOrder(order)} title="View" type="button"><Eye aria-hidden="true" size={15} /></button><Link aria-label={`Edit ${order.orderNo}`} href={`/purchases/orders/new?edit=${encodeURIComponent(order.orderNo)}`} title="Edit"><Pencil aria-hidden="true" size={15} /></Link><button aria-label={`Delete ${order.orderNo}`} className={styles.dangerAction} onClick={() => deleteOrder(order)} title="Delete" type="button"><Trash2 aria-hidden="true" size={15} /></button></div></td></tr>) : <tr><td className={styles.noRecords} colSpan={8}><strong>No purchase orders found</strong><span>Try clearing or changing the current filters.</span><button className="button" onClick={clearFilters} type="button">Clear filters</button></td></tr>}</tbody>
          </table>
        </div>
        <footer className={styles.listFooter}><p>Showing 1 to {visibleOrders.length} of {visibleOrders.length} {visibleOrders.length === 1 ? "entry" : "entries"}</p><div aria-label="Pagination" className={styles.pagination}><button disabled type="button">Previous</button><button aria-current="page" className={styles.currentPage} type="button">1</button><button disabled type="button">Next</button></div></footer>
      </Card>

      {selectedOrder ? <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedOrder(null); }}><Card aria-labelledby="purchase-order-details-title" aria-modal="true" as="section" className={styles.detailsModal} role="dialog"><header className={styles.modalHeader}><div><h2 id="purchase-order-details-title">{selectedOrder.orderNo}</h2><p>Purchase order details</p></div><button aria-label="Close purchase order details" autoFocus onClick={() => setSelectedOrder(null)} type="button"><X aria-hidden="true" size={18} /></button></header><dl className={styles.detailsGrid}><div><dt>Supplier</dt><dd>{selectedOrder.supplier}</dd></div><div><dt>Order Date</dt><dd>{formatPurchaseOrderDate(selectedOrder.orderDate)}</dd></div><div><dt>Expected Delivery</dt><dd>{formatPurchaseOrderDate(selectedOrder.expectedDeliveryDate)}</dd></div><div><dt>Purchase Type</dt><dd>{selectedOrder.purchaseType}</dd></div><div><dt>Items</dt><dd>{selectedOrder.itemCount}</dd></div><div><dt>Total Amount</dt><dd>৳ {formatPurchaseOrderMoney(selectedOrder.totalAmount)}</dd></div><div><dt>Status</dt><dd><span className={`${styles.statusBadge} ${statusStyle[selectedOrder.status]}`}>{selectedOrder.status}</span></dd></div><div><dt>Remarks</dt><dd>{selectedOrder.remarks || selectedOrder.additionalNotes || "No remarks"}</dd></div></dl><footer className={styles.detailsActions}><button className="button" onClick={() => setSelectedOrder(null)} type="button">Close</button><Link className="button button--primary" href={`/purchases/orders/new?edit=${encodeURIComponent(selectedOrder.orderNo)}`}><Pencil aria-hidden="true" size={16} />Edit Order</Link></footer></Card></div> : null}
    </div>
  );
}
