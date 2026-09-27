"use client";

import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Download,
  Eye,
  Filter,
  Plus,
  RotateCcw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./quality-control.module.css";

type InspectionResult = "Passed" | "Failed" | "Pending";

type Inspection = {
  id: string;
  product: string;
  category: string;
  date: string;
  result: InspectionResult;
  inspector: string;
};

type Filters = {
  query: string;
  category: string;
  result: string;
  from: string;
  to: string;
};

const INITIAL_FILTERS: Filters = {
  query: "",
  category: "All",
  result: "All",
  from: "2024-05-01",
  to: "2024-05-31",
};

const FIRST_INSPECTIONS: Inspection[] = [
  { id: "QC-2001", product: "Gold Necklace", category: "Necklace", date: "2024-05-02", result: "Passed", inspector: "Anil Verma" },
  { id: "QC-2002", product: "Diamond Ring", category: "Ring", date: "2024-05-02", result: "Failed", inspector: "Pooja Shah" },
  { id: "QC-2003", product: "Gold Bangles", category: "Bangles", date: "2024-05-03", result: "Passed", inspector: "Anil Verma" },
  { id: "QC-2004", product: "Platinum Chain", category: "Chain", date: "2024-05-03", result: "Pending", inspector: "Ravi Kumar" },
  { id: "QC-2005", product: "Gold Earrings", category: "Earrings", date: "2024-05-04", result: "Passed", inspector: "Pooja Shah" },
  { id: "QC-2006", product: "Diamond Pendant", category: "Pendant", date: "2024-05-04", result: "Failed", inspector: "Anil Verma" },
  { id: "QC-2007", product: "Gold Ring", category: "Ring", date: "2024-05-05", result: "Pending", inspector: "Ravi Kumar" },
  { id: "QC-2008", product: "Gold Bracelet", category: "Bracelet", date: "2024-05-05", result: "Passed", inspector: "Pooja Shah" },
];

const PRODUCT_POOL = [
  ["Gold Necklace", "Necklace"],
  ["Diamond Ring", "Ring"],
  ["Gold Bangles", "Bangles"],
  ["Platinum Chain", "Chain"],
  ["Gold Earrings", "Earrings"],
  ["Diamond Pendant", "Pendant"],
  ["Gold Bracelet", "Bracelet"],
] as const;
const INSPECTORS = ["Anil Verma", "Pooja Shah", "Ravi Kumar", "Neha Mehta"];

const GENERATED_INSPECTIONS: Inspection[] = Array.from({ length: 248 }, (_, index) => {
  const [product, category] = PRODUCT_POOL[index % PRODUCT_POOL.length];
  const result: InspectionResult = index < 182 ? "Passed" : index < 218 ? "Failed" : "Pending";
  const day = String(6 + (index % 26)).padStart(2, "0");
  return {
    id: `QC-${2009 + index}`,
    product,
    category,
    date: `2024-05-${day}`,
    result,
    inspector: INSPECTORS[index % INSPECTORS.length],
  };
});

const INITIAL_INSPECTIONS = [...FIRST_INSPECTIONS, ...GENERATED_INSPECTIONS];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(`${value}T00:00:00`),
  );
}

