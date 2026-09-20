"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  MATERIAL_RETURNS_DELETED_STORAGE_KEY,
  MATERIAL_RETURNS_STORAGE_EVENT,
  MATERIAL_RETURNS_STORAGE_KEY,
  initialMaterialReturns,
  isMaterialReturnRecord,
  karigarOptions,
  type MaterialReturnRecord,
  type MaterialReturnStatus,
} from "./material-return-data";
import styles from "./material-returns.module.css";

const PAGE_SIZE = 10;
const EMPTY_SAVED_RETURNS = "[]";
const EMPTY_DELETED_RETURNS = "[]";
const EMPTY_STORAGE_SNAPSHOT = JSON.stringify([EMPTY_SAVED_RETURNS, EMPTY_DELETED_RETURNS]);

type AppliedFilters = {
  from: string;
  to: string;
  karigar: string;
  status: string;
} | null;

type Feedback = { tone: "error" | "success"; message: string } | null;

function subscribeToSavedReturns(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(MATERIAL_RETURNS_STORAGE_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(MATERIAL_RETURNS_STORAGE_EVENT, handleChange);
  };
}

function readSavedReturnsSnapshot() {
  try {
    return JSON.stringify([
      window.localStorage.getItem(MATERIAL_RETURNS_STORAGE_KEY) ?? EMPTY_SAVED_RETURNS,
      window.localStorage.getItem(MATERIAL_RETURNS_DELETED_STORAGE_KEY) ?? EMPTY_DELETED_RETURNS,
    ]);
  } catch {
    return EMPTY_STORAGE_SNAPSHOT;
  }
}

function parseSavedReturns(snapshot: string) {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter(isMaterialReturnRecord) : [];
  } catch {
    return [];
  }
}

function parseStorageSnapshot(snapshot: string) {
  try {
    const pair: unknown = JSON.parse(snapshot);
    if (!Array.isArray(pair) || typeof pair[0] !== "string" || typeof pair[1] !== "string") {
      return { records: [] as MaterialReturnRecord[], deletedIds: [] as string[] };
    }
    const deletedValue: unknown = JSON.parse(pair[1]);
    return {
      records: parseSavedReturns(pair[0]),
      deletedIds: Array.isArray(deletedValue)
        ? deletedValue.filter((value): value is string => typeof value === "string")
        : [],
    };
  } catch {
    return { records: [] as MaterialReturnRecord[], deletedIds: [] as string[] };
  }
}

function readDeletedReturnIds() {
  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(MATERIAL_RETURNS_DELETED_STORAGE_KEY) ?? EMPTY_DELETED_RETURNS,
    );
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function mergeSavedReturns(saved: MaterialReturnRecord[]) {
  const savedNumbers = new Set(saved.map((record) => record.returnNo));
  return [
    ...saved,
    ...initialMaterialReturns.filter((record) => !savedNumbers.has(record.returnNo)),
  ].sort((first, second) => second.dateIso.localeCompare(first.dateIso)
    || first.returnNo.localeCompare(second.returnNo, undefined, { numeric: true }));
}

function visiblePages(currentPage: number, pageCount: number) {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const start = Math.min(Math.max(1, currentPage - 2), pageCount - 4);
  return Array.from({ length: 5 }, (_, index) => start + index);
}

function nextStatus(status: MaterialReturnStatus): MaterialReturnStatus {
  if (status === "Pending") return "Received";
  if (status === "Received") return "Verified";
  return "Pending";
}

function StatusBadge({ status }: { status: MaterialReturnStatus }) {
  return (
    <span className={`${styles.returnStatus} ${styles[status.toLowerCase()]}`}>
      {status}
    </span>
  );
}

