"use client";

import { useState, type FormEvent } from "react";
import { Boxes, Building2, CircleDollarSign, Eye, FilePenLine, Filter, Plus, Truck, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MetricCard, Notice, StatusPill } from "@/features/reference-53/shared";
import { BranchBarChart, RingChart } from "./analytics";
import styles from "./screen.module.css";

type Branch = {
  code: string;
  name: string;
  manager: string;
  phone: string;
  stockValue: string;
  sales: string;
  status: "Active" | "Inactive";
};

const initialBranches: Branch[] = [
  { code: "BR-001", name: "Main Branch", manager: "Abdul Karim", phone: "01872-123456", stockValue: "৳ 5,25,40,000", sales: "৳ 1,15,40,000", status: "Active" },
  { code: "BR-002", name: "Uttara Branch", manager: "Jalal Uddin", phone: "01711-234567", stockValue: "৳ 2,35,20,000", sales: "৳ 45,60,000", status: "Active" },
  { code: "BR-003", name: "Dhanmondi Branch", manager: "Rafiqul Islam", phone: "01822-345678", stockValue: "৳ 1,85,10,000", sales: "৳ 38,75,000", status: "Active" },
  { code: "BR-004", name: "Chattogram Branch", manager: "Masud Rana", phone: "01845-456789", stockValue: "৳ 1,95,30,000", sales: "৳ 42,20,000", status: "Active" },
  { code: "BR-005", name: "Sylhet Branch", manager: "Harun Or Rashid", phone: "01788-678901", stockValue: "৳ 1,44,40,000", sales: "৳ 36,50,000", status: "Active" },
];

type DialogState = { mode: "add" | "edit" | "view"; row?: Branch } | null;

function BranchDialog({ state, onClose, onSave }: { state: NonNullable<DialogState>; onClose: () => void; onSave: (row: Branch) => void }) {
  const readOnly = state.mode === "view";
  const [name, setName] = useState(state.row?.name ?? "");
  const [manager, setManager] = useState(state.row?.manager ?? "");
  const [phone, setPhone] = useState(state.row?.phone ?? "");
  const [status, setStatus] = useState<Branch["status"]>(state.row?.status ?? "Active");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ code: state.row?.code ?? "", name, manager, phone, status, stockValue: state.row?.stockValue ?? "৳ 0", sales: state.row?.sales ?? "৳ 0" });
  }

  return (
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <Card aria-modal="true" as="section" className={styles.dialog} role="dialog">
        <header className={styles.dialogHeader}><div><h2>{state.mode === "add" ? "Add Branch" : state.mode === "edit" ? "Edit Branch" : "Branch Details"}</h2><p>{state.row?.code ?? "Create a new business location"}</p></div><button aria-label="Close" className={styles.closeButton} onClick={onClose} type="button"><X size={17} /></button></header>
        <form className={styles.dialogForm} onSubmit={submit}>
          <label><span>Branch Name</span><input className="field" disabled={readOnly} onChange={(event) => setName(event.target.value)} required value={name} /></label>
          <label><span>Manager</span><input className="field" disabled={readOnly} onChange={(event) => setManager(event.target.value)} required value={manager} /></label>
          <label><span>Phone</span><input className="field" disabled={readOnly} onChange={(event) => setPhone(event.target.value)} required value={phone} /></label>
          <label><span>Status</span><select className="select" disabled={readOnly} onChange={(event) => setStatus(event.target.value as Branch["status"])} value={status}><option>Active</option><option>Inactive</option></select></label>
          <footer className={styles.dialogActions}><button className={styles.secondaryButton} onClick={onClose} type="button">{readOnly ? "Close" : "Cancel"}</button>{readOnly ? null : <button className={styles.primaryButton} type="submit">Save Branch</button>}</footer>
        </form>
      </Card>
    </div>
  );
}

