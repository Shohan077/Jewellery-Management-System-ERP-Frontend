"use client";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  initialProductionOrders,
  karigarOptions,
  productOptions,
  productionStatuses,
} from "./production-order-data";
import type { ProductionOrder, ProductionStatus } from "./production-order-data";
import styles from "./production-order-management.module.css";

const PAGE_SIZE = 10;
const statusFilters = ["All Status", ...productionStatuses] as const;
const karigarFilters = ["All Karigar", ...karigarOptions] as const;

type DialogState =
  | { mode: "add" }
  | { mode: "view" | "edit" | "delete"; order: ProductionOrder }
  | null;

const statusClass: Record<ProductionStatus, string> = {
  Pending: styles.pending,
  "In Progress": styles.inProgress,
  Completed: styles.completed,
  Delayed: styles.delayed,
};

function StatusBadge({ status }: { status: ProductionStatus }) {
  return <span className={`${styles.status} ${statusClass[status]}`}>{status}</span>;
}

function ModalShell({ children, description, onClose, title }: { children: ReactNode; description: string; onClose: () => void; title: string }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-describedby="production-dialog-description" aria-labelledby="production-dialog-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div><h2 id="production-dialog-title">{title}</h2><p id="production-dialog-description">{description}</p></div>
          <button aria-label={`Close ${title}`} onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button>
        </header>
        {children}
      </Card>
    </div>
  );
}

function toInputDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return "2025-04-30";
  return parsed.toISOString().slice(0, 10);
}

function displayDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

