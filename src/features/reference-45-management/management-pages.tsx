"use client";

import {
  AlertTriangle,
  BadgeCheck,
  Boxes,
  Clock3,
  Crown,
  Eye,
  Filter,
  PackageCheck,
  PackageX,
  Plus,
  Search,
  UserCheck,
  UserRoundX,
  UsersRound,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import styles from "./management-pages.module.css";

type DataRow = { id: string; name: string; status: string; [key: string]: string };
type Column = { key: string; label: string };
type OptionFilter = { key: string; label: string; allLabel: string; options: string[] };
type Metric = { label: string; value: string; icon: ReactNode; meta?: string };
type ManagementConfig = {
  title: string;
  breadcrumb: string;
  addLabel: string;
  idPrefix: string;
  totalLabel: string;
  searchPlaceholder: string;
  metrics: Metric[];
  columns: Column[];
  filters: [OptionFilter, OptionFilter, OptionFilter];
  initialRows: DataRow[];
};

function badgeTone(value: string) {
  if (["Active", "In Stock"].includes(value)) return styles.active;
  if (["Low Stock", "Pending"].includes(value)) return styles.warning;
  if (value === "VIP") return styles.vip;
  return styles.inactive;
}

function Field({ label, children, full = false }: { label: string; children: ReactNode; full?: boolean }) {
  return <label className={`${styles.field} ${full ? styles.full : ""}`}><span>{label}</span>{children}</label>;
}

function MetricCard({ metric }: { metric: Metric }) {
  return <Card className={styles.stat}><span className={styles.statIcon}>{metric.icon}</span><div><p>{metric.label}</p><h2>{metric.value}</h2>{metric.meta ? <small>{metric.meta}</small> : null}</div></Card>;
}

function DetailsModal({ columns, row, onClose }: { columns: Column[]; row: DataRow; onClose: () => void }) {
  return <div className={styles.modalBackdrop} onMouseDown={(event) => event.currentTarget === event.target && onClose()} role="presentation"><Card aria-modal="true" className={styles.modal} role="dialog"><header className={styles.modalHeader}><h2>{row.name}</h2><button aria-label="Close details" className={styles.close} onClick={onClose} type="button"><X size={17} /></button></header><dl className={styles.details}>{columns.map((column) => <div key={column.key}><dt>{column.label}</dt><dd>{row[column.key]}</dd></div>)}</dl><div className={styles.modalActions}><button className="button" onClick={onClose} type="button">Close</button></div></Card></div>;
}

function AddModal({ config, onClose, onSave }: { config: ManagementConfig; onClose: () => void; onSave: (row: DataRow) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const row: DataRow = {
      id: `${config.idPrefix}-${String(config.initialRows.length + 1).padStart(4, "0")}`,
      name: String(form.get("name") ?? ""),
      status: String(form.get("status") ?? "Active"),
    };
    config.columns.forEach((column) => {
      if (column.key !== "id" && column.key !== "name" && column.key !== "status") row[column.key] = String(form.get(column.key) ?? "—");
    });
    onSave(row);
  }

  const extraColumns = config.columns.filter((column) => !["id", "name", "status"].includes(column.key)).slice(0, 3);
  return <div className={styles.modalBackdrop} role="presentation"><Card aria-modal="true" className={styles.modal} role="dialog"><header className={styles.modalHeader}><h2>{config.addLabel}</h2><button aria-label="Close form" className={styles.close} onClick={onClose} type="button"><X size={17} /></button></header><form className={styles.modalForm} onSubmit={submit}><Field label={config.columns.find((column) => column.key === "name")?.label ?? "Name"}><input className="field" name="name" placeholder="Enter name" required /></Field><Field label="Status"><select className="select" defaultValue="Active" name="status"><option>Active</option><option>Pending</option><option>Inactive</option><option>VIP</option><option>Low Stock</option></select></Field>{extraColumns.map((column) => <Field key={column.key} label={column.label}><input className="field" name={column.key} placeholder={`Enter ${column.label.toLowerCase()}`} required /></Field>)}<Field full label="Notes"><input className="field" name="notes" placeholder="Optional notes" /></Field><div className={styles.modalActions}><button className="button" onClick={onClose} type="button">Cancel</button><button className={`button ${styles.primary}`} type="submit">Save</button></div></form></Card></div>;
}

function ManagementPage({ config }: { config: ManagementConfig }) {
  const [rows, setRows] = useState(config.initialRows);
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => Object.fromEntries(config.filters.map((filter) => [filter.key, filter.allLabel])));
  const [selected, setSelected] = useState<DataRow | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => rows.filter((row) => {
    const matchesQuery = !query.trim() || Object.values(row).some((value) => value.toLowerCase().includes(query.trim().toLowerCase()));
    const matchesFilters = config.filters.every((filter) => filterValues[filter.key] === filter.allLabel || row[filter.key] === filterValues[filter.key]);
    return matchesQuery && matchesFilters;
  }), [config.filters, filterValues, query, rows]);

  function resetFilters() {
    setQuery("");
    setFilterValues(Object.fromEntries(config.filters.map((filter) => [filter.key, filter.allLabel])));
    setPage(1);
    setMessage("Filters reset.");
  }

  function changePage(nextPage: number) {
    setPage(nextPage);
    setMessage(`Page ${nextPage} selected.`);
  }

  return <div className={styles.page}><PageHeader action={<button className={`button ${styles.primary}`} onClick={() => setAddOpen(true)} type="button"><Plus size={15} />{config.addLabel}</button>} description={`Home  ›  ${config.breadcrumb}  ›  ${config.title}`} title={config.title} />{message ? <p className={styles.notice} role="status">{message}</p> : null}<section className={styles.stats}>{config.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}</section><Card className={styles.filters}><div className={styles.filterGrid}><Field label="Search"><div className={styles.searchWrap}><Search size={14} /><input className="field" onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={config.searchPlaceholder} value={query} /></div></Field>{config.filters.map((filter) => <Field key={filter.key} label={filter.label}><select className="select" onChange={(event) => { setFilterValues((current) => ({ ...current, [filter.key]: event.target.value })); setPage(1); }} value={filterValues[filter.key]}><option>{filter.allLabel}</option>{filter.options.map((option) => <option key={option}>{option}</option>)}</select></Field>)}<button className={`button ${styles.primary} ${styles.filterButton}`} onClick={() => setMessage(`${filteredRows.length} matching records found.`)} type="button"><Filter size={14} />Filter</button></div></Card><Card className={styles.tableCard}><div className={styles.tableScroll}><table className={styles.table}><thead><tr>{config.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>Action</th></tr></thead><tbody>{filteredRows.length ? filteredRows.map((row) => <tr key={row.id}>{config.columns.map((column) => <td key={column.key}>{column.key === "status" ? <span className={`${styles.status} ${badgeTone(row.status)}`}>{row.status}</span> : row[column.key]}</td>)}<td><button className={styles.view} onClick={() => setSelected(row)} type="button"><Eye size={11} />View</button></td></tr>) : <tr><td className={styles.empty} colSpan={config.columns.length + 1}>No matching records found. <button className="button" onClick={resetFilters} type="button">Clear filters</button></td></tr>}</tbody></table></div><footer className={styles.footer}><span>Showing 1 to {filteredRows.length} of {config.totalLabel}</span><div className={styles.pager}><button aria-label="Previous page" disabled={page === 1} onClick={() => changePage(page - 1)} type="button">‹</button>{[1, 2, 3, 4, 5].map((number) => <button className={page === number ? styles.current : ""} key={number} onClick={() => changePage(number)} type="button">{number}</button>)}<button aria-label="Next page" onClick={() => changePage(page + 1)} type="button">›</button><select aria-label="Rows per page" className={styles.pageSize} defaultValue="10"><option value="10">10 / page</option><option value="25">25 / page</option></select></div></footer></Card>{addOpen ? <AddModal config={config} onClose={() => setAddOpen(false)} onSave={(row) => { setRows((current) => [row, ...current]); setAddOpen(false); setMessage(`${row.name} added successfully.`); }} /> : null}{selected ? <DetailsModal columns={config.columns} onClose={() => setSelected(null)} row={selected} /> : null}</div>;
}

