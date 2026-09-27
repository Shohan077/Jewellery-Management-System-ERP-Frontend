"use client";

import {
  Check,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Filter,
  PackageCheck,
  RefreshCcw,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./final-quality-approval.module.css";

type QualityResult = "Approved" | "Rework" | "Rejected";

type QualityRecord = {
  id: string;
  product: string;
  category: string;
  workOrder: string;
  inspectionDate: string;
  inspector: string;
  result: QualityResult;
  remarks: string;
  purity: string;
  stoneSetting: string;
  polish: string;
  weight: string;
  expectedWeight: string;
};

type Filters = {
  dateRange: string;
  category: string;
  inspector: string;
  result: string;
};

const INITIAL_FILTERS: Filters = {
  dateRange: "01 May 2025 - 31 May 2025",
  category: "All",
  inspector: "All",
  result: "All",
};

const FEATURED_RECORDS: QualityRecord[] = [
  { id: "QC-2025-212", product: "Gold Necklace", category: "Necklace", workOrder: "WO-2025-231", inspectionDate: "2025-05-31", inspector: "Neha Sharma", result: "Approved", remarks: "Perfect", purity: "22K (91.6%)", stoneSetting: "Good", polish: "Excellent", weight: "18.320 g", expectedWeight: "18.250 g" },
  { id: "QC-2025-211", product: "Diamond Ring", category: "Ring", workOrder: "WO-2025-230", inspectionDate: "2025-05-30", inspector: "Amit Verma", result: "Rework", remarks: "Polish Issue", purity: "18K (75.0%)", stoneSetting: "Secure", polish: "Needs rework", weight: "12.050 g", expectedWeight: "12.000 g" },
  { id: "QC-2025-210", product: "Gold Bangles", category: "Bangles", workOrder: "WO-2025-229", inspectionDate: "2025-05-30", inspector: "Neha Sharma", result: "Approved", remarks: "Good", purity: "22K (91.6%)", stoneSetting: "N/A", polish: "Good", weight: "35.200 g", expectedWeight: "35.150 g" },
  { id: "QC-2025-209", product: "Pendant Set", category: "Pendant", workOrder: "WO-2025-228", inspectionDate: "2025-05-29", inspector: "Ravi Patel", result: "Rejected", remarks: "Stone Missing", purity: "18K (75.0%)", stoneSetting: "Stone missing", polish: "Good", weight: "16.740 g", expectedWeight: "17.050 g" },
  { id: "QC-2025-208", product: "Diamond Earrings", category: "Earrings", workOrder: "WO-2025-227", inspectionDate: "2025-05-28", inspector: "Amit Verma", result: "Rework", remarks: "Stone Loose", purity: "18K (75.0%)", stoneSetting: "Loose", polish: "Excellent", weight: "9.860 g", expectedWeight: "9.850 g" },
  { id: "QC-2025-207", product: "Gold Chain", category: "Chain", workOrder: "WO-2025-226", inspectionDate: "2025-05-27", inspector: "Neha Sharma", result: "Approved", remarks: "Ok", purity: "22K (91.6%)", stoneSetting: "N/A", polish: "Good", weight: "22.450 g", expectedWeight: "22.400 g" },
  { id: "QC-2025-206", product: "Gold Ring", category: "Ring", workOrder: "WO-2025-225", inspectionDate: "2025-05-26", inspector: "Ravi Patel", result: "Approved", remarks: "Good", purity: "22K (91.6%)", stoneSetting: "Secure", polish: "Excellent", weight: "8.750 g", expectedWeight: "8.720 g" },
  { id: "QC-2025-205", product: "Diamond Pendant", category: "Pendant", workOrder: "WO-2025-224", inspectionDate: "2025-05-25", inspector: "Amit Verma", result: "Rejected", remarks: "Weight Mismatch", purity: "18K (75.0%)", stoneSetting: "Good", polish: "Good", weight: "14.120 g", expectedWeight: "14.850 g" },
];

const PRODUCTS = [
  ["Gold Necklace", "Necklace"],
  ["Diamond Ring", "Ring"],
  ["Gold Bangles", "Bangles"],
  ["Pendant Set", "Pendant"],
  ["Diamond Earrings", "Earrings"],
  ["Gold Chain", "Chain"],
] as const;

const INSPECTORS = ["Neha Sharma", "Amit Verma", "Ravi Patel"];

const GENERATED_RECORDS: QualityRecord[] = Array.from({ length: 104 }, (_, offset) => {
  const index = offset + 8;
  const [product, category] = PRODUCTS[index % PRODUCTS.length];
  const result: QualityResult = index < 72 ? "Approved" : index < 98 ? "Rework" : "Rejected";
  const day = String(24 - (offset % 24)).padStart(2, "0");
  return {
    id: `QC-2025-${212 - index}`,
    product,
    category,
    workOrder: `WO-2025-${231 - index}`,
    inspectionDate: `2025-05-${day}`,
    inspector: INSPECTORS[index % INSPECTORS.length],
    result,
    remarks: result === "Approved" ? "Good" : result === "Rework" ? "Finishing Issue" : "Specification Mismatch",
    purity: category === "Ring" || category === "Earrings" ? "18K (75.0%)" : "22K (91.6%)",
    stoneSetting: category === "Chain" || category === "Bangles" ? "N/A" : result === "Rejected" ? "Needs attention" : "Good",
    polish: result === "Rework" ? "Needs rework" : "Excellent",
    weight: `${(8.5 + (index % 24) * 0.57).toFixed(3)} g`,
    expectedWeight: `${(8.45 + (index % 24) * 0.57).toFixed(3)} g`,
  };
});

const INITIAL_RECORDS = [...FEATURED_RECORDS, ...GENERATED_RECORDS];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(`${value}T00:00:00`),
  );
}

