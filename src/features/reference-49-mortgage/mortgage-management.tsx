"use client";

import {
  Banknote,
  CircleDollarSign,
  Clock3,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./mortgage-management.module.css";

type MortgageStatus = "Active" | "Released" | "Overdue";

type MortgageRow = {
  voucher: string;
  customer: string;
  weight: string;
  loan: string;
  status: MortgageStatus;
  issueDate: string;
};

const INITIAL_ROWS: MortgageRow[] = [
  { voucher: "MRG-001", customer: "Abdul Karim", weight: "50.00 g", loan: "৳ 2,50,000", status: "Active", issueDate: "Oct 10, 2024" },
  { voucher: "MRG-002", customer: "Rahima Begum", weight: "30.00 g", loan: "৳ 1,20,000", status: "Active", issueDate: "Oct 08, 2024" },
  { voucher: "MRG-003", customer: "Selim Ahmed", weight: "25.00 g", loan: "৳ 95,000", status: "Overdue", issueDate: "Sep 28, 2024" },
  { voucher: "MRG-004", customer: "Mst. Salma", weight: "40.00 g", loan: "৳ 1,80,000", status: "Active", issueDate: "Oct 15, 2024" },
  { voucher: "MRG-005", customer: "Jamal Uddin", weight: "20.00 g", loan: "৳ 75,000", status: "Released", issueDate: "Sep 20, 2024" },
  { voucher: "MRG-006", customer: "Rehan Islam", weight: "35.00 g", loan: "৳ 1,40,000", status: "Active", issueDate: "Oct 12, 2024" },
  { voucher: "MRG-007", customer: "Nasrin Akter", weight: "28.00 g", loan: "৳ 1,10,000", status: "Active", issueDate: "Oct 05, 2024" },
  { voucher: "MRG-008", customer: "Khaled Hossain", weight: "22.00 g", loan: "৳ 88,000", status: "Overdue", issueDate: "Sep 25, 2024" },
];

const tabs = ["All Mortgage", "Active", "Released", "Overdue"] as const;
type Tab = (typeof tabs)[number];

function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Card className={styles.metric}>
      <span className={styles.metricIcon}>{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </Card>
  );
}

function StatusPill({ status }: { status: MortgageStatus }) {
  return <span className={`${styles.status} ${styles[status.toLowerCase()]}`}>{status}</span>;
}

function MortgageDetails({ row, onClose }: { row: MortgageRow; onClose: () => void }) {
  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="presentation">
      <Card aria-labelledby="mortgage-details-title" aria-modal="true" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div>
            <span>Mortgage details</span>
            <h2 id="mortgage-details-title">{row.voucher}</h2>
          </div>
          <button aria-label="Close mortgage details" className={styles.iconButton} onClick={onClose} type="button"><X size={18} /></button>
        </header>
        <dl className={styles.detailGrid}>
          <div><dt>Customer</dt><dd>{row.customer}</dd></div>
          <div><dt>Status</dt><dd><StatusPill status={row.status} /></dd></div>
          <div><dt>Gold Weight</dt><dd>{row.weight}</dd></div>
          <div><dt>Loan Amount</dt><dd>{row.loan}</dd></div>
          <div><dt>Issue Date</dt><dd>{row.issueDate}</dd></div>
          <div><dt>Interest Rate</dt><dd>2.0% monthly</dd></div>
        </dl>
        <footer className={styles.modalFooter}>
          <button className={styles.secondaryButton} onClick={onClose} type="button">Close</button>
          <button className={styles.primaryButton} onClick={onClose} type="button">View full record</button>
        </footer>
      </Card>
    </div>
  );
}

