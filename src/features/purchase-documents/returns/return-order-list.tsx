"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";

import {
  RETURN_ORDER_DELETED_KEY,
  RETURN_ORDER_EVENT,
  RETURN_ORDER_FLASH_KEY,
  RETURN_ORDER_STORAGE_KEY,
  formatReturnDate,
  initialReturnOrders,
  isReturnOrder,
  readSavedReturnOrders,
  returnOrderSuppliers,
  returnOrderTotal,
  type ReturnOrder,
  type ReturnOrderStatus,
} from "./return-order-data";
import styles from "./return-orders.module.css";

const EMPTY_SNAPSHOT = JSON.stringify(["[]", "[]"]);

type Filters = { query: string; supplier: string; from: string; to: string };
type DialogState = { mode: "view" | "edit"; record: ReturnOrder } | null;
type EditDraft = { supplier: string; returnDateIso: string; originalPo: string; status: ReturnOrderStatus; remarks: string };

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(RETURN_ORDER_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(RETURN_ORDER_EVENT, onChange);
  };
}

function getSnapshot() {
  try {
    return JSON.stringify([
      window.localStorage.getItem(RETURN_ORDER_STORAGE_KEY) ?? "[]",
      window.localStorage.getItem(RETURN_ORDER_DELETED_KEY) ?? "[]",
    ]);
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

function parseSnapshot(snapshot: string) {
  try {
    const pair: unknown = JSON.parse(snapshot);
    if (!Array.isArray(pair) || typeof pair[0] !== "string" || typeof pair[1] !== "string") return { saved: [] as ReturnOrder[], deleted: [] as string[] };
    const savedValue: unknown = JSON.parse(pair[0]);
    const deletedValue: unknown = JSON.parse(pair[1]);
    return {
      saved: Array.isArray(savedValue) ? savedValue.filter(isReturnOrder) : [],
      deleted: Array.isArray(deletedValue) ? deletedValue.filter((value): value is string => typeof value === "string") : [],
    };
  } catch {
    return { saved: [] as ReturnOrder[], deleted: [] as string[] };
  }
}

function mergeRecords(saved: ReturnOrder[]) {
  const savedIds = new Set(saved.map((record) => record.id));
  return [...saved, ...initialReturnOrders.filter((record) => !savedIds.has(record.id))];
}

function StatusBadge({ status }: { status: ReturnOrderStatus }) {
  return <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>{status}</span>;
}

export function ReturnOrderList() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_SNAPSHOT);
  const storedState = useMemo(() => parseSnapshot(snapshot), [snapshot]);
  const records = useMemo(() => mergeRecords(storedState.saved).filter((record) => !storedState.deleted.includes(record.id)), [storedState]);
  const [query, setQuery] = useState("");
  const [supplier, setSupplier] = useState("All Suppliers");
  const [from, setFrom] = useState("2025-04-01");
  const [to, setTo] = useState("2025-04-30");
  const [filters, setFilters] = useState<Filters>({ query: "", supplier: "All Suppliers", from: "2025-04-01", to: "2025-04-30" });
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState<DialogState>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const search = filters.query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesSearch = !search || [record.returnNo, record.supplier, record.originalPo].some((value) => value.toLowerCase().includes(search));
      return matchesSearch
        && (filters.supplier === "All Suppliers" || record.supplier === filters.supplier)
        && (!filters.from || record.returnDateIso >= filters.from)
        && (!filters.to || record.returnDateIso <= filters.to);
    });
  }, [filters, records]);

  useEffect(() => {
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => modalRef.current?.querySelector<HTMLElement>("button, input, select")?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDialog(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [dialog]);

  useEffect(() => {
    let timer: number | undefined;
    try {
      const flash = window.sessionStorage.getItem(RETURN_ORDER_FLASH_KEY);
      if (flash) {
        window.sessionStorage.removeItem(RETURN_ORDER_FLASH_KEY);
        timer = window.setTimeout(() => setMessage(flash), 0);
      }
    } catch {
      // Storage feedback is optional.
    }
    return () => window.clearTimeout(timer);
  }, []);

  function applyFilters() {
    if (from && to && from > to) {
      setMessage("From Date must be before To Date.");
      return;
    }
    setFilters({ query, supplier, from, to });
    setMessage("Purchase return filters applied.");
  }

  function openDialog(record: ReturnOrder, mode: "view" | "edit") {
    setDialog({ mode, record });
    setDraft({ supplier: record.supplier, returnDateIso: record.returnDateIso, originalPo: record.originalPo, status: record.status, remarks: record.remarks });
  }

  function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dialog || !draft) return;
    const updated: ReturnOrder = {
      ...dialog.record,
      supplier: draft.supplier,
      returnDateIso: draft.returnDateIso,
      returnDate: formatReturnDate(draft.returnDateIso),
      originalPo: draft.originalPo.trim(),
      status: draft.status,
      remarks: draft.remarks.trim(),
    };
    const saved = readSavedReturnOrders();
    window.localStorage.setItem(RETURN_ORDER_STORAGE_KEY, JSON.stringify([updated, ...saved.filter((item) => item.id !== updated.id)]));
    window.dispatchEvent(new Event(RETURN_ORDER_EVENT));
    setDialog(null);
    setMessage(`${updated.returnNo} updated successfully.`);
  }

  function deleteRecord(record: ReturnOrder) {
    if (!window.confirm(`Delete ${record.returnNo}?`)) return;
    try {
      const currentValue: unknown = JSON.parse(window.localStorage.getItem(RETURN_ORDER_DELETED_KEY) ?? "[]");
      const deleted = new Set(Array.isArray(currentValue) ? currentValue.filter((value): value is string => typeof value === "string") : []);
      deleted.add(record.id);
      window.localStorage.setItem(RETURN_ORDER_DELETED_KEY, JSON.stringify([...deleted]));
      window.localStorage.setItem(RETURN_ORDER_STORAGE_KEY, JSON.stringify(readSavedReturnOrders().filter((item) => item.id !== record.id)));
      window.dispatchEvent(new Event(RETURN_ORDER_EVENT));
      setMessage(`${record.returnNo} deleted.`);
    } catch {
      setMessage("The return could not be deleted from browser storage.");
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.listHeader}>
        <div><h1>Purchase Return List</h1><nav aria-label="Breadcrumb"><Link href="/dashboard">Home</Link><span>›</span><Link href="/purchases">Purchase</Link><span>›</span><span aria-current="page">Purchase Return List</span></nav></div>
        <Link className={`${styles.violetButton} button`} href="/purchases/return-orders/new"><Plus size={16} />New Purchase Return</Link>
      </header>

      <Card className={styles.listCard}>
        <div className={styles.filters}>
          <label className={styles.searchField}><span className="sr-only">Search returns</span><Search size={15} /><input onChange={(event) => setQuery(event.target.value)} placeholder="Search return..." type="search" value={query} /></label>
          <label><span className="sr-only">Supplier</span><select className="select" onChange={(event) => setSupplier(event.target.value)} value={supplier}><option>All Suppliers</option>{returnOrderSuppliers.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label><span className="sr-only">From date</span><input aria-label="From date" className="field" onChange={(event) => setFrom(event.target.value)} type="date" value={from} /></label>
          <label><span className="sr-only">To date</span><input aria-label="To date" className="field" onChange={(event) => setTo(event.target.value)} type="date" value={to} /></label>
          <button className={`${styles.violetButton} button`} onClick={applyFilters} type="button"><Search size={16} />Search</button>
        </div>
        {message ? <p aria-live="polite" className={styles.listMessage}>{message}</p> : null}
        <div className={styles.tableScroller}>
          <table className={styles.listTable}>
            <caption className="sr-only">Purchase return list</caption>
            <thead><tr><th>SL</th><th>Return No</th><th>Return Date</th><th>Supplier</th><th>Original PO</th><th>Total Amount (৳)</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((record, index) => <tr key={record.id}>
                <td>{index + 1}</td><td><strong>{record.returnNo}</strong></td><td>{record.returnDate}</td><td>{record.supplier}</td><td>{record.originalPo}</td><td>{returnOrderTotal(record).toLocaleString("en-IN")}</td><td><StatusBadge status={record.status} /></td>
                <td><div className={styles.rowActions}><button aria-label={`View ${record.returnNo}`} onClick={() => openDialog(record, "view")} title="View" type="button"><Eye size={15} /></button><button aria-label={`Edit ${record.returnNo}`} onClick={() => openDialog(record, "edit")} title="Edit" type="button"><Pencil size={15} /></button><button aria-label={`Delete ${record.returnNo}`} className={styles.deleteButton} onClick={() => deleteRecord(record)} title="Delete" type="button"><Trash2 size={15} /></button></div></td>
              </tr>)}
              {!filtered.length ? <tr><td className={styles.empty} colSpan={8}>No purchase returns match the selected filters.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <footer className={styles.listFooter}><p>Showing 1 to {filtered.length} of {filtered.length} entries</p><nav aria-label="Pagination"><button aria-label="Previous page" disabled type="button"><ChevronLeft size={16} /></button><button aria-current="page" className={styles.currentPage} type="button">1</button><button aria-label="Next page" disabled type="button"><ChevronRight size={16} /></button></nav></footer>
      </Card>

      {dialog && draft ? <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }} ref={modalRef}>
        <Card aria-labelledby="return-order-dialog-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
          <header className={styles.modalHeader}><div><h2 id="return-order-dialog-title">{dialog.mode === "edit" ? "Edit" : "Purchase Return"} {dialog.record.returnNo}</h2><p>{dialog.record.supplier}</p></div><button aria-label="Close dialog" onClick={() => setDialog(null)} type="button"><X size={18} /></button></header>
          {dialog.mode === "view" ? <dl className={styles.viewGrid}>
            <div><dt>Return Date</dt><dd>{dialog.record.returnDate}</dd></div><div><dt>Original Purchase</dt><dd>{dialog.record.originalPo}</dd></div><div><dt>Reason</dt><dd>{dialog.record.returnReason}</dd></div><div><dt>Status</dt><dd><StatusBadge status={dialog.record.status} /></dd></div><div><dt>Total Weight</dt><dd>{dialog.record.items.reduce((sum, item) => sum + item.weight, 0).toFixed(3)} gm</dd></div><div><dt>Total Amount</dt><dd>৳ {returnOrderTotal(dialog.record).toLocaleString("en-IN")}</dd></div><div className={styles.fullSpan}><dt>Remarks</dt><dd>{dialog.record.remarks || "—"}</dd></div>
          </dl> : <form className={styles.modalForm} onSubmit={saveEdit}>
            <label><span>Supplier</span><select className="select" onChange={(event) => setDraft((current) => current ? { ...current, supplier: event.target.value } : current)} value={draft.supplier}>{returnOrderSuppliers.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label><span>Return Date</span><input className="field" onChange={(event) => setDraft((current) => current ? { ...current, returnDateIso: event.target.value } : current)} type="date" value={draft.returnDateIso} /></label>
            <label><span>Original PO</span><input className="field" onChange={(event) => setDraft((current) => current ? { ...current, originalPo: event.target.value } : current)} value={draft.originalPo} /></label>
            <label><span>Status</span><select className="select" onChange={(event) => setDraft((current) => current ? { ...current, status: event.target.value as ReturnOrderStatus } : current)} value={draft.status}><option>Completed</option><option>Pending</option><option>Cancelled</option></select></label>
            <label className={styles.fullSpan}><span>Remarks</span><textarea className="textarea" onChange={(event) => setDraft((current) => current ? { ...current, remarks: event.target.value } : current)} value={draft.remarks} /></label>
            <footer className={styles.modalActions}><button className="button" onClick={() => setDialog(null)} type="button">Cancel</button><button className={`${styles.violetButton} button`} type="submit"><Save size={15} />Save Changes</button></footer>
          </form>}
        </Card>
      </div> : null}
    </div>
  );
}
