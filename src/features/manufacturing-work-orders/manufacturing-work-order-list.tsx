"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  MoreHorizontal,
  PauseCircle,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  formatWorkOrderDate,
  initialManufacturingWorkOrders,
  isManufacturingWorkOrder,
  WORK_ORDER_STORAGE_EVENT,
  WORK_ORDER_STORAGE_KEY,
  type ManufacturingWorkOrder,
  type WorkOrderStatus,
} from "./manufacturing-work-order-data";
import styles from "./manufacturing-work-orders.module.css";

const PAGE_SIZE = 7;
const EMPTY_SAVED_ORDERS = "[]";
const filterStatuses = ["All Status", "Pending", "In Progress", "On Hold", "Completed", "Draft"] as const;
type StatusFilter = (typeof filterStatuses)[number];

type Filters = {
  fromDate: string;
  toDate: string;
  status: StatusFilter;
};

const initialFilters: Filters = {
  fromDate: "2025-04-01",
  toDate: "2025-04-12",
  status: "All Status",
};

const statusClass: Record<WorkOrderStatus, string> = {
  Draft: styles.draft,
  Pending: styles.pending,
  "In Progress": styles.inProgress,
  "On Hold": styles.onHold,
  Completed: styles.completed,
};

function StatusBadge({ status }: { status: WorkOrderStatus }) {
  return <span className={`${styles.statusBadge} ${statusClass[status]}`}>{status}</span>;
}

function ProductThumb({ kind }: { kind: ManufacturingWorkOrder["productKind"] }) {
  return <span aria-hidden="true" className={`${styles.productThumb} ${styles[kind]}`} />;
}

function subscribeToSavedOrders(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(WORK_ORDER_STORAGE_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(WORK_ORDER_STORAGE_EVENT, handleChange);
  };
}

function readSavedOrdersSnapshot() {
  try {
    return window.localStorage.getItem(WORK_ORDER_STORAGE_KEY) ?? EMPTY_SAVED_ORDERS;
  } catch {
    return EMPTY_SAVED_ORDERS;
  }
}

function parseSavedOrders(snapshot: string) {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter(isManufacturingWorkOrder) : [];
  } catch {
    return [];
  }
}

function mergeSavedOrders(saved: ManufacturingWorkOrder[]) {
  const savedNumbers = new Set(saved.map((order) => order.orderNo));
  return [...saved, ...initialManufacturingWorkOrders.filter((order) => !savedNumbers.has(order.orderNo))];
}

function Modal({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-labelledby="work-order-dialog-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}><h2 id="work-order-dialog-title">{title}</h2><button aria-label="Close work order details" autoFocus onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button></header>
        {children}
      </Card>
    </div>
  );
}

