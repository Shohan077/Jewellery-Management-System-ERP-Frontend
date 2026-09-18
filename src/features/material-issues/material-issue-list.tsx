"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

import {
  MATERIAL_ISSUES_STORAGE_EVENT,
  MATERIAL_ISSUES_STORAGE_KEY,
  initialMaterialIssues,
  isMaterialIssueRecord,
  karigarOptions,
  type MaterialIssueRecord,
  type MaterialIssueStatus,
} from "./material-issue-data";
import styles from "./material-issues.module.css";

const PAGE_SIZE = 8;
const EMPTY_SAVED_ISSUES = "[]";

type AppliedFilters = { from: string; to: string; karigar: string } | null;
type Feedback = { tone: "error" | "success"; message: string } | null;

function subscribeToSavedIssues(onStoreChange: () => void) {
  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(MATERIAL_ISSUES_STORAGE_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(MATERIAL_ISSUES_STORAGE_EVENT, handleChange);
  };
}

function readSavedIssuesSnapshot() {
  try {
    return window.localStorage.getItem(MATERIAL_ISSUES_STORAGE_KEY) ?? EMPTY_SAVED_ISSUES;
  } catch {
    return EMPTY_SAVED_ISSUES;
  }
}

function parseSavedIssues(snapshot: string) {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter(isMaterialIssueRecord) : [];
  } catch {
    return [];
  }
}

function mergeSavedIssues(saved: MaterialIssueRecord[]) {
  const savedNumbers = new Set(saved.map((issue) => issue.issueNo));
  return [...saved, ...initialMaterialIssues.filter((issue) => !savedNumbers.has(issue.issueNo))];
}

function visiblePages(currentPage: number, pageCount: number) {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const start = Math.min(Math.max(1, currentPage - 2), pageCount - 4);
  return Array.from({ length: 5 }, (_, index) => start + index);
}

function StatusBadge({ status }: { status: MaterialIssueStatus }) {
  return <span className={`${styles.issueStatus} ${status === "Issued" ? styles.issued : styles.returned}`}>{status}</span>;
}

function DetailsDialog({ issue, onClose }: { issue: MaterialIssueRecord; onClose: () => void }) {
  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-describedby="issue-details-description" aria-labelledby="issue-details-title" aria-modal="true" as="section" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div><h2 id="issue-details-title">{issue.issueNo}</h2><p id="issue-details-description">Material issue record details</p></div>
          <button aria-label="Close material issue details" onClick={onClose} type="button"><X aria-hidden="true" size={18} /></button>
        </header>
        <div className={styles.issueDetails}>
          <div className={styles.detailsHero}><div><span>Karigar</span><strong>{issue.karigar}</strong></div><StatusBadge status={issue.status} /></div>
          <dl>
            <div><dt>Issue Date</dt><dd>{issue.date}</dd></div>
            <div><dt>Manufacturing Order</dt><dd>{issue.manufacturingOrder}</dd></div>
            <div><dt>Total Materials</dt><dd>{issue.totalMaterial} items</dd></div>
            <div><dt>Total Weight</dt><dd>{issue.totalWeight.toFixed(3)} g</dd></div>
          </dl>
          {issue.note ? <p className={styles.detailsNote}><strong>Note</strong>{issue.note}</p> : null}
          <footer className={styles.modalActions}><button className="button button--primary" onClick={onClose} type="button">Done</button></footer>
        </div>
      </Card>
    </div>
  );
}