function MetricCard({ icon, label, value, meta, tone }: { icon: ReactNode; label: string; value: number; meta: string; tone: string }) {
  return (
    <Card className={`${styles.metric} ${styles[tone]}`}>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{meta}</small>
      </div>
      <span className={styles.metricIcon}>{icon}</span>
    </Card>
  );
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`${styles.field} ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function ResultBadge({ result }: { result: QualityResult }) {
  return <span className={`${styles.result} ${styles[result.toLowerCase()]}`}>{result}</span>;
}

function CheckValue({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <span className={muted ? styles.mutedCheck : styles.checkValue}>
      {children}
      {!muted ? <CheckCircle2 aria-hidden="true" size={12} /> : null}
    </span>
  );
}

function pageTokens(page: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = new Set([1, 2, 3, page - 1, page, page + 1, total]);
  const ordered = [...pages].filter((value) => value > 0 && value <= total).sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];
  ordered.forEach((value, index) => {
    if (index && value - ordered[index - 1] > 1) result.push("ellipsis");
    result.push(value);
  });
  return result;
}

export function FinalQualityApproval187() {
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [draft, setDraft] = useState(INITIAL_FILTERS);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selectedId, setSelectedId] = useState(FEATURED_RECORDS[0].id);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const pageSize = 8;

  const selected = records.find((record) => record.id === selectedId) ?? records[0];
  const categories = useMemo(() => [...new Set(records.map((record) => record.category))].sort(), [records]);
  const filtered = useMemo(
    () => records.filter((record) =>
      (filters.category === "All" || record.category === filters.category)
      && (filters.inspector === "All" || record.inspector === filters.inspector)
      && (filters.result === "All" || record.result === filters.result)),
    [filters, records],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const approved = records.filter((record) => record.result === "Approved").length;
  const rework = records.filter((record) => record.result === "Rework").length;
  const rejected = records.filter((record) => record.result === "Rejected").length;

  function submitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFilters(draft);
    setPage(1);
    setMessage("Quality records filtered successfully.");
  }

  function resetFilters() {
    setDraft(INITIAL_FILTERS);
    setFilters(INITIAL_FILTERS);
    setPage(1);
    setMessage("Filters reset.");
  }

  function updateResult(result: QualityResult) {
    if (!selected) return;
    setRecords((current) => current.map((record) => record.id === selected.id
      ? { ...record, result, remarks: result === "Approved" ? "Final approval complete" : "Sent back for rework" }
      : record));
    setMessage(result === "Approved" ? `${selected.id} approved for final production.` : `${selected.id} sent to rework.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader description="Manufacturing  ›  Quality  ›  Final Approval" title="Final Quality Approval" />

      {message ? <p aria-live="polite" className={styles.notice}>{message}</p> : null}

      <section aria-label="Final quality summary" className={styles.metrics}>
        <MetricCard icon={<ClipboardCheck size={22} />} label="Inspected Items" meta="All inspected" tone="blue" value={records.length} />
        <MetricCard icon={<PackageCheck size={22} />} label="Approved Items" meta={`${((approved / records.length) * 100).toFixed(2)}%`} tone="green" value={approved} />
        <MetricCard icon={<RefreshCcw size={22} />} label="Rework Required" meta={`${((rework / records.length) * 100).toFixed(2)}%`} tone="orange" value={rework} />
        <MetricCard icon={<XCircle size={22} />} label="Rejected Items" meta={`${((rejected / records.length) * 100).toFixed(2)}%`} tone="red" value={rejected} />
      </section>

      <Card className={styles.filters}>
        <form className={styles.filterGrid} onSubmit={submitFilters}>
          <Field className={styles.dateField} label="Date Range">
            <input className="field" onChange={(event) => setDraft((current) => ({ ...current, dateRange: event.target.value }))} value={draft.dateRange} />
          </Field>
          <Field label="Product Category">
            <select className="select" onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} value={draft.category}>
              <option>All</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </Field>
          <Field label="Inspector">
            <select className="select" onChange={(event) => setDraft((current) => ({ ...current, inspector: event.target.value }))} value={draft.inspector}>
              <option>All</option>
              {INSPECTORS.map((inspector) => <option key={inspector}>{inspector}</option>)}
            </select>
          </Field>
          <Field label="Result">
            <select className="select" onChange={(event) => setDraft((current) => ({ ...current, result: event.target.value }))} value={draft.result}>
              <option>All</option><option>Approved</option><option>Rework</option><option>Rejected</option>
            </select>
          </Field>
          <div className={styles.filterActions}>
            <button className={`${styles.button} ${styles.filterButton}`} type="submit"><Filter size={13} />Filter</button>
            <button className={styles.resetButton} onClick={resetFilters} type="button"><RotateCcw size={13} />Reset</button>
          </div>
        </form>
      </Card>

      <section className={styles.workspace}>
        <Card className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr><th>QC ID</th><th>Product</th><th>Batch / WO No</th><th>Inspection Date</th><th>Inspector</th><th>Result</th><th>Remarks</th><th>Action</th></tr>
              </thead>
              <tbody>
                {visible.length ? visible.map((record) => (
                  <tr className={record.id === selectedId ? styles.selectedRow : ""} key={record.id}>
                    <td><button className={styles.idButton} onClick={() => setSelectedId(record.id)} type="button">{record.id}</button></td>
                    <td>{record.product}</td><td>{record.workOrder}</td><td>{formatDate(record.inspectionDate)}</td><td>{record.inspector}</td>
                    <td><ResultBadge result={record.result} /></td><td>{record.remarks}</td>
                    <td><button aria-label={`View ${record.id}`} className={styles.viewButton} onClick={() => setSelectedId(record.id)} type="button"><Eye size={13} /></button></td>
                  </tr>
                )) : <tr><td className={styles.empty} colSpan={8}>No quality records match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
          <footer className={styles.tableFooter}>
            <span>Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries</span>
            <div aria-label="Pagination" className={styles.pagination}>
              <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} type="button">‹</button>
              {pageTokens(currentPage, totalPages).map((token, index) => token === "ellipsis"
                ? <span className={styles.ellipsis} key={`ellipsis-${index}`}>…</span>
                : <button aria-current={token === currentPage ? "page" : undefined} className={token === currentPage ? styles.currentPage : ""} key={token} onClick={() => setPage(token)} type="button">{token}</button>)}
              <button aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} type="button">›</button>
            </div>
          </footer>
        </Card>

        {selected ? (
          <Card aria-label="Selected product details" className={styles.details}>
            <h2>Selected Product Details</h2>
            <dl className={styles.detailList}>
              <div><dt>QC ID</dt><dd>{selected.id}</dd></div>
              <div><dt>Product</dt><dd>{selected.product}</dd></div>
              <div><dt>Batch / WO No</dt><dd>{selected.workOrder}</dd></div>
              <div><dt>Inspection Date</dt><dd>{formatDate(selected.inspectionDate)}</dd></div>
              <div><dt>Inspector</dt><dd>{selected.inspector}</dd></div>
              <div><dt>Purity Check</dt><dd><CheckValue>{selected.purity}</CheckValue></dd></div>
              <div><dt>Stone Setting Check</dt><dd><CheckValue muted={selected.stoneSetting === "N/A"}>{selected.stoneSetting}</CheckValue></dd></div>
              <div><dt>Polish Check</dt><dd><CheckValue>{selected.polish}</CheckValue></dd></div>
              <div className={styles.weightDetail}><dt>Weight Match</dt><dd><CheckValue>{selected.weight}</CheckValue><small>Expected: {selected.expectedWeight}</small></dd></div>
              <div className={styles.remarks}><dt>Remarks</dt><dd>{selected.remarks}<small>{selected.result === "Approved" ? "Ready for Final Approval." : selected.result === "Rework" ? "Correction required before approval." : "Does not meet final quality standards."}</small></dd></div>
            </dl>
            <div className={styles.detailActions}>
              <button className={`${styles.button} ${styles.approveButton}`} onClick={() => updateResult("Approved")} type="button"><Check size={14} />Approve Final</button>
              <button className={`${styles.button} ${styles.reworkButton}`} onClick={() => updateResult("Rework")} type="button"><RefreshCcw size={14} />Send to Rework</button>
            </div>
          </Card>
        ) : null}
      </section>
    </div>
  );
}