function OrderForm({ initial, onCancel, onSubmit }: { initial?: ProductionOrder; onCancel: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <form className={styles.orderForm} onSubmit={onSubmit}>
      <label><span>Product <em>*</em></span><select autoFocus className="select" defaultValue={initial?.productName ?? productOptions[0]} name="productName" required>{productOptions.map((product) => <option key={product}>{product}</option>)}</select></label>
      <label><span>Karigar <em>*</em></span><select className="select" defaultValue={initial?.karigar ?? karigarOptions[0]} name="karigar" required>{karigarOptions.map((karigar) => <option key={karigar}>{karigar}</option>)}</select></label>
      <label><span>Quantity <em>*</em></span><input className="field" defaultValue={initial?.quantity ?? 1} min="1" name="quantity" required type="number" /></label>
      <label><span>Status <em>*</em></span><select className="select" defaultValue={initial?.status ?? "Pending"} name="status" required>{productionStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
      <label><span>Start Date <em>*</em></span><input className="field" defaultValue={initial ? toInputDate(initial.startDate) : "2025-04-30"} name="startDate" required type="date" /></label>
      <label><span>Due Date <em>*</em></span><input className="field" defaultValue={initial ? toInputDate(initial.dueDate) : "2025-05-08"} name="dueDate" required type="date" /></label>
      <footer className={styles.modalActions}>
        <button className="button" onClick={onCancel} type="button">Cancel</button>
        <button className="button button--primary" type="submit"><Plus aria-hidden="true" size={16} />{initial ? "Save Changes" : "Create Order"}</button>
      </footer>
    </form>
  );
}

function readOrderForm(event: FormEvent<HTMLFormElement>) {
  const form = new FormData(event.currentTarget);
  return {
    productName: String(form.get("productName")),
    karigar: String(form.get("karigar")),
    quantity: Math.max(1, Number(form.get("quantity"))),
    startDate: displayDate(String(form.get("startDate"))),
    dueDate: displayDate(String(form.get("dueDate"))),
    status: String(form.get("status")) as ProductionStatus,
  };
}

export function ProductionOrderManagement() {
  const [orders, setOrders] = useState(initialProductionOrders);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("All Status");
  const [karigar, setKarigar] = useState<(typeof karigarFilters)[number]>("All Karigar");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [message, setMessage] = useState("");

  const metrics = useMemo(() => ({
    total: orders.length,
    inProgress: orders.filter((order) => order.status === "In Progress" || order.status === "Pending").length,
    completed: orders.filter((order) => order.status === "Completed").length,
    delayed: orders.filter((order) => order.status === "Delayed").length,
  }), [orders]);

  const filteredOrders = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesTerm = !term || [order.orderNo, order.productName, order.karigar].some((value) => value.toLowerCase().includes(term));
      const matchesStatus = status === "All Status" || order.status === status;
      const matchesKarigar = karigar === "All Karigar" || order.karigar === karigar;
      return matchesTerm && matchesStatus && matchesKarigar;
    });
  }, [deferredQuery, karigar, orders, status]);

  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleOrders = filteredOrders.slice(start, start + PAGE_SIZE);

  function resetPosition() {
    setPage(1);
    setMessage("");
  }

  function saveNewOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = readOrderForm(event);
    const id = Math.max(0, ...orders.map((order) => order.id)) + 1;
    const orderNo = `PO-${String(id).padStart(3, "0")}`;
    setOrders((current) => [{ id, orderNo, ...values }, ...current]);
    setDialog(null);
    setQuery("");
    setStatus("All Status");
    setKarigar("All Karigar");
    setPage(1);
    setMessage(`${orderNo} was created successfully.`);
  }

  function saveEditedOrder(event: FormEvent<HTMLFormElement>, order: ProductionOrder) {
    event.preventDefault();
    const values = readOrderForm(event);
    setOrders((current) => current.map((item) => item.id === order.id ? { ...item, ...values } : item));
    setDialog(null);
    setMessage(`${order.orderNo} was updated successfully.`);
  }

  function deleteOrder(order: ProductionOrder) {
    setOrders((current) => current.filter((item) => item.id !== order.id));
    setDialog(null);
    setMessage(`${order.orderNo} was deleted.`);
  }

  function advanceOrder(order: ProductionOrder) {
    const nextStatus: Record<ProductionStatus, ProductionStatus> = {
      Pending: "In Progress",
      "In Progress": "Completed",
      Completed: "Pending",
      Delayed: "In Progress",
    };
    const next = nextStatus[order.status];
    setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: next } : item));
    setMessage(`${order.orderNo} moved to ${next}.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<button className="button button--primary" onClick={() => setDialog({ mode: "add" })} type="button"><Plus aria-hidden="true" size={16} />New Production Order</button>}
        description="Manage manufacturing and production orders"
        title="Production Order"
      />

      <section aria-label="Production order overview" className={styles.metrics}>
        <Card as="article" className={styles.metric}><span>Total Orders</span><div><strong className={styles.blue}>{metrics.total}</strong><small>↑ 15%</small></div></Card>
        <Card as="article" className={styles.metric}><span>In Progress</span><strong>{metrics.inProgress}</strong></Card>
        <Card as="article" className={styles.metric}><span>Completed</span><strong className={styles.green}>{metrics.completed}</strong></Card>
        <Card as="article" className={styles.metric}><span>Delayed</span><strong className={styles.red}>{metrics.delayed}</strong></Card>
      </section>

      <Card className={styles.listCard}>
        <div className={styles.filters}>
          <label className={styles.searchField}><Search aria-hidden="true" size={16} /><span className="sr-only">Search production orders</span><input onChange={(event) => { setQuery(event.target.value); resetPosition(); }} placeholder="Search by order no, product or karigar..." type="search" value={query} /></label>
          <label className={styles.selectField}><span className="sr-only">Filter by status</span><select onChange={(event) => { setStatus(event.target.value as typeof status); resetPosition(); }} value={status}>{statusFilters.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label className={styles.selectField}><span className="sr-only">Filter by karigar</span><select onChange={(event) => { setKarigar(event.target.value as typeof karigar); resetPosition(); }} value={karigar}>{karigarFilters.map((option) => <option key={option}>{option}</option>)}</select></label>
          <button className={`button ${styles.filterButton}`} onClick={() => setMessage(`${filteredOrders.length} production orders match the current filters.`)} type="button"><Filter aria-hidden="true" size={15} />Filter</button>
        </div>

        <p aria-live="polite" className={message ? styles.activity : "sr-only"}>{message}</p>

        <div className={styles.tableScroller}>
          <table className={styles.table}>
            <caption className="sr-only">Production orders</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Order No</th><th scope="col">Product Name</th><th scope="col">Karigar</th><th scope="col">Qty</th><th scope="col">Start Date</th><th scope="col">Due Date</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {visibleOrders.map((order, index) => (
                <tr key={order.id}>
                  <td>{start + index + 1}</td><td><strong>{order.orderNo}</strong></td><td>{order.productName}</td><td>{order.karigar}</td><td>{order.quantity}</td><td>{order.startDate}</td><td>{order.dueDate}</td><td><StatusBadge status={order.status} /></td>
                  <td><div className={styles.actions}>
                    <button aria-label={`View ${order.orderNo}`} onClick={() => setDialog({ mode: "view", order })} title="View order" type="button"><Eye aria-hidden="true" size={14} /></button>
                    <button aria-label={`Edit ${order.orderNo}`} onClick={() => setDialog({ mode: "edit", order })} title="Edit order" type="button"><Pencil aria-hidden="true" size={13} /></button>
                    <button aria-label={`Advance ${order.orderNo} status`} onClick={() => advanceOrder(order)} title="Advance status" type="button"><Plus aria-hidden="true" size={14} /></button>
                    <button aria-label={`Delete ${order.orderNo}`} className={styles.deleteButton} onClick={() => setDialog({ mode: "delete", order })} title="Delete order" type="button"><Trash2 aria-hidden="true" size={13} /></button>
                  </div></td>
                </tr>
              ))}
              {!visibleOrders.length ? <tr><td className={styles.empty} colSpan={9}><strong>No production orders found</strong><span>Try another search or clear the filters.</span><button className="button" onClick={() => { setQuery(""); setStatus("All Status"); setKarigar("All Karigar"); setPage(1); }} type="button">Clear filters</button></td></tr> : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.footer}>
          <p>Showing {filteredOrders.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length} production orders</p>
          <nav aria-label="Production order pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={16} /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => <button aria-current={currentPage === item ? "page" : undefined} className={currentPage === item ? styles.currentPage : ""} key={item} onClick={() => setPage(item)} type="button">{item}</button>)}
            <button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight aria-hidden="true" size={16} /></button>
          </nav>
        </footer>
      </Card>

      {dialog?.mode === "add" ? <ModalShell description="Assign an item to a karigar and set its production timeline." onClose={() => setDialog(null)} title="New Production Order"><OrderForm onCancel={() => setDialog(null)} onSubmit={saveNewOrder} /></ModalShell> : null}
      {dialog?.mode === "edit" ? <ModalShell description={`Update the assignment and timeline for ${dialog.order.orderNo}.`} onClose={() => setDialog(null)} title="Edit Production Order"><OrderForm initial={dialog.order} onCancel={() => setDialog(null)} onSubmit={(event) => saveEditedOrder(event, dialog.order)} /></ModalShell> : null}
      {dialog?.mode === "view" ? <ModalShell description="Production assignment and progress details." onClose={() => setDialog(null)} title={dialog.order.orderNo}><div className={styles.details}><div className={styles.detailsHero}><div><span>Product</span><strong>{dialog.order.productName}</strong></div><StatusBadge status={dialog.order.status} /></div><dl><div><dt>Karigar</dt><dd>{dialog.order.karigar}</dd></div><div><dt>Quantity</dt><dd>{dialog.order.quantity}</dd></div><div><dt>Start Date</dt><dd>{dialog.order.startDate}</dd></div><div><dt>Due Date</dt><dd>{dialog.order.dueDate}</dd></div></dl><footer className={styles.modalActions}><button className="button" onClick={() => setDialog(null)} type="button">Close</button><button className="button button--primary" onClick={() => setDialog({ mode: "edit", order: dialog.order })} type="button"><Pencil aria-hidden="true" size={14} />Edit Order</button></footer></div></ModalShell> : null}
      {dialog?.mode === "delete" ? <ModalShell description="This removes the order from the production list." onClose={() => setDialog(null)} title="Delete Production Order"><div className={styles.deleteConfirm}><p>Delete <strong>{dialog.order.orderNo}</strong> for {dialog.order.productName}?</p><footer className={styles.modalActions}><button className="button" onClick={() => setDialog(null)} type="button">Cancel</button><button className={`button ${styles.dangerButton}`} onClick={() => deleteOrder(dialog.order)} type="button"><Trash2 aria-hidden="true" size={14} />Delete Order</button></footer></div></ModalShell> : null}
    </div>
  );
}