const productConfig: ManagementConfig = {
  title: "Product Management",
  breadcrumb: "Product Management",
  addLabel: "Add Product",
  idPrefix: "PRO",
  totalLabel: "1,245 records",
  searchPlaceholder: "Search products...",
  metrics: [
    { label: "Total Products", value: "1,245", icon: <Boxes size={21} /> },
    { label: "Active Products", value: "1,082", icon: <BadgeCheck size={21} /> },
    { label: "Inactive Products", value: "98", icon: <PackageX size={21} /> },
    { label: "Low Stock Products", value: "65", icon: <AlertTriangle size={21} /> },
  ],
  columns: [
    { key: "id", label: "Product Code" },
    { key: "name", label: "Product Name" },
    { key: "category", label: "Category" },
    { key: "purity", label: "Gold Purity" },
    { key: "weight", label: "Weight (g)" },
    { key: "status", label: "Status" },
  ],
  filters: [
    { key: "category", label: "Category", allLabel: "All Categories", options: ["Rings", "Chains", "Necklaces", "Bangles", "Earrings", "Anklets", "Pendants"] },
    { key: "status", label: "Status", allLabel: "All Status", options: ["Active", "Inactive", "Low Stock"] },
    { key: "karigar", label: "Karigar", allLabel: "All Karigars", options: ["Ramesh Soni", "Mahesh Verma", "Suresh Kumar"] },
  ],
  initialRows: [
    { id: "PRO-0001", name: "22K Gold Ring", category: "Rings", purity: "22K (91.6%)", weight: "4.250", karigar: "Ramesh Soni", status: "Active" },
    { id: "PRO-0002", name: "Gold Chain", category: "Chains", purity: "22K (91.6%)", weight: "12.500", karigar: "Mahesh Verma", status: "Active" },
    { id: "PRO-0003", name: "Diamond Necklace", category: "Necklaces", purity: "18K (75.0%)", weight: "18.750", karigar: "Suresh Kumar", status: "Active" },
    { id: "PRO-0004", name: "Gold Bangles", category: "Bangles", purity: "22K (91.6%)", weight: "28.300", karigar: "Ramesh Soni", status: "Low Stock" },
    { id: "PRO-0005", name: "Gold Earrings", category: "Earrings", purity: "22K (91.6%)", weight: "5.600", karigar: "Mahesh Verma", status: "Active" },
    { id: "PRO-0006", name: "Silver Anklet", category: "Anklets", purity: "925 Silver", weight: "15.200", karigar: "Suresh Kumar", status: "Inactive" },
    { id: "PRO-0007", name: "Gold Pendant", category: "Pendants", purity: "18K (75.0%)", weight: "3.850", karigar: "Ramesh Soni", status: "Active" },
  ],
};

