"use client";

import { Check, ChevronLeft, ChevronRight, Eye, MoreHorizontal, RotateCcw, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  WASTAGE_DELETED_STORAGE_KEY,
  WASTAGE_STORAGE_EVENT,
  WASTAGE_STORAGE_KEY,
  initialWastageRecords,
  isWastageRecord,
  karigarOptions,
  type WastageRecord,
  type WastageStatus,
} from "./wastage-data";
import styles from "./wastage.module.css";

const PAGE_SIZE = 8;
const EMPTY_SAVED = "[]";
const EMPTY_DELETED = "[]";
const EMPTY_SNAPSHOT = JSON.stringify([EMPTY_SAVED, EMPTY_DELETED]);
const statuses = ["All Status", "Approved", "Pending", "Rejected"] as const;

type StatusFilter = (typeof statuses)[number];
type Filters = { fromDate: string; toDate: string; karigar: string; status: StatusFilter };
const initialFilters: Filters = { fromDate: "2025-04-01", toDate: "2025-04-12", karigar: "All Karigar", status: "All Status" };

const statusClass: Record<WastageStatus, string> = {
  Approved: styles.approved,
  Pending: styles.pending,
  Rejected: styles.rejected,
};

function subscribe(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(WASTAGE_STORAGE_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(WASTAGE_STORAGE_EVENT, handleChange);
  };
}

function getSnapshot() {
  try {
    return JSON.stringify([
      window.localStorage.getItem(WASTAGE_STORAGE_KEY) ?? EMPTY_SAVED,
      window.localStorage.getItem(WASTAGE_DELETED_STORAGE_KEY) ?? EMPTY_DELETED,
    ]);
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

function parseSnapshot(snapshot: string) {
  try {
    const values: unknown = JSON.parse(snapshot);
    if (!Array.isArray(values)) return { saved: [] as WastageRecord[], deleted: [] as string[] };
    const savedValue: unknown = JSON.parse(typeof values[0] === "string" ? values[0] : "[]");
    const deletedValue: unknown = JSON.parse(typeof values[1] === "string" ? values[1] : "[]");
    return {
      saved: Array.isArray(savedValue) ? savedValue.filter(isWastageRecord) : [],
      deleted: Array.isArray(deletedValue) ? deletedValue.filter((value): value is string => typeof value === "string") : [],
    };
  } catch {
    return { saved: [] as WastageRecord[], deleted: [] as string[] };
  }
}

function mergeRecords(saved: WastageRecord[], deleted: string[]) {
  const savedIds = new Set(saved.map((record) => record.id));
  const deletedIds = new Set(deleted);
  return [...saved, ...initialWastageRecords.filter((record) => !savedIds.has(record.id) && !deletedIds.has(record.id))];
}

function Modal({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const returnFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
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
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = bodyOverflow;
      returnFocusTo?.focus();
    };
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} ref={dialogRef}>
      <Card aria-labelledby="wastage-dialog-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}><h2 id="wastage-dialog-title">{title}</h2><button aria-label="Close wastage details" autoFocus onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button></header>
        {children}
      </Card>
    </div>
  );
}

