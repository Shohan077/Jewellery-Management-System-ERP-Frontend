"use client";

import { Boxes, ClipboardList, Gem, PackageOpen, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";

import {
  defaultListFilters,
  materialIssueKarigars,
  materialIssues,
  materialIssueStatuses,
  materialIssueSummary,
  type MaterialIssueListItem,
} from "./production-list-data";
import { DetailsDialog, ProductionPageHeader, SummaryCard, ViewButton } from "./production-list-ui";
import styles from "./production-list-pages.module.css";

type Filters = typeof defaultListFilters;

const metricIcons = [<Boxes key="gold" size={27} />, <Gem key="diamond" size={28} />, <PackageOpen key="other" size={27} />, <ClipboardList key="issues" size={27} />];

function IssueStatus({ status }: { status: MaterialIssueListItem["status"] }) {
  const statusClass = status === "Issued" ? styles.issued : status === "Returned" ? styles.returned : styles.pending;
  return <span className={`${styles.issueStatus} ${statusClass}`}>{status}</span>;
}

export function MaterialIssueListPage() {
  const [draftFilters, setDraftFilters] = useState<Filters>(defaultListFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultListFilters);
  const [selectedIssue, setSelectedIssue] = useState<MaterialIssueListItem | null>(null);
  const [feedback, setFeedback] = useState("");

  const visibleIssues = useMemo(() => materialIssues.filter((issue) => {
    const matchesDate = issue.issueDateIso >= appliedFilters.fromDate && issue.issueDateIso <= appliedFilters.toDate;
    const matchesStatus = appliedFilters.status === "All" || issue.status === appliedFilters.status;
    const matchesKarigar = appliedFilters.karigar === "All" || issue.karigar === appliedFilters.karigar;
    return matchesDate && matchesStatus && matchesKarigar;
  }), [appliedFilters]);

  function applyFilters() {
    if (draftFilters.fromDate > draftFilters.toDate) {
      setFeedback("Date From must be before or equal to Date To.");
      return;
    }
    setAppliedFilters({ ...draftFilters });
    setFeedback("Material issue filters applied.");
  }

  function resetFilters() {
    setDraftFilters(defaultListFilters);
    setAppliedFilters(defaultListFilters);
    setFeedback("Material issue filters were reset.");
  }

  return (
    <div className={styles.page}>
      <ProductionPageHeader actionHref="/manufacturing/material-issues/new" actionLabel="New Material Issue" title="Material Issue" />

      <Card className={styles.filterCard}>
        <div className={styles.filters}>
          <label><span>Date From</span><input className="field" onChange={(event) => setDraftFilters((current) => ({ ...current, fromDate: event.target.value }))} type="date" value={draftFilters.fromDate} /></label>
          <label><span>Date To</span><input className="field" onChange={(event) => setDraftFilters((current) => ({ ...current, toDate: event.target.value }))} type="date" value={draftFilters.toDate} /></label>
          <label><span>Karigar</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, karigar: event.target.value }))} value={draftFilters.karigar}>{materialIssueKarigars.map((karigar) => <option key={karigar}>{karigar}</option>)}</select></label>
          <label><span>Status</span><select className="select" onChange={(event) => setDraftFilters((current) => ({ ...current, status: event.target.value }))} value={draftFilters.status}>{materialIssueStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <button className={styles.searchButton} onClick={applyFilters} type="button"><Search aria-hidden="true" size={15} />Search</button>
          <button className={styles.resetButton} onClick={resetFilters} type="button"><RotateCcw aria-hidden="true" size={15} />Reset</button>
        </div>
        <p aria-live="polite" className={feedback.startsWith("Date") ? styles.filterError : "sr-only"} role={feedback.startsWith("Date") ? "alert" : "status"}>{feedback}</p>
      </Card>

      <section aria-label="Material issue summary" className={styles.summaryGrid}>
        {materialIssueSummary.map((metric, index) => <SummaryCard icon={metricIcons[index]} key={metric.label} label={metric.label} tone={metric.tone} value={metric.value} />)}
      </section>

      <Card className={styles.tableCard}>
        <div className={styles.tableScroller}>
          <table className={styles.dataTable}>
            <caption className="sr-only">Material issues</caption>
            <thead><tr><th scope="col">SL</th><th scope="col">Issue No</th><th scope="col">Date</th><th scope="col">Karigar</th><th scope="col">Material Type</th><th scope="col">Item</th><th scope="col">Quantity</th><th scope="col">Unit</th><th scope="col">Action</th></tr></thead>
            <tbody>
              {visibleIssues.map((issue, index) => <tr key={issue.id}><td>{index + 1}</td><td><strong>{issue.issueNo}</strong></td><td>{issue.issueDate}</td><td>{issue.karigar}</td><td>{issue.materialType}</td><td>{issue.item}</td><td>{issue.quantity}</td><td>{issue.unit}</td><td><ViewButton label={`View ${issue.issueNo}`} onClick={() => setSelectedIssue(issue)} /></td></tr>)}
              {!visibleIssues.length ? <tr><td className={styles.emptyState} colSpan={9}><strong>No material issues found</strong><span>Adjust the date, status, or karigar filters and search again.</span><button onClick={resetFilters} type="button">Clear filters</button></td></tr> : null}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedIssue ? <DetailsDialog description="Issued material details and allocation status." onClose={() => setSelectedIssue(null)} title={selectedIssue.issueNo}>
        <div className={styles.detailsBody}>
          <div className={styles.detailsLead}><div><span>Material</span><strong>{selectedIssue.item}</strong><small>{selectedIssue.materialType}</small></div><IssueStatus status={selectedIssue.status} /></div>
          <dl><div><dt>Karigar</dt><dd>{selectedIssue.karigar}</dd></div><div><dt>Issue Date</dt><dd>{selectedIssue.issueDate}</dd></div><div><dt>Quantity</dt><dd>{selectedIssue.quantity} {selectedIssue.unit}</dd></div><div><dt>Issue Number</dt><dd>{selectedIssue.issueNo}</dd></div></dl>
          <footer><button className={styles.searchButton} onClick={() => setSelectedIssue(null)} type="button">Done</button></footer>
        </div>
      </DetailsDialog> : null}
    </div>
  );
}