export function ManufacturingWorkOrderList() {
  const savedSnapshot = useSyncExternalStore(subscribeToSavedOrders, readSavedOrdersSnapshot, () => EMPTY_SAVED_ORDERS);
  const savedOrders = useMemo(() => parseSavedOrders(savedSnapshot), [savedSnapshot]);
  const baseOrders = useMemo(() => mergeSavedOrders(savedOrders), [savedOrders]);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, WorkOrderStatus>>({});
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters | null>(null);
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ManufacturingWorkOrder | null>(null);
  const [message, setMessage] = useState("");

  const orders = useMemo(
    () => baseOrders.map((order) => ({ ...order, status: statusOverrides[order.orderNo] ?? order.status })),
    [baseOrders, statusOverrides],
  );

  useEffect(() => {
    const saved = new URLSearchParams(window.location.search).get("saved");
    if (!saved) return;
    const timer = window.setTimeout(() => setMessage(`${saved} was saved successfully.`), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (openMenu === null) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [openMenu]);

  const filteredOrders = useMemo(() => {
    if (!appliedFilters) return orders;
    return orders.filter((order) => {
      const inRange = order.orderDate >= appliedFilters.fromDate && order.orderDate <= appliedFilters.toDate;
      const matchesStatus = appliedFilters.status === "All Status" || order.status === appliedFilters.status;
      return inRange && matchesStatus;
    });
  }, [appliedFilters, orders]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleOrders = filteredOrders.slice(start, start + PAGE_SIZE);
  const paginationStart = Math.min(Math.max(1, currentPage - 2), Math.max(1, pageCount - 4));
  const visiblePages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => paginationStart + index);

  function applyFilters() {
    if (draftFilters.fromDate > draftFilters.toDate) {
      setMessage("From Date must be before or equal to To Date.");
      return;
    }
    setAppliedFilters({ ...draftFilters });
    setPage(1);
    setOpenMenu(null);
    setMessage("Manufacturing order filters applied.");
  }

  function persistOrder(order: ManufacturingWorkOrder) {
    try {
      const value = window.localStorage.getItem(WORK_ORDER_STORAGE_KEY);
      const parsed: unknown = value ? JSON.parse(value) : [];
      const stored = Array.isArray(parsed) ? parsed.filter(isManufacturingWorkOrder) : [];
      window.localStorage.setItem(WORK_ORDER_STORAGE_KEY, JSON.stringify([order, ...stored.filter((item) => item.orderNo !== order.orderNo)]));
      window.dispatchEvent(new Event(WORK_ORDER_STORAGE_EVENT));
    } catch {
      // The in-memory update remains usable if storage is blocked.
    }
  }

  function updateStatus(order: ManufacturingWorkOrder, status: WorkOrderStatus) {
    const updated = { ...order, status };
    setStatusOverrides((current) => ({ ...current, [order.orderNo]: status }));
    persistOrder(updated);
    setSelectedOrder((current) => current?.orderNo === order.orderNo ? updated : current);
    setOpenMenu(null);
    setMessage(`${order.orderNo} marked ${status.toLowerCase()}.`);
  }

  return (
    <div className={styles.listPage}>
      <PageHeader
        action={<Link className="button button--primary" href="/manufacturing/work-orders/new"><Plus aria-hidden="true" size={17} />New Order</Link>}
        description="View and manage all manufacturing orders"
        title="Manufacturing Order List"
      />

      <Card className={styles.listCard}>
        <div className={styles.filterBar}>
          <label><span>From Date</span><input className="field" onChange={(event) => setDraftFilters((current) => ({ ...current, fromDate: event.target.value }))} type="date" value={draftFilters.fromDate} /></label>
          <label><span>To Date</span><input className="field" onChange={(event) => setDraftFilters((current) => ({ ...current, toDate: event.target.value }))} type="date" value={draftFilters.toDate} /></label>
          <label><span>Status</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, status: event.target.value as StatusFilter }))} value={draftFilters.status}>{filterStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <button className={`button button--primary ${styles.searchButton}`} onClick={applyFilters} type="button"><Search aria-hidden="true" size={17} />Search</button>
        </div>

        <p aria-live="polite" className={message ? styles.listMessage : "sr-only"}>{message}</p>

        <div className={styles.tableScroller}>
          <table className={styles.ordersTable}>
            <caption className="sr-only">Manufacturing work orders</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Order No</th><th scope="col">Product</th><th scope="col">Quantity</th><th scope="col">Karigar</th><th scope="col">Start Date</th><th scope="col">End Date</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {visibleOrders.map((order, index) => (
                <tr key={order.orderNo}>
                  <td>{start + index + 1}</td>
                  <td><strong>{order.orderNo}</strong></td>
                  <td><div className={styles.productCell}><ProductThumb kind={order.productKind} /><span><strong>{order.product}</strong><small>{order.designNo}</small></span></div></td>
                  <td>{order.quantity}</td>
                  <td>{order.karigar}</td>
                  <td>{formatWorkOrderDate(order.orderDate)}</td>
                  <td>{formatWorkOrderDate(order.expectedDate)}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td className={styles.actionCell}>
                    <button aria-expanded={openMenu === order.id} aria-haspopup="menu" aria-label={`Actions for ${order.orderNo}`} className={styles.moreButton} onClick={() => setOpenMenu((current) => current === order.id ? null : order.id)} type="button"><MoreHorizontal aria-hidden="true" size={18} /></button>
                    {openMenu === order.id ? <div className={styles.actionMenu} role="menu">
                      <button onClick={() => { setSelectedOrder(order); setOpenMenu(null); }} role="menuitem" type="button"><Eye size={14} />View details</button>
                      <button onClick={() => updateStatus(order, "Completed")} role="menuitem" type="button"><CheckCircle2 size={14} />Mark completed</button>
                      <button onClick={() => updateStatus(order, "On Hold")} role="menuitem" type="button"><PauseCircle size={14} />Put on hold</button>
                    </div> : null}
                  </td>
                </tr>
              ))}
              {!visibleOrders.length ? <tr><td className={styles.emptyState} colSpan={9}><strong>No manufacturing orders found</strong><span>Try a wider date range or another status.</span><button className="button" onClick={() => { setAppliedFilters(null); setDraftFilters(initialFilters); setPage(1); setMessage("Filters cleared."); }} type="button">Clear filters</button></td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>

      <footer className={styles.listFooter}>
        <p>Showing {filteredOrders.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length} records</p>
        <nav aria-label="Manufacturing work order pagination" className={styles.pagination}>
          <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} type="button"><ChevronsLeft size={16} /></button>
          {visiblePages.map((pageNumber) => <button aria-current={pageNumber === currentPage ? "page" : undefined} className={pageNumber === currentPage ? styles.currentPage : ""} key={pageNumber} onClick={() => setPage(pageNumber)} type="button">{pageNumber}</button>)}
          <button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} type="button"><ChevronsRight size={16} /></button>
        </nav>
      </footer>

      {selectedOrder ? <Modal onClose={() => setSelectedOrder(null)} title={selectedOrder.orderNo}>
        <div className={styles.orderDetails}>
          <div className={styles.detailsHero}><ProductThumb kind={selectedOrder.productKind} /><div><span>Product</span><strong>{selectedOrder.product}</strong><small>{selectedOrder.designNo}</small></div><StatusBadge status={selectedOrder.status} /></div>
          <dl>
            <div><dt>Karigar</dt><dd>{selectedOrder.karigar}</dd></div><div><dt>Quantity</dt><dd>{selectedOrder.quantity} {selectedOrder.unit}</dd></div>
            <div><dt>Start Date</dt><dd>{formatWorkOrderDate(selectedOrder.orderDate)}</dd></div><div><dt>End Date</dt><dd>{formatWorkOrderDate(selectedOrder.expectedDate)}</dd></div>
            <div><dt>Estimated Weight</dt><dd>{selectedOrder.estimatedWeight.toFixed(3)} g</dd></div><div><dt>Priority</dt><dd>{selectedOrder.priority}</dd></div>
          </dl>
          <div className={styles.detailRemarks}><span>Remarks</span><p>{selectedOrder.remarks || "No remarks added."}</p></div>
          <footer className={styles.modalActions}><button className="button" onClick={() => setSelectedOrder(null)} type="button">Close</button>{selectedOrder.status !== "Completed" ? <button className="button button--primary" onClick={() => updateStatus(selectedOrder, "Completed")} type="button"><CheckCircle2 size={15} />Mark Completed</button> : null}</footer>
        </div>
      </Modal> : null}
    </div>
  );
}