export function WastageList() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_SNAPSHOT);
  const storedData = useMemo(() => parseSnapshot(snapshot), [snapshot]);
  const records = useMemo(() => mergeRecords(storedData.saved, storedData.deleted), [storedData]);
  const [draftFilters, setDraftFilters] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters | null>(null);
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<WastageRecord | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = new URLSearchParams(window.location.search).get("saved");
    if (!saved) return;
    const timer = window.setTimeout(() => setMessage(`${saved} was saved successfully.`), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpenMenu(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [openMenu]);

  const filtered = useMemo(() => {
    if (!appliedFilters) return records;
    return records.filter((record) => record.dateIso >= appliedFilters.fromDate
      && record.dateIso <= appliedFilters.toDate
      && (appliedFilters.karigar === "All Karigar" || record.karigar === appliedFilters.karigar)
      && (appliedFilters.status === "All Status" || record.status === appliedFilters.status));
  }, [appliedFilters, records]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleRecords = filtered.slice(start, start + PAGE_SIZE);
  const visiblePages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => index + 1);

  function applyFilters() {
    if (draftFilters.fromDate > draftFilters.toDate) {
      setMessage("From Date must be before or equal to To Date.");
      return;
    }
    setAppliedFilters({ ...draftFilters });
    setPage(1);
    setOpenMenu(null);
    setMessage("Wastage filters applied.");
  }

  function persist(record: WastageRecord) {
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(WASTAGE_STORAGE_KEY) ?? "[]");
      const saved = Array.isArray(parsed) ? parsed.filter(isWastageRecord) : [];
      window.localStorage.setItem(WASTAGE_STORAGE_KEY, JSON.stringify([record, ...saved.filter((item) => item.id !== record.id)]));
      window.dispatchEvent(new Event(WASTAGE_STORAGE_EVENT));
      return true;
    } catch {
      setMessage("This update could not be persisted in browser storage.");
      return false;
    }
  }

  function updateStatus(record: WastageRecord, status: WastageStatus) {
    const updated = { ...record, status };
    if (!persist(updated)) return;
    setSelectedRecord((current) => current?.id === record.id ? updated : current);
    setOpenMenu(null);
    setMessage(`${record.wastageNo} marked ${status.toLowerCase()}.`);
  }

  function deleteRecord(record: WastageRecord) {
    if (!window.confirm(`Delete ${record.wastageNo}? This removes it from the current browser.`)) return;
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(WASTAGE_STORAGE_KEY) ?? "[]");
      const saved = Array.isArray(parsed) ? parsed.filter(isWastageRecord) : [];
      const deletedParsed: unknown = JSON.parse(window.localStorage.getItem(WASTAGE_DELETED_STORAGE_KEY) ?? "[]");
      const deleted = Array.isArray(deletedParsed) ? deletedParsed.filter((value): value is string => typeof value === "string") : [];
      window.localStorage.setItem(WASTAGE_STORAGE_KEY, JSON.stringify(saved.filter((item) => item.id !== record.id)));
      window.localStorage.setItem(WASTAGE_DELETED_STORAGE_KEY, JSON.stringify(Array.from(new Set([...deleted, record.id]))));
      window.dispatchEvent(new Event(WASTAGE_STORAGE_EVENT));
      setOpenMenu(null);
      setSelectedRecord(null);
      setMessage(`${record.wastageNo} deleted.`);
    } catch {
      setMessage("This record could not be deleted from browser storage.");
    }
  }

  return (
    <div className={styles.listPage}>
      <PageHeader description="View all wastage records" title="Wastage List" />

      <Card className={styles.listCard}>
        <div className={styles.filterBar}>
          <label><span>From Date</span><input className="field" onChange={(event) => setDraftFilters((current) => ({ ...current, fromDate: event.target.value }))} type="date" value={draftFilters.fromDate} /></label>
          <label><span>To Date</span><input className="field" onChange={(event) => setDraftFilters((current) => ({ ...current, toDate: event.target.value }))} type="date" value={draftFilters.toDate} /></label>
          <label><span>Karigar</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, karigar: event.target.value }))} value={draftFilters.karigar}><option>All Karigar</option>{karigarOptions.map((karigar) => <option key={karigar}>{karigar}</option>)}</select></label>
          <label><span>Status</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, status: event.target.value as StatusFilter }))} value={draftFilters.status}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <button className={`button button--primary ${styles.searchButton}`} onClick={applyFilters} type="button"><Search aria-hidden="true" size={17} />Search</button>
        </div>
        <p aria-live="polite" className={message ? styles.listMessage : "sr-only"}>{message}</p>
        <div className={styles.tableScroller}>
          <table className={styles.recordsTable}>
            <caption className="sr-only">Manufacturing wastage records</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Wastage No</th><th scope="col">Date</th><th scope="col">Manufacturing Order</th><th scope="col">Karigar</th><th scope="col">Product</th><th scope="col">Net Wastage (Gram)</th><th scope="col">Approved Wastage (Gram)</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {visibleRecords.map((record, index) => (
                <tr key={record.id}>
                  <td>{start + index + 1}</td><td><strong>{record.wastageNo}</strong></td><td>{record.date}</td><td>{record.manufacturingOrder}</td><td>{record.karigar}</td><td>{record.product}</td><td>{record.netWastage.toFixed(3)}</td><td>{record.approvedWastage.toFixed(3)}</td><td><span className={`${styles.statusBadge} ${statusClass[record.status]}`}>{record.status}</span></td>
                  <td className={styles.actionCell}>
                    <button aria-expanded={openMenu === record.id} aria-haspopup="menu" aria-label={`Actions for ${record.wastageNo}`} className={styles.moreButton} onClick={() => setOpenMenu((current) => current === record.id ? null : record.id)} type="button"><MoreHorizontal aria-hidden="true" size={18} /></button>
                    {openMenu === record.id ? <div className={styles.actionMenu} role="menu"><button onClick={() => { setSelectedRecord(record); setOpenMenu(null); }} role="menuitem" type="button"><Eye aria-hidden="true" size={14} />View details</button>{record.status !== "Approved" ? <button onClick={() => updateStatus(record, "Approved")} role="menuitem" type="button"><Check aria-hidden="true" size={14} />Approve wastage</button> : null}<button className={styles.menuDelete} onClick={() => deleteRecord(record)} role="menuitem" type="button"><Trash2 aria-hidden="true" size={14} />Delete record</button></div> : null}
                  </td>
                </tr>
              ))}
              {!visibleRecords.length ? <tr><td className={styles.emptyState} colSpan={10}><strong>No wastage records found</strong><span>Try a wider date range or another filter.</span><button className="button" onClick={() => { setAppliedFilters(null); setDraftFilters(initialFilters); setPage(1); setMessage("Filters cleared."); }} type="button"><RotateCcw size={15} />Clear filters</button></td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>

      <footer className={styles.listFooter}>
        <p>Showing {filtered.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} records</p>
        <nav aria-label="Wastage pagination" className={styles.pagination}><button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} type="button"><ChevronLeft size={16} /></button>{visiblePages.map((pageNumber) => <button aria-current={pageNumber === currentPage ? "page" : undefined} className={pageNumber === currentPage ? styles.currentPage : ""} key={pageNumber} onClick={() => setPage(pageNumber)} type="button">{pageNumber}</button>)}<button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} type="button"><ChevronRight size={16} /></button></nav>
      </footer>

      {selectedRecord ? <Modal onClose={() => setSelectedRecord(null)} title={selectedRecord.wastageNo}><div className={styles.recordDetails}><div className={styles.detailsHero}><div><span>Manufacturing Order</span><strong>{selectedRecord.manufacturingOrder}</strong><small>{selectedRecord.product}</small></div><span className={`${styles.statusBadge} ${statusClass[selectedRecord.status]}`}>{selectedRecord.status}</span></div><dl><div><dt>Date</dt><dd>{selectedRecord.date}</dd></div><div><dt>Karigar</dt><dd>{selectedRecord.karigar}</dd></div><div><dt>Total Issued</dt><dd>{selectedRecord.totalIssued.toFixed(3)} g</dd></div><div><dt>Total Returned</dt><dd>{selectedRecord.totalReturned.toFixed(3)} g</dd></div><div><dt>Net Wastage</dt><dd>{selectedRecord.netWastage.toFixed(3)} g</dd></div><div><dt>Approved Wastage</dt><dd>{selectedRecord.approvedWastage.toFixed(3)} g</dd></div><div><dt>Wastage Type</dt><dd>{selectedRecord.wastageType}</dd></div></dl><div className={styles.detailsRemarks}><span>Remarks</span><p>{selectedRecord.remarks || "No remarks added."}</p></div><footer className={styles.modalActions}><button className="button" onClick={() => setSelectedRecord(null)} type="button">Close</button>{selectedRecord.status !== "Approved" ? <button className="button button--primary" onClick={() => updateStatus(selectedRecord, "Approved")} type="button"><Check size={15} />Approve</button> : null}</footer></div></Modal> : null}
    </div>
  );
}
