"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  PURCHASE_RETURNS_DELETED_STORAGE_KEY,
  PURCHASE_RETURNS_STORAGE_EVENT,
  PURCHASE_RETURNS_STORAGE_KEY,
  formatPurchaseReturnDate,
  initialPurchaseReturns,
  isPurchaseReturnRecord,
  purchaseReturnSuppliers,
  type PurchaseReturnRecord,
  type PurchaseReturnStatus,
} from "./purchase-return-data";
import styles from "./purchase-returns.module.css";

const PAGE_SIZE = 8;
const EMPTY_SAVED_RETURNS = "[]";
const EMPTY_DELETED_RETURNS = "[]";
const EMPTY_STORAGE_SNAPSHOT = JSON.stringify([EMPTY_SAVED_RETURNS, EMPTY_DELETED_RETURNS]);

type Feedback = { tone: "error" | "success"; message: string } | null;

type AppliedFilters = {
  query: string;
  supplier: string;
  status: string;
  fromDate: string;
  toDate: string;
} | null;

type EditDraft = {
  supplier: string;
  returnDate: string;
  referenceNo: string;
  total: string;
  status: PurchaseReturnStatus;
  remarks: string;
};

function subscribeToReturns(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(PURCHASE_RETURNS_STORAGE_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(PURCHASE_RETURNS_STORAGE_EVENT, handleChange);
  };
}

function readStorageSnapshot() {
  try {
    return JSON.stringify([
      window.localStorage.getItem(PURCHASE_RETURNS_STORAGE_KEY) ?? EMPTY_SAVED_RETURNS,
      window.localStorage.getItem(PURCHASE_RETURNS_DELETED_STORAGE_KEY) ?? EMPTY_DELETED_RETURNS,
    ]);
  } catch {
    return EMPTY_STORAGE_SNAPSHOT;
  }
}

function parseStoredReturns(serialized: string) {
  try {
    const value: unknown = JSON.parse(serialized);
    return Array.isArray(value) ? value.filter(isPurchaseReturnRecord) : [];
  } catch {
    return [];
  }
}

function parseStorageSnapshot(snapshot: string) {
  try {
    const pair: unknown = JSON.parse(snapshot);
    if (!Array.isArray(pair) || typeof pair[0] !== "string" || typeof pair[1] !== "string") {
      return { saved: [] as PurchaseReturnRecord[], deletedIds: [] as string[] };
    }
    const deleted: unknown = JSON.parse(pair[1]);
    return {
      saved: parseStoredReturns(pair[0]),
      deletedIds: Array.isArray(deleted)
        ? deleted.filter((item): item is string => typeof item === "string")
        : [],
    };
  } catch {
    return { saved: [] as PurchaseReturnRecord[], deletedIds: [] as string[] };
  }
}

function mergeReturns(saved: PurchaseReturnRecord[]) {
  const savedNumbers = new Set(saved.map((record) => record.returnNo));
  return [
    ...saved,
    ...initialPurchaseReturns.filter((record) => !savedNumbers.has(record.returnNo)),
  ];
}

function readDeletedIds() {
  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(PURCHASE_RETURNS_DELETED_STORAGE_KEY) ?? EMPTY_DELETED_RETURNS,
    );
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function pageNumbers(pageCount: number) {
  return Array.from({ length: Math.min(5, pageCount) }, (_, index) => index + 1);
}

function StatusBadge({ status }: { status: PurchaseReturnStatus }) {
  return <span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}>{status}</span>;
}