function MetricCard({ icon, label, value, meta, tone }: { icon: ReactNode; label: string; value: string; meta: string; tone: string }) {
  return (
    <Card className={styles.metric}>
      <span className={`${styles.metricIcon} ${styles[tone]}`}>{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>↗ {meta} from last month</small>
      </div>
    </Card>
  );
}

function StatusBadge({ result }: { result: InspectionResult }) {
  return <span className={`${styles.status} ${styles[result.toLowerCase()]}`}>{result}</span>;
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`${styles.field} ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function InspectionModal({
  inspection,
  onClose,
}: {
  inspection: Inspection;
  onClose: () => void;
}) {
  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <Card aria-labelledby="inspection-details-title" className={styles.detailsModal} role="dialog">
        <header className={styles.modalHeader}>
          <div>
            <span>QUALITY INSPECTION</span>
            <h2 id="inspection-details-title">{inspection.id}</h2>
          </div>
          <button aria-label="Close inspection details" className={styles.iconButton} onClick={onClose} type="button">
            <X size={17} />
          </button>
        </header>
        <dl className={styles.detailGrid}>
          <div><dt>Product</dt><dd>{inspection.product}</dd></div>
          <div><dt>Category</dt><dd>{inspection.category}</dd></div>
          <div><dt>Inspection Date</dt><dd>{formatDate(inspection.date)}</dd></div>
          <div><dt>Inspector</dt><dd>{inspection.inspector}</dd></div>
          <div><dt>Result</dt><dd><StatusBadge result={inspection.result} /></dd></div>
          <div><dt>Reference</dt><dd>Manufacturing QC</dd></div>
        </dl>
        <div className={styles.modalActions}>
          <button className="button" onClick={onClose} type="button">Close</button>
        </div>
      </Card>
    </div>
  );
}

function NewInspectionModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (inspection: Omit<Inspection, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Inspection, "id">>({
    product: "",
    category: "Necklace",
    date: "2024-05-31",
    result: "Pending",
    inspector: "Anil Verma",
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.product.trim()) return;
    onSave({ ...form, product: form.product.trim() });
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <Card aria-labelledby="new-inspection-title" className={styles.formModal} role="dialog">
        <header className={styles.modalHeader}>
          <div><span>QUALITY CONTROL</span><h2 id="new-inspection-title">New Inspection</h2></div>
          <button aria-label="Close new inspection form" className={styles.iconButton} onClick={onClose} type="button"><X size={17} /></button>
        </header>
        <form className={styles.inspectionForm} onSubmit={submit}>
          <Field className={styles.wide} label="Product Name *">
            <input autoFocus className="field" onChange={(event) => setForm((current) => ({ ...current, product: event.target.value }))} placeholder="Enter product name" required value={form.product} />
          </Field>
          <Field label="Category">
            <select className="select" onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} value={form.category}>
              {["Necklace", "Ring", "Bangles", "Chain", "Earrings", "Pendant", "Bracelet"].map((value) => <option key={value}>{value}</option>)}
            </select>
          </Field>
          <Field label="Inspection Date">
            <input className="field" onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} type="date" value={form.date} />
          </Field>
          <Field label="Inspector">
            <select className="select" onChange={(event) => setForm((current) => ({ ...current, inspector: event.target.value }))} value={form.inspector}>
              {INSPECTORS.map((value) => <option key={value}>{value}</option>)}
            </select>
          </Field>
          <Field label="Result">
            <select className="select" onChange={(event) => setForm((current) => ({ ...current, result: event.target.value as InspectionResult }))} value={form.result}>
              <option>Passed</option><option>Failed</option><option>Pending</option>
            </select>
          </Field>
          <div className={`${styles.modalActions} ${styles.wide}`}>
            <button className="button" onClick={onClose} type="button">Cancel</button>
            <button className={`button ${styles.primary}`} type="submit"><Plus size={15} />Add Inspection</button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function paginationTokens(page: number, totalPages: number): Array<number | "ellipsis"> {
  const pages = new Set([1, 2, 3, page - 1, page, page + 1, totalPages]);
  const values = [...pages].filter((value) => value > 0 && value <= totalPages).sort((a, b) => a - b);
  const tokens: Array<number | "ellipsis"> = [];
  values.forEach((value, index) => {
    if (index > 0 && value - values[index - 1] > 1) tokens.push("ellipsis");
    tokens.push(value);
  });
  return tokens;
}

export function QualityControl183() {
  const [records, setRecords] = useState(INITIAL_INSPECTIONS);
  const [draft, setDraft] = useState<Filters>(INITIAL_FILTERS);
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [selected, setSelected] = useState<Inspection | null>(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  const categories = useMemo(() => [...new Set(records.map((record) => record.category))].sort(), [records]);
  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesQuery = !query || `${record.id} ${record.product} ${record.inspector}`.toLowerCase().includes(query);
      const matchesCategory = filters.category === "All" || record.category === filters.category;
      const matchesResult = filters.result === "All" || record.result === filters.result;
      const matchesFrom = !filters.from || record.date >= filters.from;
      const matchesTo = !filters.to || record.date <= filters.to;
      return matchesQuery && matchesCategory && matchesResult && matchesFrom && matchesTo;
    });
  }, [filters, records]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const firstVisible = filtered.length ? (safePage - 1) * pageSize + 1 : 0;
  const lastVisible = Math.min(safePage * pageSize, filtered.length);
  const passed = records.filter((record) => record.result === "Passed").length;
  const failed = records.filter((record) => record.result === "Failed").length;
  const pending = records.filter((record) => record.result === "Pending").length;

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFilters(draft);
    setPage(1);
    setMessage("Inspection list updated.");
  }

  function resetFilters() {
    setDraft(INITIAL_FILTERS);
    setFilters(INITIAL_FILTERS);
    setPage(1);
    setMessage("Filters reset.");
  }

  function downloadInspection(inspection: Inspection) {
    const content = [
      `Inspection: ${inspection.id}`,
      `Product: ${inspection.product}`,
      `Category: ${inspection.category}`,
      `Date: ${formatDate(inspection.date)}`,
      `Inspector: ${inspection.inspector}`,
      `Result: ${inspection.result}`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${inspection.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage(`${inspection.id} downloaded.`);
  }

  function addInspection(inspection: Omit<Inspection, "id">) {
    const id = `QC-${2001 + records.length}`;
    setRecords((current) => [{ id, ...inspection }, ...current]);
    setDraft(INITIAL_FILTERS);
    setFilters(INITIAL_FILTERS);
    setPage(1);
    setCreating(false);
    setMessage(`${id} added successfully.`);
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<button className={`button ${styles.primary}`} onClick={() => setCreating(true)} type="button"><Plus size={16} />New Inspection</button>}
        description="Monitor product inspections, results, and quality approvals"
        title="Quality Control"
      />

      {message ? <p aria-live="polite" className={styles.notice}>{message}</p> : null}

      <section aria-label="Quality control summary" className={styles.metrics}>
        <MetricCard icon={<ClipboardCheck size={21} />} label="Total Inspections" meta="12.7%" tone="blue" value={records.length.toLocaleString()} />
        <MetricCard icon={<CheckCircle2 size={21} />} label="Passed" meta="14.2%" tone="green" value={passed.toLocaleString()} />
        <MetricCard icon={<XCircle size={21} />} label="Failed" meta="5.6%" tone="red" value={failed.toLocaleString()} />
        <MetricCard icon={<Clock3 size={21} />} label="Pending" meta="3.1%" tone="orange" value={pending.toLocaleString()} />
      </section>

      <Card className={styles.filters}>
        <form className={styles.filterGrid} onSubmit={applyFilters}>
          <Field className={styles.searchField} label="Search inspections">
            <span className={styles.inputWithIcon}>
              <Search aria-hidden="true" size={15} />
              <input aria-label="Search by QC number or product" onChange={(event) => setDraft((current) => ({ ...current, query: event.target.value }))} placeholder="Search by QC No or Product..." value={draft.query} />
            </span>
          </Field>
          <Field label="Category">
            <select className="select" onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))} value={draft.category}>
              <option value="All">All</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </Field>
          <Field label="Result">
            <select className="select" onChange={(event) => setDraft((current) => ({ ...current, result: event.target.value }))} value={draft.result}>
              <option value="All">All</option><option>Passed</option><option>Failed</option><option>Pending</option>
            </select>
          </Field>
          <Field label="From Date">
            <input className="field" onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value }))} type="date" value={draft.from} />
          </Field>
          <Field label="To Date">
            <input className="field" onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))} type="date" value={draft.to} />
          </Field>
          <div className={styles.filterActions}>
            <button className={`button ${styles.primary}`} type="submit"><Filter size={14} />Filter</button>
            <button aria-label="Reset filters" className="button" onClick={resetFilters} type="button"><RotateCcw size={14} /><span>Reset</span></button>
          </div>
        </form>
      </Card>

      <Card className={styles.tableCard}>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead><tr><th>QC No</th><th>Product Name</th><th>Category</th><th>Inspection Date</th><th>Result</th><th>Inspector</th><th>Action</th></tr></thead>
            <tbody>
              {visible.length ? visible.map((inspection) => (
                <tr key={inspection.id}>
                  <td><strong>{inspection.id}</strong></td>
                  <td>{inspection.product}</td>
                  <td>{inspection.category}</td>
                  <td>{formatDate(inspection.date)}</td>
                  <td><StatusBadge result={inspection.result} /></td>
                  <td>{inspection.inspector}</td>
                  <td>
                    <span className={styles.rowActions}>
                      <button aria-label={`View ${inspection.id}`} className={styles.actionButton} onClick={() => setSelected(inspection)} type="button"><Eye size={14} /></button>
                      <button aria-label={`Download ${inspection.id}`} className={styles.actionButton} onClick={() => downloadInspection(inspection)} type="button"><Download size={14} /></button>
                    </span>
                  </td>
                </tr>
              )) : <tr><td className={styles.empty} colSpan={7}>No inspections match the selected filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <footer className={styles.tableFooter}>
          <span>Showing {firstVisible} to {lastVisible} of {filtered.length.toLocaleString()} entries</span>
          <div className={styles.pagination}>
            <button aria-label="Previous page" disabled={safePage === 1} onClick={() => setPage(Math.max(1, safePage - 1))} type="button">‹</button>
            {paginationTokens(safePage, totalPages).map((token, index) => token === "ellipsis"
              ? <span className={styles.ellipsis} key={`ellipsis-${index}`}>…</span>
              : <button aria-current={safePage === token ? "page" : undefined} className={safePage === token ? styles.currentPage : ""} key={token} onClick={() => setPage(token)} type="button">{token}</button>)}
            <button aria-label="Next page" disabled={safePage === totalPages} onClick={() => setPage(Math.min(totalPages, safePage + 1))} type="button">›</button>
            <select aria-label="Rows per page" onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} value={pageSize}>
              <option value={8}>8 / page</option><option value={10}>10 / page</option><option value={20}>20 / page</option>
            </select>
          </div>
        </footer>
      </Card>

      {selected ? <InspectionModal inspection={selected} onClose={() => setSelected(null)} /> : null}
      {creating ? <NewInspectionModal onClose={() => setCreating(false)} onSave={addInspection} /> : null}
    </div>
  );
}