function NewMortgageModal({ onClose, onSave }: { onClose: () => void; onSave: (row: MortgageRow) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("loan") ?? 0);
    const weight = Number(form.get("weight") ?? 0);
    const issueDate = String(form.get("issueDate") ?? "");
    onSave({
      voucher: String(form.get("voucher")),
      customer: String(form.get("customer")),
      weight: `${weight.toFixed(2)} g`,
      loan: `৳ ${amount.toLocaleString("en-IN")}`,
      status: String(form.get("status")) as MortgageStatus,
      issueDate: new Date(`${issueDate}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    });
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="presentation">
      <Card aria-labelledby="new-mortgage-title" aria-modal="true" className={styles.modal} role="dialog">
        <header className={styles.modalHeader}>
          <div>
            <span>Create a new pawn record</span>
            <h2 id="new-mortgage-title">New Mortgage</h2>
          </div>
          <button aria-label="Close new mortgage form" className={styles.iconButton} onClick={onClose} type="button"><X size={18} /></button>
        </header>
        <form className={styles.modalForm} onSubmit={submit}>
          <label><span>Voucher No.</span><input className="field" defaultValue={`MRG-${String(INITIAL_ROWS.length + 1).padStart(3, "0")}`} name="voucher" required /></label>
          <label><span>Customer Name</span><input className="field" name="customer" placeholder="Enter customer name" required /></label>
          <label><span>Gold Weight (g)</span><input className="field" min="0.01" name="weight" placeholder="0.00" required step="0.01" type="number" /></label>
          <label><span>Loan Amount (৳)</span><input className="field" min="1" name="loan" placeholder="0" required type="number" /></label>
          <label><span>Status</span><select className="select" defaultValue="Active" name="status"><option>Active</option><option>Released</option><option>Overdue</option></select></label>
          <label><span>Issue Date</span><input className="field" defaultValue="2024-10-26" name="issueDate" required type="date" /></label>
          <footer className={styles.modalFooter}>
            <button className={styles.secondaryButton} onClick={onClose} type="button">Cancel</button>
            <button className={styles.primaryButton} type="submit">Save Mortgage</button>
          </footer>
        </form>
      </Card>
    </div>
  );
}

export function MortgagePawnManagement195() {
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [activeTab, setActiveTab] = useState<Tab>("All Mortgage");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [details, setDetails] = useState<MortgageRow | null>(null);
  const [newMortgageOpen, setNewMortgageOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesTab = activeTab === "All Mortgage" || row.status === activeTab;
      const matchesSearch = !normalized || `${row.voucher} ${row.customer} ${row.loan}`.toLowerCase().includes(normalized);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, query, rows]);

  function selectTab(tab: Tab) {
    setActiveTab(tab);
    setPage(1);
    setNotice("");
  }

  return (
    <div className={styles.page}>
      <PageHeader
        action={<button className={styles.primaryButton} onClick={() => setNewMortgageOpen(true)} type="button"><Plus size={16} />New Mortgage</button>}
        description="Manage gold mortgage, loan, interest and settlement"
        title="Mortgage / Pawn Management"
      />

      {notice ? <p className={styles.notice} role="status">{notice}</p> : null}

      <section aria-label="Mortgage summary" className={styles.metrics}>
        <MetricCard icon={<Banknote size={21} />} label="Total Mortgage" value="36" />
        <MetricCard icon={<ShieldCheck size={21} />} label="Active Mortgage" value="28" />
        <MetricCard icon={<CircleDollarSign size={21} />} label="Total Loan Amount" value="৳ 18,75,000" />
        <MetricCard icon={<Clock3 size={21} />} label="Released" value="8" />
      </section>

      <Card className={styles.listCard}>
        <div className={styles.toolbar}>
          <div aria-label="Mortgage status" className={styles.tabs} role="tablist">
            {tabs.map((tab) => (
              <button aria-selected={activeTab === tab} className={activeTab === tab ? styles.activeTab : ""} key={tab} onClick={() => selectTab(tab)} role="tab" type="button">{tab}</button>
            ))}
          </div>
          <div className={styles.tools}>
            <label className={styles.search}>
              <Search aria-hidden="true" size={15} />
              <span className="sr-only">Search mortgages</span>
              <input onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search by customer name or voucher..." type="search" value={query} />
            </label>
            <button className={styles.filterButton} onClick={() => setNotice(`${filteredRows.length} matching mortgage records found.`)} type="button"><Filter size={15} />Filter</button>
          </div>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead><tr><th>#</th><th>Voucher No</th><th>Customer Name</th><th>Gold Weight</th><th>Loan Amount</th><th>Status</th><th>Issue Date</th><th>Action</th></tr></thead>
            <tbody>
              {filteredRows.length ? filteredRows.map((row, index) => (
                <tr key={row.voucher}>
                  <td>{index + 1}</td><td>{row.voucher}</td><td className={styles.customer}>{row.customer}</td><td>{row.weight}</td><td className={styles.loan}>{row.loan}</td><td><StatusPill status={row.status} /></td><td>{row.issueDate}</td>
                  <td><button aria-label={`View ${row.voucher}`} className={styles.actionButton} onClick={() => setDetails(row)} type="button"><MoreHorizontal size={17} /></button></td>
                </tr>
              )) : <tr><td className={styles.empty} colSpan={8}>No mortgages match the current search.</td></tr>}
            </tbody>
          </table>
        </div>

        <footer className={styles.tableFooter}>
          <span>Showing 1 to {filteredRows.length} of 36 entries</span>
          <div className={styles.pagination}>
            <button aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">‹</button>
            {[1, 2, 3, 4].map((number) => <button aria-current={page === number ? "page" : undefined} className={page === number ? styles.currentPage : ""} key={number} onClick={() => setPage(number)} type="button">{number}</button>)}
            <button aria-label="Next page" onClick={() => setPage((current) => Math.min(4, current + 1))} type="button">›</button>
            <select aria-label="Rows per page" defaultValue="10"><option value="10">10 per page</option><option value="20">20 per page</option></select>
          </div>
        </footer>
      </Card>

      {details ? <MortgageDetails onClose={() => setDetails(null)} row={details} /> : null}
      {newMortgageOpen ? <NewMortgageModal onClose={() => setNewMortgageOpen(false)} onSave={(row) => { setRows((current) => [row, ...current]); setNewMortgageOpen(false); setNotice(`${row.voucher} created successfully.`); }} /> : null}
    </div>
  );
}