export function PurchaseReturnList() {
  const storageSnapshot = useSyncExternalStore(
    subscribeToReturns,
    readStorageSnapshot,
    () => EMPTY_STORAGE_SNAPSHOT,
  );
  const storedState = useMemo(() => parseStorageSnapshot(storageSnapshot), [storageSnapshot]);
  const mergedRecords = useMemo(() => mergeReturns(storedState.saved), [storedState.saved]);
  const [sessionDeletedIds, setSessionDeletedIds] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState("");
  const [supplier, setSupplier] = useState("All Suppliers");
  const [status, setStatus] = useState("All Status");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(null);
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [editing, setEditing] = useState<PurchaseReturnRecord | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const editDialogRef = useRef<HTMLDivElement>(null);

  const records = useMemo(
    () => mergedRecords.filter((record) => !storedState.deletedIds.includes(record.id) && !sessionDeletedIds.has(record.id)),
    [mergedRecords, sessionDeletedIds, storedState.deletedIds],
  );

  const suppliers = useMemo(
    () => [...new Set([...purchaseReturnSuppliers, ...records.map((record) => record.supplier)])],
    [records],
  );

  const filteredRecords = useMemo(() => {
    if (!appliedFilters) return records;
    const search = appliedFilters.query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesSearch = !search
        || record.returnNo.toLowerCase().includes(search)
        || record.supplier.toLowerCase().includes(search)
        || record.referenceNo.toLowerCase().includes(search);
      const matchesSupplier = appliedFilters.supplier === "All Suppliers" || record.supplier === appliedFilters.supplier;
      const matchesStatus = appliedFilters.status === "All Status" || record.status === appliedFilters.status;
      const matchesFrom = !appliedFilters.fromDate || record.returnDateIso >= appliedFilters.fromDate;
      const matchesTo = !appliedFilters.toDate || record.returnDateIso <= appliedFilters.toDate;
      return matchesSearch && matchesSupplier && matchesStatus && matchesFrom && matchesTo;
    });
  }, [appliedFilters, records]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleRecords = filteredRecords.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    if (!editing) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => editDialogRef.current?.querySelector<HTMLElement>("input, select")?.focus(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEditing(null);
        setEditDraft(null);
        return;
      }
      if (event.key !== "Tab" || !editDialogRef.current) return;
      const controls = Array.from(editDialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = bodyOverflow;
      previouslyFocused?.focus();
    };
  }, [editing]);

  function searchReturns() {
    if (fromDate && toDate && fromDate > toDate) {
      setFeedback({ tone: "error", message: "The from date must be before the to date." });
      return;
    }
    setAppliedFilters({ query, supplier, status, fromDate, toDate });
    setPage(1);
    setFeedback({ tone: "success", message: "Purchase return filters applied." });
  }

  function clearFilters() {
    setQuery("");
    setSupplier("All Suppliers");
    setStatus("All Status");
    setFromDate("");
    setToDate("");
    setAppliedFilters(null);
    setPage(1);
    setFeedback({ tone: "success", message: "Filters cleared. All purchase returns are shown." });
  }

  function startEditing(record: PurchaseReturnRecord) {
    setEditing(record);
    setEditDraft({
      supplier: record.supplier,
      returnDate: record.returnDateIso,
      referenceNo: record.referenceNo,
      total: String(record.total),
      status: record.status,
      remarks: record.remarks,
    });
    setFeedback(null);
  }

  function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || !editDraft) return;
    const total = Number(editDraft.total);
    if (!editDraft.supplier || !editDraft.returnDate || !editDraft.referenceNo.trim() || !Number.isFinite(total) || total <= 0) {
      setFeedback({ tone: "error", message: "Complete all required edit fields with valid values." });
      return;
    }
    const updated: PurchaseReturnRecord = {
      ...editing,
      supplier: editDraft.supplier,
      returnDateIso: editDraft.returnDate,
      returnDate: formatPurchaseReturnDate(editDraft.returnDate),
      referenceNo: editDraft.referenceNo.trim(),
      total,
      status: editDraft.status,
      remarks: editDraft.remarks.trim(),
    };
    try {
      const stored = parseStoredReturns(
        window.localStorage.getItem(PURCHASE_RETURNS_STORAGE_KEY) ?? EMPTY_SAVED_RETURNS,
      );
      window.localStorage.setItem(
        PURCHASE_RETURNS_STORAGE_KEY,
        JSON.stringify([updated, ...stored.filter((record) => record.returnNo !== updated.returnNo)]),
      );
      window.dispatchEvent(new Event(PURCHASE_RETURNS_STORAGE_EVENT));
      setEditing(null);
      setEditDraft(null);
      setFeedback({ tone: "success", message: `${updated.returnNo} updated successfully.` });
    } catch {
      setFeedback({ tone: "error", message: `${editing.returnNo} could not be updated in browser storage.` });
    }
  }

  function deleteReturn(record: PurchaseReturnRecord) {
    if (!window.confirm(`Delete ${record.returnNo} from the purchase return list?`)) return;
    setSessionDeletedIds((current) => new Set(current).add(record.id));
    try {
      const stored = parseStoredReturns(
        window.localStorage.getItem(PURCHASE_RETURNS_STORAGE_KEY) ?? EMPTY_SAVED_RETURNS,
      );
      const deletedIds = new Set(readDeletedIds());
      deletedIds.add(record.id);
      window.localStorage.setItem(
        PURCHASE_RETURNS_STORAGE_KEY,
        JSON.stringify(stored.filter((item) => item.returnNo !== record.returnNo)),
      );
      window.localStorage.setItem(PURCHASE_RETURNS_DELETED_STORAGE_KEY, JSON.stringify([...deletedIds]));
      window.dispatchEvent(new Event(PURCHASE_RETURNS_STORAGE_EVENT));
      setFeedback({ tone: "success", message: `${record.returnNo} deleted from the purchase return list.` });
    } catch {
      setFeedback({ tone: "error", message: `${record.returnNo} is hidden for this session, but browser storage is unavailable.` });
    }
  }

  return (
    <div className={styles.listPage}>
      <PageHeader
        action={<Link className="button button--primary" href="/purchases/returns/new"><Plus aria-hidden="true" size={17} />Add Purchase Return</Link>}
        description="View and manage supplier purchase returns"
        title="Purchase Return"
      />

      <Card className={styles.listCard}>
        <div className={styles.listFilters}>
          <label className={`${styles.control} ${styles.searchField}`}>
            <span className="sr-only">Search purchase returns</span>
            <span className={styles.searchControl}><Search aria-hidden="true" size={16} /><input onChange={(event) => setQuery(event.target.value)} placeholder="Search return number or supplier..." type="search" value={query} /></span>
          </label>
          <label className={styles.control}>
            <span className="sr-only">Supplier</span>
            <select className="select" onChange={(event) => setSupplier(event.target.value)} value={supplier}>
              <option>All Suppliers</option>
              {suppliers.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className={styles.control}>
            <span className="sr-only">Status</span>
            <select className="select" onChange={(event) => setStatus(event.target.value)} value={status}>
              <option>All Status</option><option>Completed</option><option>Pending</option><option>Rejected</option>
            </select>
          </label>
          <label className={styles.control}>
            <span>From Date</span>
            <input className="field" onChange={(event) => setFromDate(event.target.value)} type="date" value={fromDate} />
          </label>
          <label className={styles.control}>
            <span>To Date</span>
            <input className="field" onChange={(event) => setToDate(event.target.value)} type="date" value={toDate} />
          </label>
          <button className="button button--primary" onClick={searchReturns} type="button"><Search aria-hidden="true" size={16} />Search</button>
          {appliedFilters ? <button aria-label="Clear filters" className={styles.clearButton} onClick={clearFilters} title="Clear filters" type="button"><RotateCcw aria-hidden="true" size={16} /></button> : null}
        </div>

        <p
          aria-live="polite"
          className={feedback ? `${styles.feedback} ${styles[feedback.tone]} ${styles.listFeedback}` : "sr-only"}
          role={feedback?.tone === "error" ? "alert" : "status"}
        >
          {feedback?.tone === "success" ? <CheckCircle2 aria-hidden="true" size={16} /> : <CircleAlert aria-hidden="true" size={16} />}
          {feedback?.message ?? ""}
        </p>

        <div className={styles.tableScroller}>
          <table className={styles.returnTable}>
            <caption className="sr-only">Supplier purchase return records</caption>
            <thead>
              <tr>
                <th scope="col">SL</th>
                <th scope="col">Return No</th>
                <th scope="col">Supplier Name</th>
                <th scope="col">Return Date</th>
                <th scope="col">Reference No</th>
                <th scope="col">Total Amount ({"\u09F3"})</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.map((record, index) => (
                <tr key={record.id}>
                  <td>{start + index + 1}</td>
                  <td><strong>{record.returnNo}</strong></td>
                  <td>{record.supplier}</td>
                  <td>{record.returnDate}</td>
                  <td>{record.referenceNo}</td>
                  <td>{record.total.toLocaleString("en-IN")}</td>
                  <td><StatusBadge status={record.status} /></td>
                  <td>
                    <div className={styles.rowActions}>
                      <button aria-label={`Edit ${record.returnNo}`} onClick={() => startEditing(record)} title={`Edit ${record.returnNo}`} type="button"><Pencil aria-hidden="true" size={15} /></button>
                      <button aria-label={`Delete ${record.returnNo}`} className={styles.dangerAction} onClick={() => deleteReturn(record)} title={`Delete ${record.returnNo}`} type="button"><Trash2 aria-hidden="true" size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!visibleRecords.length ? (
                <tr><td className={styles.noRecords} colSpan={8}><strong>No purchase returns found</strong><span>Adjust the search, supplier, status, or date filters.</span><button className="button" onClick={clearFilters} type="button">Clear filters</button></td></tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.listFooter}>
          <p>Showing {filteredRecords.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filteredRecords.length)} of {filteredRecords.length} entries</p>
          <nav aria-label="Purchase return pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={16} /></button>
            {pageNumbers(pageCount).map((number) => <button aria-current={number === currentPage ? "page" : undefined} className={number === currentPage ? styles.currentPage : ""} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}
            <button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight aria-hidden="true" size={16} /></button>
          </nav>
        </footer>
      </Card>

      {editing && editDraft ? (
        <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) { setEditing(null); setEditDraft(null); } }} ref={editDialogRef}>
          <Card aria-describedby="edit-purchase-return-description" aria-labelledby="edit-purchase-return-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
            <header className={styles.modalHeader}>
              <div><h2 id="edit-purchase-return-title">Edit {editing.returnNo}</h2><p id="edit-purchase-return-description">Update supplier return details and status.</p></div>
              <button aria-label="Close edit purchase return dialog" onClick={() => { setEditing(null); setEditDraft(null); }} type="button"><X aria-hidden="true" size={18} /></button>
            </header>
            <form className={styles.modalForm} onSubmit={saveEdit}>
              <label className={styles.control}><span>Supplier <b aria-hidden="true">*</b></span><select className="select" onChange={(event) => setEditDraft((current) => current ? { ...current, supplier: event.target.value } : current)} value={editDraft.supplier}>{suppliers.map((option) => <option key={option}>{option}</option>)}</select></label>
              <label className={styles.control}><span>Return Date <b aria-hidden="true">*</b></span><input className="field" onChange={(event) => setEditDraft((current) => current ? { ...current, returnDate: event.target.value } : current)} required type="date" value={editDraft.returnDate} /></label>
              <label className={styles.control}><span>Reference No <b aria-hidden="true">*</b></span><input className="field" onChange={(event) => setEditDraft((current) => current ? { ...current, referenceNo: event.target.value } : current)} required value={editDraft.referenceNo} /></label>
              <label className={styles.control}><span>Total Amount ({"\u09F3"}) <b aria-hidden="true">*</b></span><input className="field" min="0.01" onChange={(event) => setEditDraft((current) => current ? { ...current, total: event.target.value } : current)} required step="0.01" type="number" value={editDraft.total} /></label>
              <label className={styles.control}><span>Status</span><select className="select" onChange={(event) => setEditDraft((current) => current ? { ...current, status: event.target.value as PurchaseReturnStatus } : current)} value={editDraft.status}><option>Completed</option><option>Pending</option><option>Rejected</option></select></label>
              <label className={styles.control}><span>Remarks</span><textarea className="textarea" onChange={(event) => setEditDraft((current) => current ? { ...current, remarks: event.target.value } : current)} value={editDraft.remarks} /></label>
              <footer className={styles.modalActions}>
                <button className="button" onClick={() => { setEditing(null); setEditDraft(null); }} type="button">Cancel</button>
                <button className="button button--primary" type="submit"><Save aria-hidden="true" size={16} />Save Changes</button>
              </footer>
            </form>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