export function Reference54BranchManagement() {
  const [rows, setRows] = useState(initialBranches);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [message, setMessage] = useState("");

  function save(row: Branch) {
    setRows((current) => dialog?.mode === "add"
      ? [...current, { ...row, code: `BR-${String(current.length + 1).padStart(3, "0")}` }]
      : current.map((item) => item.code === row.code ? row : item));
    setMessage(`${row.name} was saved.`);
    setDialog(null);
  }

  return (
    <div className={styles.page}>
      <section className={styles.metrics4}>
        <MetricCard accent="blue" icon={<Building2 size={17} />} label="Total Branches" note="" value={String(rows.length)} />
        <MetricCard accent="green" icon={<Boxes size={17} />} label="Total Branch Stock Value" note="" value="৳ 12,85,40,000" />
        <MetricCard accent="blue" icon={<CircleDollarSign size={17} />} label="Total Sales (This Month)" note="" value="৳ 2,78,45,600" />
        <MetricCard accent="orange" icon={<Truck size={17} />} label="Stock in Transit" note="" value="৳ 55,80,000" />
      </section>

      <Card className={styles.tableCard}>
        <header className={styles.cardHeader}><h2>Branch List</h2><div className={styles.headerControls}><button className={styles.filterButton} onClick={() => setMessage(`${rows.length} active branches found.`)} type="button"><Filter size={12} />Filter</button><button className={styles.primaryButton} onClick={() => setDialog({ mode: "add" })} type="button"><Plus size={13} />Add Branch</button></div></header>
        {message ? <div className={styles.noticeWrap}><Notice>{message}</Notice></div> : null}
        <div className={styles.tableScroller}>
          <table className={`${styles.dataTable} ${styles.branchTable}`}>
            <caption className="sr-only">Branch list</caption>
            <thead><tr><th>#</th><th>Branch Code</th><th>Branch Name</th><th>Manager</th><th>Phone</th><th>Stock Value (৳)</th><th>This Month Sales (৳)</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{rows.map((row, index) => <tr key={row.code}><td>{index + 1}</td><td><strong>{row.code}</strong></td><td>{row.name}</td><td>{row.manager}</td><td>{row.phone}</td><td>{row.stockValue}</td><td>{row.sales}</td><td><StatusPill tone={row.status === "Active" ? "success" : "danger"}>{row.status}</StatusPill></td><td><div className={styles.actions}><button aria-label={`View ${row.name}`} onClick={() => setDialog({ mode: "view", row })} type="button"><Eye size={13} /></button><button aria-label={`Edit ${row.name}`} onClick={() => setDialog({ mode: "edit", row })} type="button"><FilePenLine size={13} /></button></div></td></tr>)}</tbody>
          </table>
        </div>
      </Card>

      <section className={styles.bottomGrid2}>
        <Card className={styles.sectionCard}><h2>Stock Value by Branch</h2><div className={styles.tableScroller}><BranchBarChart data={[{ label: "Main Branch", short: "Main\nBranch", value: 5.25 }, { label: "Uttara Branch", short: "Uttara\nBranch", value: 2.35 }, { label: "Dhanmondi Branch", short: "Dhanmondi\nBranch", value: 1.85 }, { label: "Chattogram Branch", short: "Chattogram\nBranch", value: 1.95 }, { label: "Sylhet Branch", short: "Sylhet\nBranch", value: 1.44 }]} /></div></Card>
        <Card className={styles.sectionCard}><h2>Branch Sales (This Month)</h2><RingChart centerLabel="Total Sales" centerValue="৳ 2,78,45,600" segments={[{ label: "Main Branch", value: 41.4, color: "#1769df" }, { label: "Uttara Branch", value: 16.4, color: "#4a83e5" }, { label: "Dhanmondi Branch", value: 13.9, color: "#83a7ee" }, { label: "Chattogram Branch", value: 15.2, color: "#32aa8a" }, { label: "Sylhet Branch", value: 13.1, color: "#84cf89" }]} /></Card>
      </section>
      {dialog ? <BranchDialog onClose={() => setDialog(null)} onSave={save} state={dialog} /> : null}
    </div>
  );
}