const supplierConfig: ManagementConfig = {
  title: "Supplier Management",
  breadcrumb: "Supplier Management",
  addLabel: "Add Supplier",
  idPrefix: "SUP",
  totalLabel: "156 records",
  searchPlaceholder: "Search suppliers...",
  metrics: [
    { label: "Total Suppliers", value: "156", icon: <UsersRound size={21} /> },
    { label: "Active Suppliers", value: "128", icon: <UserCheck size={21} /> },
    { label: "Inactive Suppliers", value: "18", icon: <UserRoundX size={21} /> },
    { label: "Pending Approval", value: "10", icon: <Clock3 size={21} /> },
  ],
  columns: [
    { key: "name", label: "Supplier Name" },
    { key: "contact", label: "Contact Person" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ],
  filters: [
    { key: "type", label: "Type", allLabel: "All Types", options: ["Gold", "Diamond", "Silver"] },
    { key: "location", label: "Location", allLabel: "All Locations", options: ["Mumbai", "Surat", "Jaipur", "Delhi"] },
    { key: "status", label: "Status", allLabel: "All Status", options: ["Active", "Inactive", "Pending"] },
  ],
  initialRows: [
    { id: "SUP-0001", name: "Mahesh Gold Suppliers", contact: "Mahesh Gupta", phone: "98765 43210", email: "mahesh@goldsuppliers.com", type: "Gold", location: "Mumbai", status: "Active" },
    { id: "SUP-0002", name: "Shree Gems Traders", contact: "Ravi Shah", phone: "98201 23456", email: "ravi@shreegems.com", type: "Diamond", location: "Surat", status: "Active" },
    { id: "SUP-0003", name: "Lakshmi Jewellers Supply", contact: "Suresh Kumar", phone: "97654 32109", email: "suresh@lakshmijewels.com", type: "Gold", location: "Jaipur", status: "Active" },
    { id: "SUP-0004", name: "Diamond Hub Pvt. Ltd.", contact: "Neha Mehta", phone: "99887 66554", email: "neha@diamondhub.com", type: "Diamond", location: "Mumbai", status: "Inactive" },
    { id: "SUP-0005", name: "Silver Line Suppliers", contact: "Amit Verma", phone: "97123 45098", email: "amit@silverline.com", type: "Silver", location: "Delhi", status: "Active" },
    { id: "SUP-0006", name: "Ratan Metals", contact: "Vikram Singh", phone: "98100 22334", email: "vikram@ratanmetals.com", type: "Gold", location: "Surat", status: "Pending" },
  ],
};

const customerConfig: ManagementConfig = {
  title: "Customer Management",
  breadcrumb: "Customer Management",
  addLabel: "Add Customer",
  idPrefix: "CUS",
  totalLabel: "842 records",
  searchPlaceholder: "Search customers...",
  metrics: [
    { label: "Total Customers", value: "842", icon: <UsersRound size={21} /> },
    { label: "Active Customers", value: "726", icon: <UserCheck size={21} /> },
    { label: "VIP Customers", value: "78", icon: <Crown size={21} /> },
    { label: "Inactive Customers", value: "38", icon: <UserRoundX size={21} /> },
  ],
  columns: [
    { key: "name", label: "Customer Name" },
    { key: "type", label: "Customer Type" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "purchase", label: "Total Purchase" },
    { key: "status", label: "Status" },
  ],
  filters: [
    { key: "type", label: "Customer Type", allLabel: "All Types", options: ["Retail", "Wholesale"] },
    { key: "location", label: "Location", allLabel: "All Locations", options: ["Mumbai", "Surat", "Jaipur", "Delhi"] },
    { key: "status", label: "Status", allLabel: "All Status", options: ["Active", "VIP", "Inactive"] },
  ],
  initialRows: [
    { id: "CUS-0001", name: "Ramesh Jewellers", type: "Retail", phone: "98765 43210", email: "ramesh@jewellers.com", purchase: "₹ 12,45,600", location: "Mumbai", status: "Active" },
    { id: "CUS-0002", name: "Mahesh Gold House", type: "Wholesale", phone: "98201 23456", email: "mahesh@goldhouse.com", purchase: "₹ 25,10,750", location: "Surat", status: "VIP" },
    { id: "CUS-0003", name: "Suresh Ornaments", type: "Retail", phone: "97654 32109", email: "suresh@ornaments.com", purchase: "₹ 8,75,430", location: "Jaipur", status: "Active" },
    { id: "CUS-0004", name: "Lakshmi Jewellers", type: "Wholesale", phone: "99876 54321", email: "lakshmi@jewellers.com", purchase: "₹ 18,90,200", location: "Mumbai", status: "VIP" },
    { id: "CUS-0005", name: "Sri Balaji Jewellers", type: "Retail", phone: "96543 21098", email: "balaji@jewellers.com", purchase: "₹ 6,45,800", location: "Delhi", status: "Active" },
    { id: "CUS-0006", name: "Shree Gems", type: "Wholesale", phone: "90321 65478", email: "shree@gems.com", purchase: "₹ 11,20,300", location: "Surat", status: "Inactive" },
  ],
};

export function ProductManagement177() { return <ManagementPage config={productConfig} />; }
export function SupplierManagement178() { return <ManagementPage config={supplierConfig} />; }
export function CustomerManagement179() { return <ManagementPage config={customerConfig} />; }