export function MaterialIssueList() {
  const savedSnapshot = useSyncExternalStore(subscribeToSavedIssues, readSavedIssuesSnapshot, () => EMPTY_SAVED_ISSUES);
  const storedRecords = useMemo(() => parseSavedIssues(savedSnapshot), [savedSnapshot]);
  const baseRecords = useMemo(() => mergeSavedIssues(storedRecords), [storedRecords]);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, MaterialIssueStatus>>({});
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => new Set());
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2025-04-12");
  const [karigar, setKarigar] = useState("All Karigar");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(null);
  const [page, setPage] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState<MaterialIssueRecord | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const allRecords = useMemo(
    () => baseRecords
      .filter((issue) => !deletedIds.has(issue.id))
      .map((issue) => ({ ...issue, status: statusOverrides[issue.id] ?? issue.status })),
    [baseRecords, deletedIds, statusOverrides],
  );

  const filteredRecords = useMemo(() => {
    if (!appliedFilters) return allRecords;
    return allRecords.filter((issue) => {
      const matchesDate = issue.dateIso >= appliedFilters.from && issue.dateIso <= appliedFilters.to;
      const matchesKarigar = appliedFilters.karigar === "All Karigar" || issue.karigar === appliedFilters.karigar;
      return matchesDate && matchesKarigar;
    });
  }, [allRecords, appliedFilters]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleRecords = filteredRecords.slice(start, start + PAGE_SIZE);

  function searchIssues() {
    if (!fromDate || !toDate) {
      setFeedback({ tone: "error", message: "Choose both a from date and a to date." });
      return;
    }
    if (fromDate > toDate) {
      setFeedback({ tone: "error", message: "The from date must be before the to date." });
      return;
    }
    setAppliedFilters({ from: fromDate, to: toDate, karigar });
    setPage(1);
    setFeedback({ tone: "success", message: "Material issue filters applied." });
  }

  function clearFilters() {
    setFromDate("2025-04-01");
    setToDate("2025-04-12");
    setKarigar("All Karigar");
    setAppliedFilters(null);
    setPage(1);
    setFeedback({ tone: "success", message: "Filters cleared. All material issues are shown." });
  }

  function toggleStatus(issue: MaterialIssueRecord) {
    const status: MaterialIssueStatus = issue.status === "Issued" ? "Returned" : "Issued";
    setStatusOverrides((current) => ({ ...current, [issue.id]: status }));
    setFeedback({ tone: "success", message: `${issue.issueNo} marked as ${status.toLowerCase()}.` });
  }

  function deleteIssue(issue: MaterialIssueRecord) {
    setDeletedIds((current) => new Set(current).add(issue.id));
    setFeedback({ tone: "success", message: `${issue.issueNo} removed from the material issue list.` });
  }

  return (
    <div className={styles.listPage}>
      <PageHeader
        action={<Link className="button button--primary" href="/manufacturing/material-issues/new"><Plus aria-hidden="true" size={16} />New Issue</Link>}
        description="View all material issue records"
        title="Material Issue List"
      />

      <Card className={styles.listCard}>
        <div className={styles.listFilters}>
          <label className={styles.control}><span>From Date</span><input className="field" onChange={(event) => { setFromDate(event.target.value); setFeedback(null); }} type="date" value={fromDate} /></label>
          <label className={styles.control}><span>To Date</span><input className="field" onChange={(event) => { setToDate(event.target.value); setFeedback(null); }} type="date" value={toDate} /></label>
          <label className={styles.control}><span className="sr-only">Filter by karigar</span><select className="select" onChange={(event) => { setKarigar(event.target.value); setFeedback(null); }} value={karigar}><option>All Karigar</option>{karigarOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <button className="button button--primary" onClick={searchIssues} type="button"><Search aria-hidden="true" size={16} />Search</button>
          {appliedFilters ? <button aria-label="Clear filters" className={styles.clearButton} onClick={clearFilters} title="Clear filters" type="button"><RotateCcw aria-hidden="true" size={16} /></button> : null}
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
          <table className={styles.issueTable}>
            <caption className="sr-only">Material issue records</caption>
            <thead><tr><th scope="col">#</th><th scope="col">Issue No</th><th scope="col">Date</th><th scope="col">Karigar</th><th scope="col">Total Material</th><th scope="col">Total Weight (g)</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {visibleRecords.map((issue, index) => (
                <tr key={issue.id}>
                  <td>{start + index + 1}</td><td><strong>{issue.issueNo}</strong></td><td>{issue.date}</td><td>{issue.karigar}</td><td>{issue.totalMaterial} items</td><td>{issue.totalWeight.toFixed(3)}</td><td><StatusBadge status={issue.status} /></td>
                  <td className={styles.actionCell}>
                    <details className={styles.actionMenu}>
                      <summary aria-label={`Actions for ${issue.issueNo}`} title={`Actions for ${issue.issueNo}`}><MoreHorizontal aria-hidden="true" size={17} /></summary>
                      <div role="menu">
                        <button onClick={(event) => { setSelectedIssue(issue); event.currentTarget.closest("details")?.removeAttribute("open"); }} role="menuitem" type="button"><Eye aria-hidden="true" size={14} />View details</button>
                        <button onClick={(event) => { toggleStatus(issue); event.currentTarget.closest("details")?.removeAttribute("open"); }} role="menuitem" type="button"><Undo2 aria-hidden="true" size={14} />Mark {issue.status === "Issued" ? "returned" : "issued"}</button>
                        <button className={styles.menuDelete} onClick={(event) => { deleteIssue(issue); event.currentTarget.closest("details")?.removeAttribute("open"); }} role="menuitem" type="button"><Trash2 aria-hidden="true" size={14} />Remove record</button>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
              {visibleRecords.length === 0 ? <tr><td className={styles.noRecords} colSpan={8}><strong>No material issues found</strong><span>Adjust the date range or choose another karigar.</span><button className="button" onClick={clearFilters} type="button">Clear filters</button></td></tr> : null}
            </tbody>
          </table>
        </div>

        <footer className={styles.listFooter}>
          <p>Showing {filteredRecords.length ? start + 1 : 0} to {Math.min(start + PAGE_SIZE, filteredRecords.length)} of {filteredRecords.length} records</p>
          <nav aria-label="Material issue pagination" className={styles.pagination}>
            <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft aria-hidden="true" size={16} /></button>
            {visiblePages(currentPage, pageCount).map((number) => <button aria-current={number === currentPage ? "page" : undefined} className={number === currentPage ? styles.currentPage : ""} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}
            <button aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} type="button"><ChevronRight aria-hidden="true" size={16} /></button>
          </nav>
        </footer>
      </Card>

      {selectedIssue ? <DetailsDialog issue={selectedIssue} onClose={() => setSelectedIssue(null)} /> : null}
    </div>
  );
}