function DetailsDialog({ record, onClose }: { record: MaterialReturnRecord; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("button")?.focus(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
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
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = bodyOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} ref={dialogRef}>
      <Card aria-describedby="return-details-description" aria-labelledby="return-details-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div>
            <h2 id="return-details-title">{record.returnNo}</h2>
            <p id="return-details-description">Material return record details</p>
          </div>
          <button aria-label="Close material return details" autoFocus onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button>
        </header>
        <div className={styles.returnDetails}>
          <div className={styles.detailsHero}>
            <div><span>Karigar</span><strong>{record.karigar}</strong></div>
            <StatusBadge status={record.status} />
          </div>
          <dl>
            <div><dt>Return Date</dt><dd>{record.date}</dd></div>
            <div><dt>Manufacturing Order</dt><dd>{record.manufacturingOrder}</dd></div>
            <div><dt>Return Type</dt><dd>{record.returnType}</dd></div>
            <div><dt>Total Materials</dt><dd>{record.totalMaterials}</dd></div>
            <div><dt>Returned Weight</dt><dd>{record.returnedWeight.toFixed(3)} g</dd></div>
            <div><dt>Wastage</dt><dd>{record.wastage.toFixed(3)} g</dd></div>
          </dl>
          {record.materials?.length ? (
            <div className={styles.detailsMaterials}>
              <strong>Returned Materials</strong>
              <ul>
                {record.materials.map((material) => (
                  <li key={material.id}>
                    <span>{material.material} · {material.purity}</span>
                    <b>{material.returnedWeight.toFixed(3)} g</b>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {record.remarks || record.note ? (
            <p className={styles.detailsNote}><strong>Notes</strong>{record.remarks || record.note}</p>
          ) : null}
          <footer className={styles.modalActions}><button className="button button--primary" onClick={onClose} type="button">Done</button></footer>
        </div>
      </Card>
    </div>
  );
}

export function MaterialReturnList() {
  const savedSnapshot = useSyncExternalStore(
    subscribeToSavedReturns,
    readSavedReturnsSnapshot,
    () => EMPTY_STORAGE_SNAPSHOT,
  );
  const storedState = useMemo(() => parseStorageSnapshot(savedSnapshot), [savedSnapshot]);
  const baseRecords = useMemo(() => mergeSavedReturns(storedState.records), [storedState.records]);
  const [sessionDeletedIds, setSessionDeletedIds] = useState<Set<string>>(() => new Set());
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2025-04-12");
  const [karigar, setKarigar] = useState("All Karigar");
  const [status, setStatus] = useState("All Status");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(null);
  const [page, setPage] = useState(1);
  const [selectedReturn, setSelectedReturn] = useState<MaterialReturnRecord | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const allRecords = useMemo(
    () => baseRecords.filter(
      (record) => !storedState.deletedIds.includes(record.id) && !sessionDeletedIds.has(record.id),
    ),
    [baseRecords, sessionDeletedIds, storedState.deletedIds],
  );

  const filteredRecords = useMemo(() => {
    if (!appliedFilters) return allRecords;
    return allRecords.filter((record) => {
      const matchesDate = record.dateIso >= appliedFilters.from && record.dateIso <= appliedFilters.to;
      const matchesKarigar = appliedFilters.karigar === "All Karigar" || record.karigar === appliedFilters.karigar;
      const matchesStatus = appliedFilters.status === "All Status" || record.status === appliedFilters.status;
      return matchesDate && matchesKarigar && matchesStatus;
    });
  }, [allRecords, appliedFilters]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleRecords = filteredRecords.slice(start, start + PAGE_SIZE);

  function searchReturns() {
    if (!fromDate || !toDate) {
      setFeedback({ tone: "error", message: "Choose both a from date and a to date." });
      return;
    }
    if (fromDate > toDate) {
      setFeedback({ tone: "error", message: "The from date must be before the to date." });
      return;
    }
    setAppliedFilters({ from: fromDate, to: toDate, karigar, status });
    setPage(1);
    setFeedback({ tone: "success", message: "Material return filters applied." });
  }

  function clearFilters() {
    setFromDate("2025-04-01");
    setToDate("2025-04-12");
    setKarigar("All Karigar");
    setStatus("All Status");
    setAppliedFilters(null);
    setPage(1);
    setFeedback({ tone: "success", message: "Filters cleared. All material returns are shown." });
  }

  function updateStatus(record: MaterialReturnRecord) {
    const updated = { ...record, status: nextStatus(record.status) };
    try {
      const stored = parseSavedReturns(
        window.localStorage.getItem(MATERIAL_RETURNS_STORAGE_KEY) ?? EMPTY_SAVED_RETURNS,
      );
      window.localStorage.setItem(
        MATERIAL_RETURNS_STORAGE_KEY,
        JSON.stringify([updated, ...stored.filter((item) => item.returnNo !== record.returnNo)]),
      );
      window.dispatchEvent(new Event(MATERIAL_RETURNS_STORAGE_EVENT));
      setSelectedReturn((current) => current?.id === record.id ? updated : current);
      setFeedback({ tone: "success", message: `${record.returnNo} marked as ${updated.status.toLowerCase()}.` });
    } catch {
      setFeedback({ tone: "error", message: `Could not update ${record.returnNo} in browser storage.` });
    }
  }

  function deleteReturn(record: MaterialReturnRecord) {
    if (!window.confirm(`Remove ${record.returnNo} from the material return list?`)) return;
    setSessionDeletedIds((current) => new Set(current).add(record.id));
    try {
      const stored = parseSavedReturns(
        window.localStorage.getItem(MATERIAL_RETURNS_STORAGE_KEY) ?? EMPTY_SAVED_RETURNS,
      );
      const deletedIds = new Set(readDeletedReturnIds());
      deletedIds.add(record.id);
      window.localStorage.setItem(
        MATERIAL_RETURNS_STORAGE_KEY,
        JSON.stringify(stored.filter((item) => item.returnNo !== record.returnNo)),
      );
      window.localStorage.setItem(MATERIAL_RETURNS_DELETED_STORAGE_KEY, JSON.stringify([...deletedIds]));
      window.dispatchEvent(new Event(MATERIAL_RETURNS_STORAGE_EVENT));
      setFeedback({ tone: "success", message: `${record.returnNo} removed from the material return list.` });
    } catch {
      setFeedback({ tone: "error", message: `${record.returnNo} was hidden for this session, but browser storage is unavailable.` });
    }
  }

  return (
    <div className={styles.listPage}>
      <PageHeader description="View all material return records" title="Material Return List" />

      <Card className={styles.listCard}>
        <div className={styles.listFilters}>
          <label className={styles.control}>
            <span>From Date</span>
            <input className="field" onChange={(event) => { setFromDate(event.target.value); setFeedback(null); }} type="date" value={fromDate} />
          </label>
          <label className={styles.control}>
            <span>To Date</span>
            <input className="field" onChange={(event) => { setToDate(event.target.value); setFeedback(null); }} type="date" value={toDate} />
          </label>
          <label className={styles.control}>
            <span>Karigar</span>
            <select className="select" onChange={(event) => { setKarigar(event.target.value); setFeedback(null); }} value={karigar}>
              <option>All Karigar</option>
              {karigarOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className={styles.control}>
            <span>Return Status</span>
            <select className="select" onChange={(event) => { setStatus(event.target.value); setFeedback(null); }} value={status}>
              <option>All Status</option>
              <option>Received</option>
              <option>Verified</option>
              <option>Pending</option>
            </select>
          </label>
          <button className="button button--primary" onClick={searchReturns} type="button"><Search aria-hidden="true" size={16} />Search</button>
          {appliedFilters ? (
            <button aria-label="Clear filters" className={styles.clearButton} onClick={clearFilters} title="Clear filters" type="button"><RotateCcw aria-hidden="true" size={16} /></button>
          ) : null}
        </div>

        <p
          aria-live="polite"
          className={feedback ? `${styles.feedback} ${styles[feedback.tone]} ${styles.listFeedback}` : "sr-only"}
          role={feedback?.tone === "error" ? "alert" : "status"}
        >
          {feedback?.tone === "success" ? <CheckCircle2 aria-hidden="true" size={16} /> : null}
          {feedback?.message ?? ""}
        </p>

        <div className={styles.tableScroller}>
          <table className={styles.returnTable}>
            <caption className="sr-only">Material return records</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Return No</th>
                <th scope="col">Date</th>
                <th scope="col">Karigar</th>
                <th scope="col">Total Materials</th>
                <th scope="col">Returned Weight (Gram)</th>
                <th scope="col">Wastage (Gram)</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.map((record, index) => (
                <tr key={record.id}>
                  <td>{start + index + 1}</td>
                  <td><strong>{record.returnNo}</strong></td>
                  <td>{record.date}</td>
                  <td>{record.karigar}</td>
                  <td>{record.totalMaterials}</td>
                  <td>{record.returnedWeight.toFixed(3)}</td>
                  <td>{record.wastage.toFixed(3)}</td>
                  <td><StatusBadge status={record.status} /></td>
                  <td className={styles.actionCell}>
                    <details className={styles.actionMenu}>
                      <summary aria-label={`Actions for ${record.returnNo}`} title={`Actions for ${record.returnNo}`}><MoreHorizontal aria-hidden="true" size={17} /></summary>
                      <div role="menu">
                        <button onClick={(event) => { setSelectedReturn(record); event.currentTarget.closest("details")?.removeAttribute("open"); }} role="menuitem" type="button"><Eye aria-hidden="true" size={14} />View details</button>
                        <button onClick={(event) => { updateStatus(record); event.currentTarget.closest("details")?.removeAttribute("open"); }} role="menuitem" type="button"><CheckCircle2 aria-hidden="true" size={14} />Mark {nextStatus(record.status).toLowerCase()}</button>
                        <button className={styles.menuDelete} onClick={(event) => { deleteReturn(record); event.currentTarget.closest("details")?.removeAttribute("open"); }} role="menuitem" type="button"><Trash2 aria-hidden="true" size={14} />Remove record</button>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
              {visibleRecords.length === 0 ? (
                <tr>
                  <td className={styles.noRecords} colSpan={9}>
                    <strong>No material returns found</strong>
                    <span>Adjust the dates, karigar, or return status.</span>
                    <button className="button" onClick={clearFilters} type="button">Clear filters</button>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.listFooter}>
          <p>Showing {filteredRecords.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filteredRecords.length)} of {filteredRecords.length} records</p>
          <nav aria-label="Material return pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={16} /></button>
            {visiblePages(currentPage, pageCount).map((number) => (
              <button aria-current={number === currentPage ? "page" : undefined} className={number === currentPage ? styles.currentPage : ""} key={number} onClick={() => setPage(number)} type="button">{number}</button>
            ))}
            <button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight aria-hidden="true" size={16} /></button>
          </nav>
        </footer>
      </Card>

      {selectedReturn ? <DetailsDialog onClose={() => setSelectedReturn(null)} record={selectedReturn} /> : null}
    </div>
  );
}
